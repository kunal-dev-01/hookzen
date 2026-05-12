package handler

import (
	"server/internal/dto"
	"server/internal/middleware"
	"server/internal/service/user"
	"server/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

// GetMe returns the currently authenticated user's profile
func (h *UserHandler) GetMe(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.Unauthorized("authentication required")
	}

	user, err := h.service.GetMe(c.Context(), userID)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    dto.UserResponse{User: *user},
	})
}

// UpdateProfile updates the user's basic information
func (h *UserHandler) UpdateProfile(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.Unauthorized("authentication required")
	}

	var req dto.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	user, err := h.service.UpdateProfile(c.Context(), userID, req)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "profile updated successfully",
		"data":    dto.UserResponse{User: *user},
	})
}

// UpdatePreferences updates the user's notification preferences
func (h *UserHandler) UpdatePreferences(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.Unauthorized("authentication required")
	}

	var req dto.UpdatePreferencesRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.BadRequest("invalid request body")
	}

	if err := utils.ValidateStructToAppError(req); err != nil {
		return err
	}

	user, err := h.service.UpdatePreferences(c.Context(), userID, req)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "preferences updated successfully",
		"data":    dto.UserResponse{User: *user},
	})
}
