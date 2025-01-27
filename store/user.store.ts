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
  signUp(formData: FormData, onSuccess: () => void): Promise<string | undefined | AxiosError | unknown>;
  signIn(formData: FormData, onSuccess: () => void): Promise<string | undefined | AxiosError | unknown>;
  signOut(onSuccess?: () => void): Promise<void>;
}

export const useUserStore = create<IUserStore>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      signUp: async (formData: FormData, onSuccess: () => void) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.
            post('/auth/sign-up', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          set({
            user: data.data,
            isAuthenticated: true
          })
          onSuccess()
        } catch (error: AxiosError | unknown) {
          if (error instanceof AxiosError) {
            return error.response?.data?.message;
          }
          return (error as { message: string }).message
        } finally {
          set({ isLoading: false })
        }
      },

      signIn: async (formData: FormData, onSuccess: () => void) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.
            post('/auth/sign-in', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          set({
            user: data.data,
            isAuthenticated: true
          })
          onSuccess()
        } catch (error: AxiosError | unknown) {
          if (error instanceof AxiosError) {
            return error.response?.data?.message;
          }
          return (error as { message: string }).message
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async (onSuccess?: () => void) => {
        try {
          set({ isLoading: true })
          await axiosInstance.post('/auth/sign-out')
          set({
            user: null,
            isAuthenticated: false
          })
          onSuccess?.()
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