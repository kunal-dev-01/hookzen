package models

import (
	"time"

	"github.com/google/uuid"
)

type Destination struct {
	ID         uuid.UUID `json:"id" db:"id" validate:"required"`
	EndpointID uuid.UUID `json:"endpoint_id" db:"endpoint_id" validate:"required"`
	Name       string    `json:"name" db:"name" validate:"required,min=3,max=100"`
	URL        string    `json:"url" db:"url" validate:"required,url"`
	Method     string    `json:"method" db:"method" validate:"required,oneof=POST PUT PATCH"`
	IsActive   bool      `json:"is_active" db:"is_active"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}
