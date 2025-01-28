'use server';

import { cookies } from 'next/headers';
import { axiosInstance } from './axios';
import { blogData } from './types';
import { handleAxiosError } from './utils';
import { revalidatePath } from 'next/cache';

export const getAllBlogs = async (): Promise<{
  success: boolean;
  message: string;
  data?: blogData[]
}> => {
  try {
    const { data } = await axiosInstance.get('/blog')
    return { success: true, message: 'Blogs fetched successfully', data: data.data }
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const getBlogBySlug = async (slug: string): Promise<{
  success: boolean;
  message: string;
  data?: blogData
}> => {
  try {
    const { data } = await axiosInstance.get(`/blog/${slug}`)
    return {
      success: true,
      message: 'Blog fetched successfully',
      data: data.data
    }
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const createBlog = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    const { data } = await axiosInstance.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    return ({
      success: true,
      message: 'Blog created successfully',
      data
    })
  } catch (error) {
    return handleAxiosError(error);
  }
}


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
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    const { data } = await axiosInstance.post(`/comment/${formData.get('blogId')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    console.log(data)
    revalidatePath('/[slug]');
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const toggleLikeCommentButton = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    await axiosInstance.post(`/comment/like/${formData.get('blogId')}`, formData, {
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