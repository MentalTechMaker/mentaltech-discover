import { create } from 'zustand';
import { getTokens, clearTokens, setOnUnauthorized } from '../api/client';
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Auto-logout on 401
  setOnUnauthorized(() => {
    set({ user: null, isAuthenticated: false, isAdmin: false });
  });

  return {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,

    login: async (email: string, password: string) => {
      await apiLogin(email, password);
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    },

    register: async (email: string, password: string, name: string) => {
      await apiRegister(email, password, name);
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    },

    logout: () => {
      clearTokens();
      set({ user: null, isAuthenticated: false, isAdmin: false });
    },

    loadUser: async () => {
      const tokens = getTokens();
      if (!tokens?.accessToken) return;

      set({ isLoading: true });
      try {
        const user = await getMe();
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          isLoading: false,
        });
      } catch {
        clearTokens();
        set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
      }
    },
  };
});
