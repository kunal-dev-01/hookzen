package repo

import (
	"context"
	"errors"

	"server/internal/db"
	"server/internal/models"
	"server/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

type DestinationRepository interface {
	Create(ctx context.Context, params CreateDestinationParams) (*models.Destination, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Destination, error)
	ListByEndpointID(ctx context.Context, endpointID uuid.UUID) ([]models.Destination, error)
	Update(ctx context.Context, id uuid.UUID, params UpdateDestinationParams) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS
// ─────────────────────────────────────────────────────────────────────────────

type CreateDestinationParams struct {
	ID         uuid.UUID
	EndpointID uuid.UUID
	Name       string
	URL        string
	Method     string
}

type UpdateDestinationParams struct {
	Name     *string
	URL      *string
	Method   *string
	IsActive *bool
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const destinationColumns = `id, endpoint_id, name, url, method, is_active, created_at, updated_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type destinationRepo struct {
	log *utils.Logger
}

func NewDestinationRepository(log *utils.Logger) DestinationRepository {
	return &destinationRepo{log: log}
}

func (r *destinationRepo) Create(ctx context.Context, params CreateDestinationParams) (*models.Destination, error) {
	sql := `
		INSERT INTO destinations (id, endpoint_id, name, url, method)
		VALUES (@id, @endpoint_id, @name, @url, @method)
		RETURNING ` + destinationColumns

	args := pgx.NamedArgs{
		"id":          params.ID,
		"endpoint_id": params.EndpointID,
		"name":        params.Name,
		"url":         params.URL,
		"method":      params.Method,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		r.log.Error("repo: create destination failed", err, map[string]any{"endpoint_id": params.EndpointID})
		return nil, utils.Internal(err)
	}

	destination, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Destination])
	if err != nil {
		r.log.Error("repo: create destination scan failed", err, map[string]any{"endpoint_id": params.EndpointID})
		return nil, utils.Internal(err)
	}

	return &destination, nil
}

func (r *destinationRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.Destination, error) {
	sql := `SELECT ` + destinationColumns + ` FROM destinations WHERE id = @id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: get destination query failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	dest, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Destination])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("destination not found")
		}
		r.log.Error("repo: get destination scan failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	return &dest, nil
}

func (r *destinationRepo) ListByEndpointID(ctx context.Context, endpointID uuid.UUID) ([]models.Destination, error) {
	sql := `SELECT ` + destinationColumns + ` FROM destinations WHERE endpoint_id = @endpoint_id ORDER BY created_at ASC`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"endpoint_id": endpointID})
	if err != nil {
		r.log.Error("repo: list destinations query failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	destinations, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.Destination])
	if err != nil {
		r.log.Error("repo: list destinations scan failed", err, map[string]any{"endpoint_id": endpointID})
		return nil, utils.Internal(err)
	}

	return destinations, nil
}

func (r *destinationRepo) Update(ctx context.Context, id uuid.UUID, params UpdateDestinationParams) error {
	sql := `
		UPDATE destinations
		SET    name = COALESCE(@name, name),
			   url = COALESCE(@url, url),
			   method = COALESCE(@method, method),
			   is_active = COALESCE(@is_active, is_active),
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{
		"id":        id,
		"name":      params.Name,
		"url":       params.URL,
		"method":    params.Method,
		"is_active": params.IsActive,
	})
	if err != nil {
		r.log.Error("repo: update destination failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("destination not found")
	}

	return nil
}

func (r *destinationRepo) Delete(ctx context.Context, id uuid.UUID) error {
	sql := `DELETE FROM destinations WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: delete destination failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("destination not found")
	}

	return nil
}
