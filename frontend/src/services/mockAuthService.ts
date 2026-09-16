import { UserProfile, LoginCredentials, SignUpData } from '../types/auth';

const STORAGE_KEY_USER = 'farmguard_user_profile';
const STORAGE_KEY_AUTH = 'farmguard_is_authenticated';

const defaultUser: UserProfile = {
  id: 'user-001',
  fullName: 'Kirtan Sutariya',
  email: 'kirtan.farmer@farmguard.ai',
  phone: '+91 98765 43210',
  location: 'Vadodara, Gujarat',
  preferredLanguage: 'en',
  theme: 'light',
  units: 'metric',
  notificationsEnabled: true,
  createdAt: '2026-01-15'
};

export const mockAuthService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  },

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!credentials.identifier || !credentials.password) {
      return { success: false, error: 'Please enter your email/phone and password' };
    }
    // Mock successful login
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    return { success: true, user: defaultUser };
  },

  async signup(data: SignUpData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!data.fullName || !data.email || !data.password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '+91 98765 00000',
      location: data.location || 'Gujarat, India',
      preferredLanguage: 'en',
      theme: 'light',
      units: 'metric',
      notificationsEnabled: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const current = await this.getCurrentUser() || defaultUser;
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  }
};
