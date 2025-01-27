import { axiosInstance } from '@/lib/axios';
import { userStoreData } from '@/lib/types';
import { handleAxiosError } from '@/lib/utils';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


interface IUserStore {
  user: userStoreData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;

  setHydrated(): void;
  signUp(formData: FormData): Promise<string | undefined | AxiosError | unknown>;
  signIn(formData: FormData): Promise<string | undefined | AxiosError | unknown>;
  signOut(): Promise<void>;
}

export const userUserStore = create<IUserStore>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      signUp: async (formData: FormData) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.
            post('/auth/signup', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          set({
            user: data.data,
            isAuthenticated: true
          })
        } catch (error: AxiosError | unknown) {
          return (error as { message: string }).message
        } finally {
          set({ isLoading: false })
        }
      },

      signIn: async (formData: FormData) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.
            post('/auth/signin', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          set({
            user: data.data,
            isAuthenticated: true
          })
        } catch (error: AxiosError | unknown) {
          return (error as { message: string }).message
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true })
          await axiosInstance.post('/auth/signout')
          set({
            user: null,
            isAuthenticated: false
          })
        } catch (error: AxiosError | unknown) {
          handleAxiosError(error)
        } finally {
          set({ isLoading: false })
        }
      }
    })), {
    name: 'userStore',
    onRehydrateStorage() {
      return (state, error) => {
        if (!error) state?.setHydrated()
      }
    }
  }
  )
)