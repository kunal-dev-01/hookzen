package models

import (
	"time"

	"github.com/google/uuid"
)

type UserPreferences struct {
	Notifications struct {
		Email           bool `json:"email" db:"email"`
		WebhookFailures bool `json:"webhook_failures" db:"webhook_failures"`
	} `json:"notifications" db:"notifications"`
}

type User struct {
	ID              uuid.UUID       `json:"id" db:"id" validate:"required"`
	Email           string          `json:"email" db:"email" validate:"required,email"`
	PasswordHash    string          `json:"-" db:"password_hash" validate:"required"`
	FullName        string          `json:"full_name" db:"full_name" validate:"required"`
	IsEmailVerified bool            `json:"is_email_verified" db:"is_email_verified"`
	IsActive        bool            `json:"is_active" db:"is_active"`
	LastLoginAt     *time.Time      `json:"last_login_at" db:"last_login_at"`
	Preferences     UserPreferences `json:"preferences" db:"preferences"`
	CreatedAt       time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at" db:"updated_at"`
}

// SafeUser represents the public user model without sensitive fields
type SafeUser struct {
	ID              uuid.UUID       `json:"id"`
	Email           string          `json:"email"`
	FullName        string          `json:"full_name"`
	IsEmailVerified bool            `json:"is_email_verified"`
	IsActive        bool            `json:"is_active"`
	LastLoginAt     *time.Time      `json:"last_login_at"`
	Preferences     UserPreferences `json:"preferences"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// ToSafeUser converts a User model to a SafeUser model
func (u *User) ToSafeUser() SafeUser {
	return SafeUser{
		ID:              u.ID,
		Email:           u.Email,
		FullName:        u.FullName,
		IsEmailVerified: u.IsEmailVerified,
		IsActive:        u.IsActive,
		LastLoginAt:     u.LastLoginAt,
		Preferences:     u.Preferences,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
}

// IsVerified checks if the user's email is verified
func (u *User) IsVerified() bool {
	return u.IsEmailVerified
}

// CanLogin checks if the user account is active and allowed to login
func (u *User) CanLogin() bool {
	return u.IsActive
}
