package email

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"path/filepath"

	"server/internal/broker"
	"server/internal/config"
	"server/internal/dto"
	"server/internal/utils"

	amqp "github.com/rabbitmq/amqp091-go"
)

type EmailService struct {
	cfg    *config.Config
	broker *broker.RabbitBroker
	resend *ResendClient
}

func NewEmailService(cfg *config.Config, b *broker.RabbitBroker) *EmailService {
	return &EmailService{
		cfg:    cfg,
		broker: b,
		resend: NewResendClient(cfg.Resend),
	}
}

// SendVerificationEmail publishes a verification email task to the queue
func (s *EmailService) SendVerificationEmail(ctx context.Context, to, token string) error {
	verifyLink := fmt.Sprintf("%s?token=%s", s.cfg.Frontend.VerificationUrl, token)

	payload := dto.EmailPayload{
		To:      to,
		Subject: "Verify your Hookzen account",
		Type:    dto.EmailVerify,
		Data: map[string]any{
			"verify_link": verifyLink,
			"id":          token[:8],
		},
	}

	return s.publish(ctx, payload)
}

// SendPasswordResetEmail publishes a password reset email task to the queue
func (s *EmailService) SendPasswordResetEmail(ctx context.Context, to, token string) error {
	resetLink := fmt.Sprintf("%s?token=%s", s.cfg.Frontend.ResetUrl, token)

	payload := dto.EmailPayload{
		To:      to,
		Subject: "Reset your Hookzen password",
		Type:    dto.EmailReset,
		Data: map[string]any{
			"reset_link": resetLink,
			"request_id": token[:8],
		},
	}

	return s.publish(ctx, payload)
}

func (s *EmailService) publish(ctx context.Context, payload dto.EmailPayload) error {
	ch, err := s.broker.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	body, err := json.Marshal(payload)
	if err != nil {
		return utils.Internal(err)
	}

	err = ch.PublishWithContext(ctx,
		"",                        // exchange
		s.cfg.RabbitMQ.EmailQueue, // routing key
		false,                     // mandatory
		false,                     // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)

	if err != nil {
		utils.Error("failed to publish email to queue", err, map[string]any{"to": payload.To})
		return utils.Internal(err)
	}

	return nil
}

// ProcessEmail handles the actual sending logic (called by consumer)
func (s *EmailService) ProcessEmail(payload dto.EmailPayload) error {
	templateName := string(payload.Type) + ".html"
	// Templates are located in internal/templates/
	tmplPath := filepath.Join("internal", "templates", templateName)

	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		return fmt.Errorf("parse template %s: %w", templateName, err)
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, payload.Data); err != nil {
		return fmt.Errorf("execute template %s: %w", templateName, err)
	}

	return s.resend.SendEmail(payload.To, payload.Subject, body.String())
}
