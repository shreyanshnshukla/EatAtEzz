import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../types';

interface AppState {
  userType: UserType;
  isOnboarded: boolean;
  userName: string;
  userCity: string;
  setUserType: (type: UserType) => void;
  setOnboarded: (val: boolean) => void;
  setUserName: (name: string) => void;
  setUserCity: (city: string) => void;
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userType: null,
      isOnboarded: false,
      userName: '',
      userCity: '',

      setUserType: (type) => set({ userType: type }),
      setOnboarded: (val) => set({ isOnboarded: val }),
      setUserName: (name) => set({ userName: name }),
      setUserCity: (city) => set({ userCity: city }),
      reset: () => set({ userType: null, isOnboarded: false, userName: '', userCity: '' }),
    }),
    {
      name: 'eatAtEzz-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
