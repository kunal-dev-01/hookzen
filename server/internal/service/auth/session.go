package service

import (
	"context"

	"server/internal/config"
	"server/internal/dto"
	"server/internal/repo"
	"server/internal/security"
	"server/internal/utils"

	"github.com/google/uuid"
)

type SessionService struct {
	cfg      *config.Config
	userRepo repo.UserRepository
	sessions *repo.SessionRepository
	jwt      *security.JWTManager
}

func NewSessionService(
	cfg *config.Config,
	userRepo repo.UserRepository,
	sessions *repo.SessionRepository,
	jwt *security.JWTManager,
) *SessionService {
	return &SessionService{
		cfg:      cfg,
		userRepo: userRepo,
		sessions: sessions,
		jwt:      jwt,
	}
}

// GetActiveSessions returns all live sessions for a user, marked with the current one
func (s *SessionService) GetActiveSessions(ctx context.Context, userID, currentSessionID string) ([]dto.SafeSession, error) {
	metas, err := s.sessions.GetActiveSessions(ctx, userID)
	if err != nil {
		return nil, err
	}

	sessions := make([]dto.SafeSession, 0, len(metas))
	for _, meta := range metas {
		sessions = append(sessions, meta.ToSafe(currentSessionID))
	}

	return sessions, nil
}

// RevokeSession terminates a specific session by ID
func (s *SessionService) RevokeSession(ctx context.Context, userID, sessionID string) error {
	return s.sessions.RevokeSession(ctx, userID, sessionID)
}

// RevokeAllSessions terminates all active sessions for a user
func (s *SessionService) RevokeAllSessions(ctx context.Context, userID string) error {
	return s.sessions.RevokeAllSessions(ctx, userID)
}

// Logout terminates the current session
func (s *SessionService) Logout(ctx context.Context, userID, sessionID string) error {
	return s.sessions.RevokeSession(ctx, userID, sessionID)
}

// RefreshToken validates a refresh token and issues a new pair
func (s *SessionService) RefreshToken(ctx context.Context, token string, clientInfo dto.ClientInfo) (*dto.AuthResponse, error) {
	// 1. Validate Token
	claims, err := s.jwt.ValidateToken(token, security.TokenRefresh)
	if err != nil {
		return nil, utils.Unauthorized("invalid or expired refresh token")
	}

	// 2. Get existing session
	meta, err := s.sessions.GetSession(ctx, claims.ID)
	if err != nil {
		return nil, err
	}

	// 3. Verify token matches (Rotation protection)
	if meta.RefreshToken != token {
		// If they don't match, it could be a token reuse attack.
		// In production, you might want to revoke all sessions here for security.
		return nil, utils.Unauthorized("token already used or invalid")
	}

	// 4. Check user
	userID, err := uuid.Parse(meta.UserID)
	if err != nil {
		return nil, utils.Internal(err)
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if !user.CanLogin() {
		return nil, utils.Forbidden("account is inactive")
	}

	// 5. Generate new pair
	newTokenPair, err := s.jwt.GenerateTokenPair(user, meta.ID)
	if err != nil {
		return nil, err
	}

	// 6. Update session with new token
	meta.RefreshToken = newTokenPair.RefreshToken
	meta.IPAddress = clientInfo.IP
	meta.Browser = clientInfo.Browser

	if err = s.sessions.StoreSession(ctx, meta, s.cfg.JWT.RefreshTokenDuration); err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		AccessToken:  newTokenPair.AccessToken,
		RefreshToken: newTokenPair.RefreshToken,
	}, nil
}
