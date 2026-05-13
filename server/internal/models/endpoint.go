package models

import (
	"time"

	"github.com/google/uuid"
)

type Endpoint struct {
	ID        uuid.UUID `json:"id" db:"id" validate:"required"`
	UserID    uuid.UUID `json:"user_id" db:"user_id" validate:"required"`
	Name      string    `json:"name" db:"name" validate:"required,min=3,max=100"`
	Slug      string    `json:"slug" db:"slug" validate:"required,alphanum,min=3,max=50"`
	Secret    string    `json:"secret" db:"secret" validate:"required"`
	IsActive  bool      `json:"is_active" db:"is_active"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// EndpointResponse represents the public view of an endpoint
type EndpointResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (e *Endpoint) ToResponse() EndpointResponse {
	return EndpointResponse{
		ID:        e.ID,
		Name:      e.Name,
		Slug:      e.Slug,
		IsActive:  e.IsActive,
		CreatedAt: e.CreatedAt,
		UpdatedAt: e.UpdatedAt,
	}
}
