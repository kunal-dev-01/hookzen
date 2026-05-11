package handler

import (
	"server/internal/dto"
	"server/internal/service/auth"
	"server/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type PasswordHandler struct {
	service *service.PasswordService
}

func NewPasswordHandler(s *service.PasswordService) *PasswordHandler {
	return &PasswordHandler{service: s}
}

// ForgotPassword handles the request to send a reset link
func (h *PasswordHandler) ForgotPassword(c *fiber.Ctx) error {
	var req dto.ForgotPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	if err := h.service.ForgotPassword(c.Context(), req); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "if an account exists for this email, a reset link has been sent",
	})
}

// ResetPassword handles the actual password update
func (h *PasswordHandler) ResetPassword(c *fiber.Ctx) error {
	var req dto.ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	if err := h.service.ResetPassword(c.Context(), req); err != nil {
		return err
	}

	// Also clear session cookies on the client side if they exist
	c.ClearCookie("refresh_token")

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "password reset successful, all active sessions have been revoked",
	})
}
