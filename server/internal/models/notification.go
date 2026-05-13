package models

import (
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID        uuid.UUID `json:"id" db:"id" validate:"required"`
	UserID    uuid.UUID `json:"user_id" db:"user_id" validate:"required"`
	Title     string    `json:"title" db:"title" validate:"required"`
	Message   string    `json:"message" db:"message" validate:"required"`
	Type      string    `json:"type" db:"type" validate:"required,oneof=info success warning error"`
	Link      *string   `json:"link,omitempty" db:"link"`
	IsRead    bool      `json:"is_read" db:"is_read"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
