import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/user';

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  cookie: string | null;
  login: (profile: UserProfile, cookie: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: null,
      cookie: null,
      login: (profile, cookie) => set({ isLoggedIn: true, profile, cookie }),
      logout: () => set({ isLoggedIn: false, profile: null, cookie: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
