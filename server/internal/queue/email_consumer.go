package queue

import (
	"context"
	"encoding/json"
	"time"

	"server/internal/broker"
	"server/internal/config"
	"server/internal/dto"
	"server/internal/email"
	"server/internal/utils"

	amqp "github.com/rabbitmq/amqp091-go"
)

type EmailConsumer struct {
	broker  *broker.RabbitBroker
	service *email.EmailService
	cfg     *config.Config
}

func NewEmailConsumer(b *broker.RabbitBroker, s *email.EmailService, cfg *config.Config) *EmailConsumer {
	return &EmailConsumer{
		broker:  b,
		service: s,
		cfg:     cfg,
	}
}

// Start begins consuming email tasks from the queue
func (c *EmailConsumer) Start(ctx context.Context) error {
	ch, err := c.broker.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	// Ensure queue exists
	_, err = ch.QueueDeclare(
		c.cfg.RabbitMQ.EmailQueue, // name
		true,                      // durable
		false,                     // delete when unused
		false,                     // exclusive
		false,                     // no-wait
		nil,                       // arguments
	)
	if err != nil {
		return err
	}

	msgs, err := ch.Consume(
		c.cfg.RabbitMQ.EmailQueue, // queue
		"email-service",           // consumer
		false,                     // auto-ack (manual ack for retry control)
		false,                     // exclusive
		false,                     // no-local
		false,                     // no-wait
		nil,                       // args
	)
	if err != nil {
		return err
	}

	utils.Info("email consumer started", map[string]any{"queue": c.cfg.RabbitMQ.EmailQueue})

	for {
		select {
		case <-ctx.Done():
			utils.Info("email consumer stopping", nil)
			return nil
		case d, ok := <-msgs:
			if !ok {
				utils.Warn("email consumer channel closed", nil)
				return nil
			}
			// Process each message in a goroutine for concurrency
			go c.handleDelivery(d)
		}
	}
}

func (c *EmailConsumer) handleDelivery(d amqp.Delivery) {
	var payload dto.EmailPayload
	if err := json.Unmarshal(d.Body, &payload); err != nil {
		utils.Error("failed to unmarshal email payload", err, nil)
		d.Ack(false) // Drop corrupted message
		return
	}

	var lastErr error
	maxRetries := c.cfg.RabbitMQ.MaxRetries
	if maxRetries <= 0 {
		maxRetries = 3 // Fallback default
	}

	for i := 0; i < maxRetries; i++ {
		if err := c.service.ProcessEmail(payload); err == nil {
			utils.Debug("email sent successfully", map[string]any{
				"to":   payload.To,
				"type": payload.Type,
			})
			d.Ack(false)
			return
		} else {
			lastErr = err
			utils.Warn("failed to send email, retrying", map[string]any{
				"to":      payload.To,
				"attempt": i + 1,
				"max":     maxRetries,
				"error":   err.Error(),
			})
			// Exponential backoff or simple wait
			time.Sleep(time.Duration(i+1) * 2 * time.Second)
		}
	}

	utils.Error("failed to send email after maximum retries", lastErr, map[string]any{
		"to":   payload.To,
		"type": payload.Type,
	})
	
	// Final ack to remove from queue even if failed (to avoid infinite loop)
	// In a real scenario, you would move this to a Dead Letter Queue (DLQ)
	d.Ack(false)
}
