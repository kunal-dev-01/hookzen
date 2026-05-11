package handler

import (
	"server/internal/config"
	"server/internal/middleware"
	"server/internal/service/auth"
	"server/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type SessionHandler struct {
	cfg     *config.Config
	service *service.SessionService
}

func NewSessionHandler(cfg *config.Config, s *service.SessionService) *SessionHandler {
	return &SessionHandler{cfg: cfg, service: s}
}

// ListSessions returns all active sessions for the authenticated user
func (h *SessionHandler) ListSessions(c *fiber.Ctx) error {
	userID, _ := middleware.GetUserID(c)
	currentSessionID := middleware.GetSessionID(c)

	sessions, err := h.service.GetActiveSessions(c.Context(), userID.String(), currentSessionID)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": sessions,
	})
}

// RevokeSession terminates a specific session by ID
func (h *SessionHandler) RevokeSession(c *fiber.Ctx) error {
	userID, _ := middleware.GetUserID(c)
	sessionID := c.Params("id")

	if sessionID == "" {
		return utils.BadRequest("session id is required")
	}

	if err := h.service.RevokeSession(c.Context(), userID.String(), sessionID); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "session revoked successfully",
	})
}

// RevokeAllSessions terminates all active sessions for the user
func (h *SessionHandler) RevokeAllSessions(c *fiber.Ctx) error {
	userID, _ := middleware.GetUserID(c)

	if err := h.service.RevokeAllSessions(c.Context(), userID.String()); err != nil {
		return err
	}

	// Also clear current session cookie as a precaution
	clearRefreshCookie(c, h.cfg)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "all sessions revoked successfully",
	})
}

// Logout terminates the current session and clears the cookie
func (h *SessionHandler) Logout(c *fiber.Ctx) error {
	userID, _ := middleware.GetUserID(c)
	sessionID := middleware.GetSessionID(c)

	if err := h.service.Logout(c.Context(), userID.String(), sessionID); err != nil {
		return err
	}

	clearRefreshCookie(c, h.cfg)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "logged out successfully",
	})
}
