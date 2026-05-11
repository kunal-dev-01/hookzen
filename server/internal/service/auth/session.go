package service

import (
	"context"

	"server/internal/dto"
	"server/internal/repo"
)

type SessionService struct {
	sessions *repo.SessionRepository
}

func NewSessionService(s *repo.SessionRepository) *SessionService {
	return &SessionService{sessions: s}
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
