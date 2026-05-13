package repo

import (
	"context"

	"server/internal/db"
	"server/internal/models"
	"server/internal/utils"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

type NotificationRepository interface {
	Create(ctx context.Context, params CreateNotificationParams) (*models.Notification, error)
	ListByUserID(ctx context.Context, userID uuid.UUID, limit, offset int) ([]models.Notification, error)
	MarkAsRead(ctx context.Context, id uuid.UUID) error
	MarkAllAsRead(ctx context.Context, userID uuid.UUID) error
	GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS
// ─────────────────────────────────────────────────────────────────────────────

type CreateNotificationParams struct {
	ID      uuid.UUID
	UserID  uuid.UUID
	Title   string
	Message string
	Type    string
	Link    *string
}

const notificationColumns = `id, user_id, title, message, type, link, is_read, created_at`

// ─────────────────────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

type notificationRepo struct {
	log *utils.Logger
}

func NewNotificationRepository(log *utils.Logger) NotificationRepository {
	return &notificationRepo{log: log}
}

func (r *notificationRepo) Create(ctx context.Context, params CreateNotificationParams) (*models.Notification, error) {
	sql := `
		INSERT INTO notifications (id, user_id, title, message, type, link)
		VALUES (@id, @user_id, @title, @message, @type, @link)
		RETURNING ` + notificationColumns

	args := pgx.NamedArgs{
		"id":      params.ID,
		"user_id": params.UserID,
		"title":   params.Title,
		"message": params.Message,
		"type":    params.Type,
		"link":    params.Link,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		r.log.Error("repo: create notification failed", err, map[string]any{"user_id": params.UserID})
		return nil, utils.Internal(err)
	}

	notification, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[models.Notification])
	if err != nil {
		r.log.Error("repo: create notification scan failed", err, map[string]any{"user_id": params.UserID})
		return nil, utils.Internal(err)
	}

	return &notification, nil
}

func (r *notificationRepo) ListByUserID(ctx context.Context, userID uuid.UUID, limit, offset int) ([]models.Notification, error) {
	sql := `
		SELECT ` + notificationColumns + ` 
		FROM notifications 
		WHERE user_id = @user_id 
		ORDER BY created_at DESC 
		LIMIT @limit OFFSET @offset`

	args := pgx.NamedArgs{
		"user_id": userID,
		"limit":   limit,
		"offset":  offset,
	}

	rows, err := db.Pool.Query(ctx, sql, args)
	if err != nil {
		r.log.Error("repo: list notifications query failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	notifications, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.Notification])
	if err != nil {
		r.log.Error("repo: list notifications scan failed", err, map[string]any{"user_id": userID})
		return nil, utils.Internal(err)
	}

	return notifications, nil
}

func (r *notificationRepo) MarkAsRead(ctx context.Context, id uuid.UUID) error {
	sql := `UPDATE notifications SET is_read = TRUE WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: mark notification as read failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("notification not found")
	}

	return nil
}

func (r *notificationRepo) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	sql := `UPDATE notifications SET is_read = TRUE WHERE user_id = @user_id`

	_, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"user_id": userID})
	if err != nil {
		r.log.Error("repo: mark all notifications as read failed", err, map[string]any{"user_id": userID})
		return utils.Internal(err)
	}

	return nil
}

func (r *notificationRepo) GetUnreadCount(ctx context.Context, userID uuid.UUID) (int, error) {
	sql := `SELECT COUNT(*) FROM notifications WHERE user_id = @user_id AND is_read = FALSE`

	var count int
	err := db.Pool.QueryRow(ctx, sql, pgx.NamedArgs{"user_id": userID}).Scan(&count)
	if err != nil {
		r.log.Error("repo: get unread count failed", err, map[string]any{"user_id": userID})
		return 0, utils.Internal(err)
	}

	return count, nil
}

func (r *notificationRepo) Delete(ctx context.Context, id uuid.UUID) error {
	sql := `DELETE FROM notifications WHERE id = @id`

	tag, err := db.Pool.Exec(ctx, sql, pgx.NamedArgs{"id": id})
	if err != nil {
		r.log.Error("repo: delete notification failed", err, map[string]any{"id": id})
		return utils.Internal(err)
	}
	if tag.RowsAffected() == 0 {
		return utils.NotFound("notification not found")
	}

	return nil
}
