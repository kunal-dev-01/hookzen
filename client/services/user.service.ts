/**
 * @file user.service.ts
 * Methods for user profile and preference management.
 */

import { apiClient } from "@/lib/axios";
import type { BackendSuccessResponse } from "@/types/api.types";
import type { UpdateUserPayload, User } from "@/types/user.types";

const BASE = "/users";

async function updateMe(data: UpdateUserPayload) {
  const res = await apiClient.patch<BackendSuccessResponse<User>>(
    `${BASE}/me`,
    data,
  );
  return res.data;
}

export const userService = {
  updateMe,
};
