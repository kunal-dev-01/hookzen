package service

import (
	"context"
	"time"

	"server/internal/dto"
	"server/internal/email"
	"server/internal/repo"
	"server/internal/security"
	"server/internal/utils"

	"github.com/google/uuid"
)

type PasswordService struct {
	userRepo repo.UserRepository
	tokens   *repo.TokenRepository
	sessions *repo.SessionRepository
	emails   *email.EmailService
}

func NewPasswordService(
	userRepo repo.UserRepository,
	tokens *repo.TokenRepository,
	sessions *repo.SessionRepository,
	emails *email.EmailService,
) *PasswordService {
	return &PasswordService{
		userRepo: userRepo,
		tokens:   tokens,
		sessions: sessions,
		emails:   emails,
	}
}

// ForgotPassword generates a reset token and sends email
func (s *PasswordService) ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequest) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		// Silent fail for security — don't leak email existence
		return nil
	}

	token, err := security.GeneratePasswordResetToken()
	if err != nil {
		return err
	}

	// Token expires in 1 hour
	if err = s.tokens.StorePasswordResetToken(ctx, user.ID.String(), token, 1*time.Hour); err != nil {
		return err
	}

	return s.emails.SendPasswordResetEmail(ctx, user.Email, token)
}

// ResetPassword verifies token and updates password, revoking all sessions
func (s *PasswordService) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	// 1. Consume token
	userIDStr, err := s.tokens.ConsumePasswordResetToken(ctx, req.Token)
	if err != nil {
		return err
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.Internal(err)
	}

	// 2. Hash new password
	hash, err := security.HashPassword(req.Password)
	if err != nil {
		return err
	}

	// 3. Update password in DB
	if err = s.userRepo.UpdatePassword(ctx, userID, hash); err != nil {
		return err
	}

	// 4. Revoke all sessions (force logout everywhere)
	return s.sessions.RevokeAllSessions(ctx, userIDStr)
}
