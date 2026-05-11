package dto

type EmailType string

const (
	EmailVerify EmailType = "verify"
	EmailReset  EmailType = "reset"
)

type EmailPayload struct {
	To      string         `json:"to"`
	Subject string         `json:"subject"`
	Type    EmailType      `json:"type"`
	Data    map[string]any `json:"data"`
}
