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

type EndpointRepository interface {
	Create(ctx context.Context, params CreateEndpointParams) (*models.Endpoint, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Endpoint, error)
	GetBySlug(ctx context.Context, slug string) (*models.Endpoint, error)
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Endpoint, error)
	Update(ctx context.Context, id uuid.UUID, params UpdateEndpointParams) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS
// ─────────────────────────────────────────────────────────────────────────────

type CreateEndpointParams struct {
	ID     uuid.UUID
	UserID uuid.UUID
	Name   string
	Slug   string
	Secret string
}

type UpdateEndpointParams struct {
	Name     *string
	IsActive *bool
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const endpointColumns = `id, user_id, name, slug, secret, is_active, created_at, updated_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type endpointRepo struct {
	log *utils.Logger
}

func NewEndpointRepository(log *utils.Logger) EndpointRepository {
	return &endpointRepo{log: log}
}

func (r *endpointRepo) Create(ctx context.Context, params CreateEndpointParams) (*models.Endpoint, error) {
	sql := `
		INSERT INTO endpoints (id, user_id, name, slug, secret)
		VALUES (@id, @user_id, @name, @slug, @secret)
		RETURNING ` + endpointColumns

	args := pgx.NamedArgs{
		"id":      params.ID,
		"user_id": params.UserID,
		"name":    params.Name,
		"slug":    params.Slug,
		"secret":  params.Secret,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		if isPgConflict(err) {
			return nil, utils.Conflict("slug is already taken")
		}
		r.log.Error("repo: create endpoint failed", err, map[string]any{"slug": params.Slug})
		return nil, utils.Internal(err)
	}

	endpoint, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Endpoint])
	if err != nil {
		r.log.Error("repo: create endpoint scan failed", err, map[string]any{"slug": params.Slug})
		return nil, utils.Internal(err)
	}

	return &endpoint, nil
}

func (r *endpointRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.Endpoint, error) {
	sql := `SELECT ` + endpointColumns + ` FROM endpoints WHERE id = @id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: get endpoint by id query failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	endpoint, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Endpoint])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("endpoint not found")
		}
		r.log.Error("repo: get endpoint by id scan failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	return &endpoint, nil
}

func (r *endpointRepo) GetBySlug(ctx context.Context, slug string) (*models.Endpoint, error) {
	sql := `SELECT ` + endpointColumns + ` FROM endpoints WHERE slug = @slug`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"slug": slug})
	if err != nil {
		r.log.Error("repo: get endpoint by slug query failed", err, map[string]any{"slug": slug})
		return nil, utils.Internal(err)
	}

	endpoint, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Endpoint])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("endpoint not found")
		}
		r.log.Error("repo: get endpoint by slug scan failed", err, map[string]any{"slug": slug})
		return nil, utils.Internal(err)
	}

	return &endpoint, nil
}

func (r *endpointRepo) ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Endpoint, error) {
	sql := `SELECT ` + endpointColumns + ` FROM endpoints WHERE user_id = @user_id ORDER BY created_at DESC`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"user_id": userID})
	if err != nil {
		r.log.Error("repo: list endpoints query failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	endpoints, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.Endpoint])
	if err != nil {
		r.log.Error("repo: list endpoints scan failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	return endpoints, nil
}

func (r *endpointRepo) Update(ctx context.Context, id uuid.UUID, params UpdateEndpointParams) error {
	sql := `
		UPDATE endpoints
		SET    name = COALESCE(@name, name),
			   is_active = COALESCE(@is_active, is_active),
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{
		"id":        id,
		"name":      params.Name,
		"is_active": params.IsActive,
	})
	if err != nil {
		r.log.Error("repo: update endpoint failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("endpoint not found")
	}

	return nil
}

func (r *endpointRepo) Delete(ctx context.Context, id uuid.UUID) error {
	sql := `DELETE FROM endpoints WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: delete endpoint failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("endpoint not found")
	}

	return nil
}
