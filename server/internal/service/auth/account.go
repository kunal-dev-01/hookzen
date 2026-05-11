package service

import (
	"context"
	"time"

	"server/internal/config"
	"server/internal/dto"
	"server/internal/email"
	"server/internal/models"
	"server/internal/repo"
	"server/internal/security"
	"server/internal/utils"

	"github.com/google/uuid"
)

type AccountService struct {
	cfg      *config.Config
	userRepo repo.UserRepository
	tokens   *repo.TokenRepository
	sessions *repo.SessionRepository
	jwt      *security.JWTManager
	emails   *email.EmailService
}

func NewAccountService(
	cfg *config.Config,
	userRepo repo.UserRepository,
	tokens *repo.TokenRepository,
	sessions *repo.SessionRepository,
	jwt *security.JWTManager,
	emails *email.EmailService,
) *AccountService {
	return &AccountService{
		cfg:      cfg,
		userRepo: userRepo,
		tokens:   tokens,
		sessions: sessions,
		jwt:      jwt,
		emails:   emails,
	}
}

// Register creates a new user and sends verification email
func (s *AccountService) Register(ctx context.Context, req dto.RegisterRequest) error {
	// 1. Check if user already exists
	_, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil {
		return utils.Conflict("email already registered")
	}

	// 2. Hash password
	hash, err := security.HashPassword(req.Password)
	if err != nil {
		return err
	}

	// 3. Create user
	user := &models.User{
		ID:           security.NewID(),
		Email:        req.Email,
		PasswordHash: hash,
		FullName:     req.FullName,
		IsActive:     true,
	}

	params := repo.CreateUserParams{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		FullName:     user.FullName,
	}

	_, err = s.userRepo.Create(ctx, params)
	if err != nil {
		return err
	}

	// 4. Send verification email
	return s.sendVerificationEmail(ctx, user.ID, user.Email)
}

// VerifyEmail marks user as verified and returns auth response for auto-login
func (s *AccountService) VerifyEmail(ctx context.Context, token string, clientInfo dto.ClientInfo) (*dto.AuthResponse, error) {
	userIDStr, err := s.tokens.ConsumeEmailVerifyToken(ctx, token)
	if err != nil {
		return nil, err
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, utils.Internal(err)
	}

	if err := s.userRepo.VerifyEmail(ctx, userID); err != nil {
		return nil, err
	}

	// 2. Fetch user to generate tokens
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// 3. Create session and return auth response
	return s.createSession(ctx, user, clientInfo)
}

// ResendVerification sends a new verification link
func (s *AccountService) ResendVerification(ctx context.Context, email string) error {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return utils.NotFound("user not found")
	}

	if user.IsEmailVerified {
		return utils.BadRequest("email already verified")
	}

	return s.sendVerificationEmail(ctx, user.ID, user.Email)
}

// Login authenticates user and creates session
func (s *AccountService) Login(ctx context.Context, req dto.LoginRequest, clientInfo dto.ClientInfo) (*dto.AuthResponse, error) {
	// 1. Check if account is locked
	locked, err := s.tokens.IsAccountLocked(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if locked {
		return nil, utils.Forbidden("account is temporarily locked due to too many failed attempts")
	}

	// 2. Get user
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, utils.Unauthorized("invalid email or password")
	}

	// 3. Check verification
	if !user.IsEmailVerified {
		return nil, utils.Forbidden("please verify your email before logging in")
	}

	// 4. Verify password
	if !security.VerifyPassword(user.PasswordHash, req.Password) {
		attempts, _ := s.tokens.IncrLoginAttempt(ctx, req.Email, s.cfg.Security.LockoutDuration)
		if int(attempts) >= s.cfg.Security.MaxLoginAttempts {
			s.tokens.LockAccount(ctx, req.Email, s.cfg.Security.LockoutDuration)
			return nil, utils.Forbidden("too many failed attempts, account locked for 30 minutes")
		}
		return nil, utils.Unauthorized("invalid email or password")
	}

	// 5. Successful login — clear attempts
	s.tokens.ClearLoginAttempts(ctx, req.Email)

	// 6. Create session
	return s.createSession(ctx, user, clientInfo)
}

// createSession is a helper to centralize session creation logic
func (s *AccountService) createSession(ctx context.Context, user *models.User, clientInfo dto.ClientInfo) (*dto.AuthResponse, error) {
	// 1. Create session metadata
	sessionID, err := security.GenerateSessionID()
	if err != nil {
		return nil, err
	}

	tokenPair, err := s.jwt.GenerateTokenPair(user, sessionID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	meta := &dto.SessionMetadata{
		ID:           sessionID,
		UserID:       user.ID.String(),
		RefreshToken: tokenPair.RefreshToken,
		IPAddress:    clientInfo.IP,
		Browser:      clientInfo.Browser,
		OS:           clientInfo.OS,
		DeviceName:   clientInfo.DeviceName,
		City:         clientInfo.City,
		Country:      clientInfo.Country,
		CreatedAt:    now,
		ExpiresAt:    now.Add(s.cfg.JWT.RefreshTokenDuration),
	}

	if err = s.sessions.StoreSession(ctx, meta, s.cfg.JWT.RefreshTokenDuration); err != nil {
		return nil, err
	}

	// 2. Update last login in background
	go s.userRepo.UpdateLastLogin(context.Background(), user.ID, clientInfo.IP)

	return &dto.AuthResponse{
		User:         user.ToSafeUser(),
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
	}, nil
}

func (s *AccountService) sendVerificationEmail(ctx context.Context, userID uuid.UUID, emailAddr string) error {
	token, err := security.GenerateEmailVerifyToken()
	if err != nil {
		return err
	}

	// TTL: 24 hours
	if err = s.tokens.StoreEmailVerifyToken(ctx, userID.String(), token, 24*time.Hour); err != nil {
		return err
	}

	return s.emails.SendVerificationEmail(ctx, emailAddr, token)
}
