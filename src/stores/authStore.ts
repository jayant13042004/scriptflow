import { create } from 'zustand';
import {
  signIn,
  signUp,
  signOut,
  signInWithGoogle,
  getCurrentUser,
  onAuthStateChange,
  type User,
} from '../services/supabase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  initAuth: () => void;
}

const DEFAULT_GUEST_USER: User = {
  id: 'test-creator-guest',
  email: 'creator@scriptflow.test',
  displayName: 'Test Creator',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_GUEST_USER,
  isAuthenticated: true,
  isLoading: false,

  login: async (email, password) => {
    const { user, error } = await signIn(email, password);
    if (error) {
      throw new Error(error.message || 'Invalid email or password');
    }
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },

  signup: async (email, password, displayName) => {
    const { user, error } = await signUp(email, password, displayName);
    if (error) {
      throw new Error(error.message || 'Could not create account');
    }
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },

  loginWithGoogle: async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      throw new Error(error.message || 'Google sign-in failed');
    }
  },

  loginAsGuest: () => {
    set({
      user: DEFAULT_GUEST_USER,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await signOut();
    // In testing mode, keep a clean state or allow re-entry
    set({ user: null, isAuthenticated: false });
  },

  initAuth: () => {
    // Check for an existing session
    getCurrentUser().then((user) => {
      // In testing mode without sign-in, default to guest if no session
      const activeUser = user || DEFAULT_GUEST_USER;
      set({
        user: activeUser,
        isAuthenticated: true,
        isLoading: false,
      });
    });

    // Listen for auth state changes
    onAuthStateChange((user) => {
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    });
  },
}));
