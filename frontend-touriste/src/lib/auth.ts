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

const getInitialUser = () => {
  try {
    const u = Cookies.get('user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

export const useAuthStore = create<AuthState>((set) => {
  const token = Cookies.get('token') || null;
  const user = getInitialUser();

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,

    login: (user, token) => {
      Cookies.set('token', token); 
      Cookies.set('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      Cookies.remove('token');
      Cookies.remove('user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});