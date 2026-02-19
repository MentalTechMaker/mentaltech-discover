import { create } from 'zustand';
import { getTokens, clearTokens, setOnUnauthorized, hasSessionFlag, refreshAccessToken } from '../api/client';
import { login as apiLogin, register as apiRegister, registerPrescriber as apiRegisterPrescriber, getMe } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
  profession?: string | null;
  organization?: string | null;
  rpps_adeli?: string | null;
  is_verified_prescriber?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPrescriber: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  registerPrescriber: (email: string, password: string, name: string, profession: string, organization?: string, rppsAdeli?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Auto-logout on 401
  setOnUnauthorized(() => {
    set({ user: null, isAuthenticated: false, isAdmin: false, isPrescriber: false });
  });

  return {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isPrescriber: false,
    isLoading: false,

    login: async (email: string, password: string) => {
      await apiLogin(email, password);
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isPrescriber: user.role === 'prescriber' || user.role === 'admin',
      });
    },

    register: async (email: string, password: string, name: string) => {
      await apiRegister(email, password, name);
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isPrescriber: user.role === 'prescriber' || user.role === 'admin',
      });
    },

    registerPrescriber: async (email: string, password: string, name: string, profession: string, organization?: string, rppsAdeli?: string) => {
      await apiRegisterPrescriber(email, password, name, profession, organization, rppsAdeli);
      const user = await getMe();
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isPrescriber: true,
      });
    },

    logout: () => {
      clearTokens();
      set({ user: null, isAuthenticated: false, isAdmin: false, isPrescriber: false });
    },

    loadUser: async () => {
      // Skip entirely for anonymous visitors (no session cookie flag)
      if (!hasSessionFlag()) return;

      set({ isLoading: true });
      try {
        // If no in-memory token (e.g. page refresh), restore via HttpOnly refresh cookie
        if (!getTokens()) {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            clearTokens();
            set({ user: null, isAuthenticated: false, isAdmin: false, isPrescriber: false, isLoading: false });
            return;
          }
        }
        const user = await getMe();
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          isPrescriber: user.role === 'prescriber' || user.role === 'admin',
          isLoading: false,
        });
      } catch {
        clearTokens();
        set({ user: null, isAuthenticated: false, isAdmin: false, isPrescriber: false, isLoading: false });
      }
    },
  };
});
