'use server'
import { revalidatePath } from 'next/cache';
import { axiosInstance } from '../axios';
import { handleAxiosError } from '../utils';
import { blogData } from '../types';
import { cookies } from 'next/headers';

export const getCommentByBlogId = async (blogId: string): Promise<{
  success: boolean;
  message: string;
  data?: blogData
}> => {
  try {
    const { data } = await axiosInstance.get(`/comment/${blogId}`)
    return {
      success: true,
      message: 'Comment fetched successfully',
      data: data.data
    }
  } catch (error) {
    return handleAxiosError(error);
  }
}
export const createComment = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const blogId = formData.get('blogId')
    const commentId = formData.get('commentId')
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    await axiosInstance.post(`/comment/${blogId}?${commentId ? `parentComment=${commentId}` : ''}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    revalidatePath('/[slug]');
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const editComment = async (
  prevState: unknown,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: blogData
}> => {
  try {
    const commentId = formData.get('commentId')
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    const { data } = await axiosInstance.patch(`/comment/${commentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    })
    revalidatePath('/[slug]');
    return {
      success: true,
      message: 'Comment edited successfully',
      data: data.data
    }
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const deleteComment = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    await axiosInstance.delete(`/comment/${formData.get('blogId')}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    revalidatePath('(root)/[slug]');
  } catch (error) {
    return handleAxiosError(error);
  }
}