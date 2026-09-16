import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farm } from '../types/farm';
import { UserProfile } from '../types/auth';
import { mockFarmService } from '../services/mockFarmService';
import { mockAuthService } from '../services/mockAuthService';
import { locales, LanguageCode } from '../locales';

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Language
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  t: typeof locales.en;

  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;

  // Farms
  farms: Farm[];
  selectedFarm: Farm | null;
  setSelectedFarm: (farm: Farm) => void;
  refreshFarms: () => Promise<void>;
  updateFarmData: (id: string, updates: Partial<Farm>) => Promise<void>;
  addNewFarm: (newFarm: Omit<Farm, 'id'>) => Promise<Farm>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('farmguard_theme') as 'light' | 'dark';
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('farmguard_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Language
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('farmguard_lang') as LanguageCode;
    return saved && locales[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('farmguard_lang', language);
  }, [language]);

  const t = locales[language] || locales.en;

  // Auth
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('farmguard_is_authenticated') === 'true';
  });

  useEffect(() => {
    mockAuthService.getCurrentUser().then(u => setUser(u));
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await mockAuthService.login({ identifier, password: pass });
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await mockAuthService.logout();
    setIsAuthenticated(false);
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    const updated = await mockAuthService.updateProfile(updates);
    setUser(updated);
  };

  // Farms
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const refreshFarms = async () => {
    const list = await mockFarmService.getFarms();
    setFarms(list);
    if (!selectedFarm && list.length > 0) {
      setSelectedFarm(list[0]);
    } else if (selectedFarm) {
      const current = list.find(f => f.id === selectedFarm.id);
      if (current) setSelectedFarm(current);
    }
  };

  useEffect(() => {
    refreshFarms();
  }, []);

  const updateFarmData = async (id: string, updates: Partial<Farm>) => {
    const updated = await mockFarmService.updateFarm(id, updates);
    await refreshFarms();
    if (selectedFarm && selectedFarm.id === id) {
      setSelectedFarm(updated);
    }
  };

  const addNewFarm = async (newFarm: Omit<Farm, 'id'>) => {
    const created = await mockFarmService.createFarm(newFarm);
    await refreshFarms();
    setSelectedFarm(created);
    return created;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        farms,
        selectedFarm,
        setSelectedFarm,
        refreshFarms,
        updateFarmData,
        addNewFarm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
