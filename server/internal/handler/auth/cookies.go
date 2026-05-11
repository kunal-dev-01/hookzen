package handler

import (
	"time"

	"server/internal/config"
	"github.com/gofiber/fiber/v2"
)

// setRefreshCookie sets the refresh token in a secure, HTTP-only cookie
func setRefreshCookie(c *fiber.Ctx, cfg *config.Config, token string) {
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Expires:  time.Now().Add(cfg.JWT.RefreshTokenDuration),
		HTTPOnly: true,
		Secure:   cfg.App.IsProduction(),
		SameSite: "Lax",
		Path:     "/",
	})
}

// clearRefreshCookie removes the refresh token cookie
func clearRefreshCookie(c *fiber.Ctx, cfg *config.Config) {
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   cfg.App.IsProduction(),
		SameSite: "Lax",
		Path:     "/",
	})
}
