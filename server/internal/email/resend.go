package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"server/internal/config"
	"server/internal/utils"
)

type ResendClient struct {
	apiKey    string
	fromEmail string
	client    *http.Client
}

func NewResendClient(cfg config.ResendConfig) *ResendClient {
	return &ResendClient{
		apiKey:    cfg.APIKey,
		fromEmail: cfg.FromEmail,
		client:    &http.Client{Timeout: 10 * time.Second},
	}
}

type resendRequest struct {
	From    string `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

func (c *ResendClient) SendEmail(to, subject, html string) error {
	url := "https://api.resend.com/emails"

	reqBody := resendRequest{
		From:    c.fromEmail,
		To:      []string{to},
		Subject: subject,
		HTML:    html,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("marshal resend request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("create resend request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("execute resend request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		var resErr any
		json.NewDecoder(resp.Body).Decode(&resErr)
		utils.Error("resend api error", fmt.Errorf("status: %d", resp.StatusCode), map[string]any{"response": resErr})
		return fmt.Errorf("resend api error: status %d", resp.StatusCode)
	}

	return nil
}
