export interface UserPreferences {
  notifications: {
    email: boolean;
    webhook_failures: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_email_verified: boolean;
  last_login_at?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPayload {
  full_name?: string;
}

export interface UpdatePreferencesPayload {
  notifications?: {
    email?: boolean;
    webhook_failures?: boolean;
  };
}
