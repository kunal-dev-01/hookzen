package dto

import "time"

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
