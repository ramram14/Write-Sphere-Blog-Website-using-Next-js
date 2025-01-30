import { axiosInstance } from '@/lib/axios';
import { userStoreData } from '@/lib/types';
import { handleAxiosError } from '@/lib/utils';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
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
  updateProfile(formData: FormData): Promise<{ success?: boolean, message?: string }>;
  deleteImage(): Promise<{ success?: boolean, message?: string }>;
  deleteAccount(formData: FormData): Promise<{ success: boolean, message: string }>
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
      },

      updateProfile: async (formData: FormData) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.patch('/user/profile-data', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          set({
            user: data.data
          })
          toast.dismiss()
          toast.success(data.message)
          return { success: true, message: data.message }
        } catch (error) {
          return handleAxiosError(error)
        } finally {
          set({ isLoading: false })
        }
      },

      deleteImage: async () => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.delete('/user/profile-image')
          set({
            user: data.data
          })
          toast.dismiss()
          toast.success(data.message)
          return { success: true, message: data.message }
        } catch (error) {
          return handleAxiosError(error)
        } finally {
          set({ isLoading: false })
        }
      },
      deleteAccount: async (formData: FormData) => {
        try {
          set({ isLoading: true })
          const { data } = await axiosInstance.delete('/auth/delete-account', {
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          set({
            user: null,
            isAuthenticated: false
          })
          return data
        } catch (error) {
          return handleAxiosError(error)
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