package app

import (
	"server/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// RegisterRoutes mounts all application routes onto the Fiber app.
func RegisterRoutes(app *fiber.App, d *Dependencies) {
	// ── Global Middleware ──────────────────────────────────────────────────────
	app.Use(d.LoggerMW.Recovery())
	app.Use(d.LoggerMW.HTTP())
	app.Use(d.Limiters.General)

	// ── Health ────────────────────────────────────────────────────────────────
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// ── API v1 ────────────────────────────────────────────────────────────────
	v1 := app.Group("/api/v1")

	registerAuthRoutes(v1, d)
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────────────────────────

func registerAuthRoutes(r fiber.Router, d *Dependencies) {
	auth := r.Group("/auth")

	// ── Public Auth ──────────────────────────────────────────────────────────
	auth.Post("/register", d.Limiters.Auth, d.AccountHandler.Register)
	auth.Post("/login", d.Limiters.Auth, d.AccountHandler.Login)
	auth.Post("/verify-email", d.Limiters.OTP, d.AccountHandler.VerifyEmail)
	auth.Post("/resend-verification", d.Limiters.OTP, d.AccountHandler.ResendVerification)

	auth.Post("/forgot-password", d.Limiters.Auth, d.PasswordHandler.ForgotPassword)
	auth.Post("/reset-password", d.Limiters.Auth, d.PasswordHandler.ResetPassword)

	// Token Refresh (uses refresh_token cookie)
	auth.Post("/refresh", d.SessionHandler.RefreshToken)

	// ── Protected Auth ────────────────────────────────────────────────────────
	protected := auth.Group("",
		middleware.AuthRequired(d.JWT, d.SessionRepo),
	)

	// Session Management
	protected.Get("/sessions", d.SessionHandler.ListSessions)
	protected.Delete("/sessions", d.SessionHandler.RevokeAllSessions)
	protected.Delete("/sessions/:id", d.SessionHandler.RevokeSession)

	protected.Post("/logout", d.SessionHandler.Logout)
}
