import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get('token') || null,
  isAuthenticated: false, // ← CORRIGÉ : false par défaut

  login: (user, token) => {
    Cookies.set('token', token, { expires: 7 }); // expire dans 7 jours
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));