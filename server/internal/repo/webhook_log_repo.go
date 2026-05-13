package repo

import (
	"context"
	"encoding/json"

	"server/internal/db"
	"server/internal/models"
	"server/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

type WebhookLogRepository interface {
	Create(ctx context.Context, params CreateWebhookLogParams) (*models.WebhookLog, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.WebhookLog, error)
	ListByEndpointID(ctx context.Context, endpointID uuid.UUID, limit, offset int) ([]models.WebhookLog, error)
	GetStatsByEndpointID(ctx context.Context, endpointID uuid.UUID) (*WebhookStats, error)
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS & TYPES
// ─────────────────────────────────────────────────────────────────────────────

type CreateWebhookLogParams struct {
	ID              uuid.UUID
	EndpointID      uuid.UUID
	DestinationID   *uuid.UUID
	RequestPayload  json.RawMessage
	RequestHeaders  json.RawMessage
	ResponseStatus  *int
	ResponseBody    *string
	ResponseHeaders json.RawMessage
	LatencyMS       int
	ErrorMessage    *string
	AttemptNumber   int
}

type WebhookStats struct {
	TotalRequests int `json:"total_requests"`
	SuccessRate   float64 `json:"success_rate"`
	AvgLatency    float64 `json:"avg_latency_ms"`
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const webhookLogColumns = `
	id, endpoint_id, destination_id, request_payload, request_headers, 
	response_status, response_body, response_headers, latency_ms, 
	error_message, attempt_number, created_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type webhookLogRepo struct {
	log *utils.Logger
}

func NewWebhookLogRepository(log *utils.Logger) WebhookLogRepository {
	return &webhookLogRepo{log: log}
}

func (r *webhookLogRepo) Create(ctx context.Context, params CreateWebhookLogParams) (*models.WebhookLog, error) {
	sql := `
		INSERT INTO webhook_logs (
			id, endpoint_id, destination_id, request_payload, request_headers, 
			response_status, response_body, response_headers, latency_ms, 
			error_message, attempt_number
		)
		VALUES (
			@id, @endpoint_id, @destination_id, @request_payload, @request_headers, 
			@response_status, @response_body, @response_headers, @latency_ms, 
			@error_message, @attempt_number
		)
		RETURNING ` + webhookLogColumns

	args := pgx.NamedArgs{
		"id":               params.ID,
		"endpoint_id":      params.EndpointID,
		"destination_id":   params.DestinationID,
		"request_payload":  params.RequestPayload,
		"request_headers":  params.RequestHeaders,
		"response_status":  params.ResponseStatus,
		"response_body":    params.ResponseBody,
		"response_headers": params.ResponseHeaders,
		"latency_ms":       params.LatencyMS,
		"error_message":    params.ErrorMessage,
		"attempt_number":   params.AttemptNumber,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		r.log.Error("repo: create webhook log failed", err, map[string]any{"endpoint_id": params.EndpointID})
		return nil, utils.Internal(err)
	}

	webhookLog, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.WebhookLog])
	if err != nil {
		r.log.Error("repo: create webhook log scan failed", err, map[string]any{"endpoint_id": params.EndpointID})
		return nil, utils.Internal(err)
	}

	return &webhookLog, nil
}

func (r *webhookLogRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.WebhookLog, error) {
	sql := `SELECT ` + webhookLogColumns + ` FROM webhook_logs WHERE id = @id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: get webhook log query failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	log, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.WebhookLog])
	if err != nil {
		r.log.Error("repo: get webhook log scan failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	return &log, nil
}

func (r *webhookLogRepo) ListByEndpointID(ctx context.Context, endpointID uuid.UUID, limit, offset int) ([]models.WebhookLog, error) {
	sql := `
		SELECT ` + webhookLogColumns + ` 
		FROM webhook_logs 
		WHERE endpoint_id = @endpoint_id 
		ORDER BY created_at DESC 
		LIMIT @limit OFFSET @offset`

	args := pgx.NamedArgs{
		"endpoint_id": endpointID,
		"limit":       limit,
		"offset":      offset,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		r.log.Error("repo: list webhook logs query failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	logs, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.WebhookLog])
	if err != nil {
		r.log.Error("repo: list webhook logs scan failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	return logs, nil
}

func (r *webhookLogRepo) GetStatsByEndpointID(ctx context.Context, endpointID uuid.UUID) (*WebhookStats, error) {
	sql := `
		SELECT 
			COUNT(*) as total_requests,
			COALESCE(AVG(CASE WHEN response_status >= 200 AND response_status < 300 THEN 100 ELSE 0 END), 0) as success_rate,
			COALESCE(AVG(latency_ms), 0) as avg_latency
		FROM webhook_logs
		WHERE endpoint_id = @endpoint_id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"endpoint_id": endpointID})
	if err != nil {
		r.log.Error("repo: get webhook stats failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	type rawStats struct {
		TotalRequests int     `db:"total_requests"`
		SuccessRate   float64 `db:"success_rate"`
		AvgLatency    float64 `db:"avg_latency"`
	}

	stats, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[rawStats])
	if err != nil {
		r.log.Error("repo: get webhook stats scan failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	return &WebhookStats{
		TotalRequests: stats.TotalRequests,
		SuccessRate:   stats.SuccessRate,
		AvgLatency:    stats.AvgLatency,
	}, nil
}
