package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type WebhookLog struct {
	ID              uuid.UUID       `json:"id" db:"id" validate:"required"`
	EndpointID      uuid.UUID       `json:"endpoint_id" db:"endpoint_id" validate:"required"`
	DestinationID   *uuid.UUID      `json:"destination_id,omitempty" db:"destination_id"`
	RequestPayload  json.RawMessage `json:"request_payload" db:"request_payload"`
	RequestHeaders  json.RawMessage `json:"request_headers" db:"request_headers"`
	ResponseStatus  *int            `json:"response_status,omitempty" db:"response_status"`
	ResponseBody    *string         `json:"response_body,omitempty" db:"response_body"`
	ResponseHeaders json.RawMessage `json:"response_headers" db:"response_headers"`
	LatencyMS       int             `json:"latency_ms" db:"latency_ms"`
	ErrorMessage    *string         `json:"error_message,omitempty" db:"error_message"`
	AttemptNumber   int             `json:"attempt_number" db:"attempt_number"`
	CreatedAt       time.Time       `json:"created_at" db:"created_at"`
}
