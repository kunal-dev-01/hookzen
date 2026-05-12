package service

import (
	"context"

	"server/internal/dto"
	"server/internal/models"
	"server/internal/repo"

	"github.com/google/uuid"
)

type UserService struct {
	userRepo repo.UserRepository
}

func NewUserService(userRepo repo.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// GetMe returns the safe user profile
func (s *UserService) GetMe(ctx context.Context, userID uuid.UUID) (*models.SafeUser, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	safe := user.ToSafeUser()
	return &safe, nil
}

// UpdateProfile modifies general user profile information and returns the updated user
func (s *UserService) UpdateProfile(ctx context.Context, userID uuid.UUID, req dto.UpdateUserRequest) (*models.SafeUser, error) {
	params := repo.UpdateUserParams{
		FullName: req.FullName,
	}

	if err := s.userRepo.Update(ctx, userID, params); err != nil {
		return nil, err
	}

	return s.GetMe(ctx, userID)
}

// UpdatePreferences modifies user-specific settings (JSONB) and returns the updated user
func (s *UserService) UpdatePreferences(ctx context.Context, userID uuid.UUID, req dto.UpdatePreferencesRequest) (*models.SafeUser, error) {
	// Since preferences are stored as a single JSONB blob and we want partial updates,
	// we first fetch the current preferences, merge changes, then save back.
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	prefs := user.Preferences

	if req.Notifications != nil {
		if req.Notifications.Email != nil {
			prefs.Notifications.Email = *req.Notifications.Email
		}
		if req.Notifications.WebhookFailures != nil {
			prefs.Notifications.WebhookFailures = *req.Notifications.WebhookFailures
		}
	}

	if err := s.userRepo.UpdatePreferences(ctx, userID, prefs); err != nil {
		return nil, err
	}

	return s.GetMe(ctx, userID)
}
