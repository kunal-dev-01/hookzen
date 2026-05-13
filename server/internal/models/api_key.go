package models

import (
	"time"

	"github.com/google/uuid"
)

type APIKey struct {
	ID         uuid.UUID  `json:"id" db:"id" validate:"required"`
	UserID     uuid.UUID  `json:"user_id" db:"user_id" validate:"required"`
	Name       string     `json:"name" db:"name" validate:"required,min=3,max=100"`
	KeyHash    string     `json:"-" db:"key_hash" validate:"required"`
	KeyPrefix  string     `json:"key_prefix" db:"key_prefix" validate:"required"`
	LastUsedAt *time.Time `json:"last_used_at" db:"last_used_at"`
	ExpiresAt  *time.Time `json:"expires_at" db:"expires_at"`
	IsActive   bool       `json:"is_active" db:"is_active"`
	CreatedAt  time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at" db:"updated_at"`
}

// APIKeyResponse is what we show in the UI (never show the hash or full key)
type APIKeyResponse struct {
	ID         uuid.UUID  `json:"id"`
	Name       string     `json:"name"`
	KeyPrefix  string     `json:"key_prefix"`
	LastUsedAt *time.Time `json:"last_used_at"`
	ExpiresAt  *time.Time `json:"expires_at"`
	IsActive   bool       `json:"is_active"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (k *APIKey) ToResponse() APIKeyResponse {
	return APIKeyResponse{
		ID:         k.ID,
		Name:       k.Name,
		KeyPrefix:  k.KeyPrefix,
		LastUsedAt: k.LastUsedAt,
		ExpiresAt:  k.ExpiresAt,
		IsActive:   k.IsActive,
		CreatedAt:  k.CreatedAt,
	}
}
