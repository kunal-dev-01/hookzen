package app

import (
	"server/internal/broker"
	"server/internal/config"
	"server/internal/email"
	"server/internal/handler/auth"
	"server/internal/middleware"
	rds "server/internal/redis"
	"server/internal/repo"
	"server/internal/security"
	"server/internal/service/auth"
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
	AccountSvc  *service.AccountService
	PasswordSvc *service.PasswordService
	SessionSvc  *service.SessionService

	// Handlers
	AccountHandler  *handler.AccountHandler
	PasswordHandler *handler.PasswordHandler
	SessionHandler  *handler.SessionHandler

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
	accountSvc := service.NewAccountService(cfg, userRepo, tokenRepo, sessionRepo, jwt, emailSvc)
	passwordSvc := service.NewPasswordService(userRepo, tokenRepo, sessionRepo, emailSvc)
	sessionSvc := service.NewSessionService(cfg, userRepo, sessionRepo, jwt)

	// ── Handlers ──────────────────────────────────────────────────────────────
	accountHandler := handler.NewAccountHandler(cfg, accountSvc)
	passwordHandler := handler.NewPasswordHandler(cfg, passwordSvc)
	sessionHandler := handler.NewSessionHandler(cfg, sessionSvc)

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
		AccountHandler:  accountHandler,
		PasswordHandler: passwordHandler,
		SessionHandler:  sessionHandler,
		LoggerMW:        loggerMW,
		Limiters:        limiters,
	}
}
