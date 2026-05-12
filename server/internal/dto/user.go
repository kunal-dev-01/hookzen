package dto

import "server/internal/models"

type UpdateUserRequest struct {
	FullName *string `json:"full_name" validate:"omitempty,valid_name"`
}

type UpdatePreferencesRequest struct {
	Notifications *struct {
		Email           *bool `json:"email"`
		WebhookFailures *bool `json:"webhook_failures"`
	} `json:"notifications"`
}

type UserResponse struct {
	User models.SafeUser `json:"user"`
}
