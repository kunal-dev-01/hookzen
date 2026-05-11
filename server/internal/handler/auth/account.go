package handler

import (
	"server/internal/config"
	"server/internal/dto"
	"server/internal/service/auth"
	"server/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type AccountHandler struct {
	cfg     *config.Config
	service *service.AccountService
}

func NewAccountHandler(cfg *config.Config, s *service.AccountService) *AccountHandler {
	return &AccountHandler{cfg: cfg, service: s}
}

// Register handles user registration
func (h *AccountHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	if err := h.service.Register(c.Context(), req); err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "registration successful — please check your email to verify your account",
	})
}

// VerifyEmail handles email verification and auto-login
func (h *AccountHandler) VerifyEmail(c *fiber.Ctx) error {
	var req dto.VerifyEmailRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	// Capture client info for auto-login session
	clientInfo := dto.ClientInfo{
		IP:         c.IP(),
		Browser:    c.Get("User-Agent"),
		OS:         c.Get("X-OS"),
		DeviceName: c.Get("X-Device"),
	}

	resp, err := h.service.VerifyEmail(c.Context(), req.Token, clientInfo)
	if err != nil {
		return err
	}

	// Set refresh token in cookie for auto-login
	setRefreshCookie(c, h.cfg, resp.RefreshToken)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "email verified successfully, you are now logged in",
		"data": fiber.Map{
			"user":         resp.User,
			"access_token": resp.AccessToken,
		},
	})
}

// ResendVerification handles resending verification email
func (h *AccountHandler) ResendVerification(c *fiber.Ctx) error {
	var req dto.ResendVerificationRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	if err := h.service.ResendVerification(c.Context(), req.Email); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "verification email sent successfully",
	})
}

// Login handles user authentication
func (h *AccountHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	// Capture client info
	clientInfo := dto.ClientInfo{
		IP:         c.IP(),
		Browser:    c.Get("User-Agent"),
		OS:         c.Get("X-OS"),
		DeviceName: c.Get("X-Device"),
	}

	resp, err := h.service.Login(c.Context(), req, clientInfo)
	if err != nil {
		return err
	}

	// Set refresh token in cookie
	setRefreshCookie(c, h.cfg, resp.RefreshToken)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "login successful",
		"data": fiber.Map{
			"user":         resp.User,
			"access_token": resp.AccessToken,
		},
	})
}
