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

type UserRepository interface {
	Create(ctx context.Context, params CreateUserParams) (*models.User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	Update(ctx context.Context, id uuid.UUID, params UpdateUserParams) error
	UpdatePreferences(ctx context.Context, id uuid.UUID, prefs models.UserPreferences) error
	UpdateLastLogin(ctx context.Context, id uuid.UUID, ip string) error
	VerifyEmail(ctx context.Context, id uuid.UUID) error
	UpdatePassword(ctx context.Context, id uuid.UUID, newHash string) error
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS
// ─────────────────────────────────────────────────────────────────────────────

type CreateUserParams struct {
	ID           uuid.UUID
	Email        string
	PasswordHash string
	FullName     string
}

type UpdateUserParams struct {
	FullName *string
	IsActive *bool
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const userColumns = `
	id, email, password_hash, full_name, 
	is_email_verified, is_active, last_login_at, 
	preferences, created_at, updated_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type userRepo struct {
	log *utils.Logger
}

func NewUserRepository(log *utils.Logger) UserRepository {
	return &userRepo{log: log}
}

// Create inserts a new user into the database
func (r *userRepo) Create(ctx context.Context, params CreateUserParams) (*models.User, error) {
	sql := `
		INSERT INTO users (id, email, password_hash, full_name)
		VALUES (@id, @email, @password_hash, @full_name)
		RETURNING ` + userColumns

	args := pgx.NamedArgs{
		"id":            params.ID,
		"email":         params.Email,
		"password_hash": params.PasswordHash,
		"full_name":     params.FullName,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		if isPgConflict(err) {
			return nil, utils.Conflict("email is already registered")
		}
		r.log.Error("repo: create user failed", err, map[string]any{"email": params.Email})
		return nil, utils.Internal(err)
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.User])
	if err != nil {
		r.log.Error("repo: create user scan failed", err, map[string]any{"email": params.Email})
		return nil, utils.Internal(err)
	}

	return &user, nil
}

// GetByID fetches a user by their unique ID
func (r *userRepo) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	sql := `SELECT ` + userColumns + ` FROM users WHERE id = @id`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: get user by id query failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("user not found")
		}
		r.log.Error("repo: get user by id scan failed", err, map[string]any{"id": id})
		return nil, utils.Internal(err)
	}

	return &user, nil
}

// GetByEmail fetches a user by their email address
func (r *userRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	sql := `SELECT ` + userColumns + ` FROM users WHERE email = @email`

	rows, err := db.Pool.Query(ctx, sql, pgx.NamedArgs{"email": email})
	if err != nil {
		r.log.Error("repo: get user by email query failed", err, map[string]any{"email": email})
		return nil, utils.Internal(err)
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, utils.NotFound("user not found")
		}
		r.log.Error("repo: get user by email scan failed", err, map[string]any{"email": email})
		return nil, utils.Internal(err)
	}

	return &user, nil
}

// Update modifies general user profile information
func (r *userRepo) Update(ctx context.Context, id uuid.UUID, params UpdateUserParams) error {
	sql := `
		UPDATE users
		SET    full_name = COALESCE(@full_name, full_name),
			   is_active = COALESCE(@is_active, is_active),
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{
		"id":        id,
		"full_name": params.FullName,
		"is_active": params.IsActive,
	})
	if err != nil {
		r.log.Error("repo: update user failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("user not found")
	}

	return nil
}

// UpdatePreferences updates the JSONB preferences column
func (r *userRepo) UpdatePreferences(ctx context.Context, id uuid.UUID, prefs models.UserPreferences) error {
	sql := `
		UPDATE users
		SET    preferences = @prefs,
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{
		"id":    id,
		"prefs": prefs,
	})
	if err != nil {
		r.log.Error("repo: update preferences failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("user not found")
	}

	return nil
}

// UpdateLastLogin updates the last_login_at timestamp
func (r *userRepo) UpdateLastLogin(ctx context.Context, id uuid.UUID, ip string) error {
	sql := `UPDATE users SET last_login_at = NOW() WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: update last login failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("user not found")
	}

	return nil
}

// VerifyEmail marks the user's email as verified
func (r *userRepo) VerifyEmail(ctx context.Context, id uuid.UUID) error {
	sql := `
		UPDATE users
		SET    is_email_verified = TRUE,
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: verify email failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("user not found")
	}

	return nil
}

// UpdatePassword updates the user's password hash
func (r *userRepo) UpdatePassword(ctx context.Context, id uuid.UUID, newHash string) error {
	sql := `
		UPDATE users
		SET    password_hash = @hash,
			   updated_at = NOW()
		WHERE  id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id, "hash": newHash})
	if err != nil {
		r.log.Error("repo: update password failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("user not found")
	}

	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

func isPgConflict(err error) bool {
	return err != nil && len(err.Error()) > 5 && err.Error()[:5] == "23505"
}
