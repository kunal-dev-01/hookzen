package app

import (
	"server/internal/broker"
	"server/internal/config"
	"server/internal/email"
	authHandler "server/internal/handler/auth"
	userHandler "server/internal/handler/user"
	"server/internal/middleware"
	rds "server/internal/redis"
	"server/internal/repo"
	"server/internal/security"
	authSvc "server/internal/service/auth"
	userSvc "server/internal/service/user"
	"server/internal/utils"
)

// Dependencies holds every wired dependency for the application.
type Dependencies struct {
	// Infrastructure
	Config *config.Config
	Logger *utils.Logger
	Redis  *rds.Redis
	Broker *broker.RabbitBroker

	// Security
	JWT *security.JWTManager

	// Repositories
	UserRepo    repo.UserRepository
	SessionRepo *repo.SessionRepository
	TokenRepo   *repo.TokenRepository

	// Services
	EmailSvc    *email.EmailService
	AccountSvc  *authSvc.AccountService
	PasswordSvc *authSvc.PasswordService
	SessionSvc  *authSvc.SessionService
	UserSvc     *userSvc.UserService

	// Handlers
	AccountHandler  *authHandler.AccountHandler
	PasswordHandler *authHandler.PasswordHandler
	SessionHandler  *authHandler.SessionHandler
	UserHandler     *userHandler.UserHandler

	// Middleware
	LoggerMW *middleware.Logger
	Limiters *middleware.Limiters
}

// Wire builds and connects all dependencies in the correct order.
func Wire(cfg *config.Config, log *utils.Logger, redisClient *rds.Redis, brk *broker.RabbitBroker, emailSvc *email.EmailService) *Dependencies {
	// ── Security ──────────────────────────────────────────────────────────────
	jwt := security.NewJWTManager(&cfg.JWT)

	// ── Repositories ──────────────────────────────────────────────────────────
	userRepo := repo.NewUserRepository(log)
	sessionRepo := repo.NewSessionRepository(redisClient, cfg)
	tokenRepo := repo.NewTokenRepository(redisClient)

	// ── Services ──────────────────────────────────────────────────────────────
	accountSvc := authSvc.NewAccountService(cfg, userRepo, tokenRepo, sessionRepo, jwt, emailSvc)
	passwordSvc := authSvc.NewPasswordService(userRepo, tokenRepo, sessionRepo, emailSvc)
	sessionSvc := authSvc.NewSessionService(cfg, userRepo, sessionRepo, jwt)
	userSvcInstance := userSvc.NewUserService(userRepo)

	// ── Handlers ──────────────────────────────────────────────────────────────
	accountHandler := authHandler.NewAccountHandler(cfg, accountSvc)
	passwordHandler := authHandler.NewPasswordHandler(cfg, passwordSvc)
	sessionHandler := authHandler.NewSessionHandler(cfg, sessionSvc)
	userHandlerInstance := userHandler.NewUserHandler(userSvcInstance)

	// ── Middleware ─────────────────────────────────────────────────────────────
	loggerMW := middleware.NewLogger(log, cfg)
	limiters := middleware.NewLimiters(redisClient)

	return &Dependencies{
		Config:          cfg,
		Logger:          log,
		Redis:           redisClient,
		Broker:          brk,
		JWT:             jwt,
		UserRepo:        userRepo,
		SessionRepo:     sessionRepo,
		TokenRepo:       tokenRepo,
		EmailSvc:        emailSvc,
		AccountSvc:      accountSvc,
		PasswordSvc:     passwordSvc,
		SessionSvc:      sessionSvc,
		UserSvc:         userSvcInstance,
		AccountHandler:  accountHandler,
		PasswordHandler: passwordHandler,
		SessionHandler:  sessionHandler,
		UserHandler:     userHandlerInstance,
		LoggerMW:        loggerMW,
		Limiters:        limiters,
	}
}
