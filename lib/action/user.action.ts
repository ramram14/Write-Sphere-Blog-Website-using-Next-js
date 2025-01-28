'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { handleAxiosError } from '../utils';
import { axiosInstance } from '../axios';
export const getUserId = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
  if (!token) {
    return null
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  return (decodedToken as JwtPayload)?._id;
}

export const signUp = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    await axiosInstance.post('/user/sign-up', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    revalidatePath('/sign-in');
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const signIn = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    await axiosInstance.post('/user/sign-in', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    revalidatePath('/');
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const signOut = async () => {
  await axiosInstance.post('/user/sign-out')
}

export const updateProfile = async (formData: FormData) => {
  try {
    const { data } = await axiosInstance.patch('/user/profile-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { success: true, message: data.message }
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const deleteProfileImage = async () => {
  try {
    const { data } = await axiosInstance.delete('/user/profile-image')
    return { success: true, message: data.message }
  } catch (error) {
    return handleAxiosError(error);
  }
}
