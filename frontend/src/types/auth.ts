export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'hi' | 'gu';
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  identifier: string; // Email or phone
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  farmName?: string;
}
