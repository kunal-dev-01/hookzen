package repo

import (
	"context"
	"errors"
	"time"

	"server/internal/db"
	"server/internal/models"
	"server/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

type APIKeyRepository interface {
	Create(ctx context.Context, params CreateAPIKeyParams) (*models.APIKey, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.APIKey, error)
	GetByHash(ctx context.Context, hash string) (*models.APIKey, error)
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.APIKey, error)
	UpdateLastUsed(ctx context.Context, id uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS
// ─────────────────────────────────────────────────────────────────────────────

type CreateAPIKeyParams struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Name      string
	KeyHash   string
	KeyPrefix string
	ExpiresAt *time.Time
}

const apiKeyColumns = `
	id, user_id, name, key_hash, key_prefix, 
	last_used_at, expires_at, is_active, created_at, updated_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type apiKeyRepo struct {
	log *utils.Logger
}

func NewAPIKeyRepository(log *utils.Logger) APIKeyRepository {
	return &apiKeyRepo{log: log}
}

func (r *apiKeyRepo) Create(ctx context.Context, params CreateAPIKeyParams) (*models.APIKey, error) {
	sql := `
		INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, expires_at)
		VALUES (@id, @user_id, @name, @key_hash, @key_prefix, @expires_at)
		RETURNING ` + apiKeyColumns

	args := pgx.NamedArgs{
		"id":         params.ID,
		"user_id":    params.UserID,
		"name":       params.Name,
		"key_hash":   params.KeyHash,
		"key_prefix": params.KeyPrefix,
		"expires_at": params.ExpiresAt,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		if isPgConflict(err) {
			return nil, utils.Conflict("api key already exists")
		}
		r.log.Error("repo: create api key failed", err, map[string]any{"user_id": params.UserID})
		return nil, utils.Internal(err)
	}

	key, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.APIKey])
	if err != nil {
		r.log.Error("repo: create api key scan failed", err, map[string]any{"user_id": params.UserID})
		return nil, utils.Internal(err)
	}

	return &key, nil
}

func (r *apiKeyRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.APIKey, error) {
	sql := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE id = @id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: get api key query failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	key, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.APIKey])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("api key not found")
		}
		r.log.Error("repo: get api key scan failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	return &key, nil
}

func (r *apiKeyRepo) GetByHash(ctx context.Context, hash string) (*models.APIKey, error) {
	sql := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE key_hash = @hash AND is_active = TRUE`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"hash": hash})
	if err != nil {
		r.log.Error("repo: get api key by hash query failed", err, nil)
		return nil, utils.Internal(err)
	}

	key, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.APIKey])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("invalid api key")
		}
		r.log.Error("repo: get api key by hash scan failed", err, nil)
		return nil, utils.Internal(err)
	}

	return &key, nil
}

func (r *apiKeyRepo) ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.APIKey, error) {
	sql := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE user_id = @user_id ORDER BY created_at DESC`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"user_id": userID})
	if err != nil {
		r.log.Error("repo: list api keys query failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	keys, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.APIKey])
	if err != nil {
		r.log.Error("repo: list api keys scan failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	return keys, nil
}

func (r *apiKeyRepo) UpdateLastUsed(ctx context.Context, id uuid.UUID) error {
	sql := `UPDATE api_keys SET last_used_at = NOW() WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: update api key last used failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("api key not found")
	}

	return nil
}

func (r *apiKeyRepo) Delete(ctx context.Context, id uuid.UUID) error {
	sql := `DELETE FROM api_keys WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: delete api key failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("api key not found")
	}

	return nil
}
