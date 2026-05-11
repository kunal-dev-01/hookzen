package handler

import (
	"server/internal/config"
	"server/internal/dto"
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

// RefreshToken handles token rotation and issuance of new access tokens
func (h *SessionHandler) RefreshToken(c *fiber.Ctx) error {
	token := c.Cookies("refresh_token")
	if token == "" {
		return utils.Unauthorized("refresh token is missing")
	}

	clientInfo := dto.ClientInfo{
		IP:         c.IP(),
		Browser:    c.Get("User-Agent"),
		OS:         c.Get("X-OS"),
		DeviceName: c.Get("X-Device"),
	}

	resp, err := h.service.RefreshToken(c.Context(), token, clientInfo)
	if err != nil {
		// If refresh fails, clear the stale cookie
		clearRefreshCookie(c, h.cfg)
		return err
	}

	// Rotate cookie
	setRefreshCookie(c, h.cfg, resp.RefreshToken)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "token refreshed successfully",
		"data": fiber.Map{
			"access_token": resp.AccessToken,
		},
	})
}
