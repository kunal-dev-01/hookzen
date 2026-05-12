import { apiClient } from "@/lib/axios";
import type { BackendSuccessResponse } from "@/types/api.types";
import type {
  UpdatePreferencesPayload,
  UpdateUserPayload,
  User,
} from "@/types/user.types";

const BASE = "/user";

async function getMe() {
  const res = await apiClient.get<BackendSuccessResponse<User>>(`${BASE}/me`);
  return res.data;
}

async function updateProfile(data: UpdateUserPayload) {
  const res = await apiClient.patch<BackendSuccessResponse<User>>(
    `${BASE}/profile`,
    data,
  );
  return res.data;
}

async function updatePreferences(data: UpdatePreferencesPayload) {
  const res = await apiClient.patch<BackendSuccessResponse<User>>(
    `${BASE}/preferences`,
    data,
  );
  return res.data;
}

export const userService = {
  getMe,
  updateProfile,
  updatePreferences,
};
