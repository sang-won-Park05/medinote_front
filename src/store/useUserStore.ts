// src/store/useUserStore.ts

import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
  userPassword: string | null;
  userAvatar: string | null;
  role: 'admin' | 'user' | null;

  login: (name: string, email: string, password: string, role: 'admin' | 'user') => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  updateAvatar: (dataUrl: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  // --- 초기 상태 ---
  isLoggedIn: false,
  userName: null,
  userEmail: null,
  userPassword: null,
  userAvatar: null,
  role: null,

  // --- 액션 ---
  login: (name, email, password, role) => {
    set({
      isLoggedIn: true,
      userName: name,
      userEmail: email,
      userPassword: password,
      userAvatar: name.charAt(0) || 'U',
      role: role,
    });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      userName: null,
      userEmail: null,
      userPassword: null,
      userAvatar: null,
      role: null,
    });
  },

  updateProfile: (name, email) => {
    set({
      userName: name,
      userEmail: email,
      userAvatar: name.charAt(0) || 'U',
    });
  },

  updateAvatar: (dataUrl) => {
    set({ userAvatar: dataUrl });
  },
}));

export default useUserStore;
