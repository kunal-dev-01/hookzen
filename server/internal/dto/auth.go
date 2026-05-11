package dto

import (
	"time"

	"server/internal/models"
)

// ─────────────────────────────────────────────────────────────────────────────
// Client Info Dto
// ─────────────────────────────────────────────────────────────────────────────

type ClientInfo struct {
	IP         string
	Browser    string
	OS         string
	DeviceName string
	City       string
	Country    string
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Metadata Dto
// ─────────────────────────────────────────────────────────────────────────────

type SessionMetadata struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	RefreshToken string    `json:"refresh_token"`
	IPAddress    string    `json:"ip_address"`
	Browser      string    `json:"browser"`
	OS           string    `json:"os"`
	DeviceName   string    `json:"device_name"`
	City         string    `json:"city"`
	Country      string    `json:"country"`
	CreatedAt    time.Time `json:"created_at"`
	ExpiresAt    time.Time `json:"expires_at"`
}

func (s *SessionMetadata) ToSafe(currentSessionID string) SafeSession {
	return SafeSession{
		ID:         s.ID,
		IPAddress:  s.IPAddress,
		Browser:    s.Browser,
		OS:         s.OS,
		DeviceName: s.DeviceName,
		City:       s.City,
		Country:    s.Country,
		CreatedAt:  s.CreatedAt,
		ExpiresAt:  s.ExpiresAt,
		IsCurrent:  s.ID == currentSessionID,
	}
}

type SafeSession struct {
	ID         string    `json:"id"`
	IPAddress  string    `json:"ip_address"`
	Browser    string    `json:"browser"`
	OS         string    `json:"os"`
	DeviceName string    `json:"device_name"`
	City       string    `json:"city"`
	Country    string    `json:"country"`
	CreatedAt  time.Time `json:"created_at"`
	ExpiresAt  time.Time `json:"expires_at"`
	IsCurrent  bool      `json:"is_current"`
}
// ─────────────────────────────────────────────────────────────────────────────
// Account Requests
// ─────────────────────────────────────────────────────────────────────────────

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=72"`
	FullName string `json:"full_name" validate:"required,min=2,max=100"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" validate:"required"`
}

type ResendVerificationRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type AuthResponse struct {
	User         models.SafeUser `json:"user"`
	AccessToken  string          `json:"access_token"`
	RefreshToken string          `json:"refresh_token"`
}
