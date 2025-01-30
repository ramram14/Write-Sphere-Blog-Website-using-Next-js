'use server';

import { cookies } from 'next/headers';
import { axiosInstance } from '../axios';
import { blogData } from '../types';
import { handleAxiosError } from '../utils';
import { getUserId } from './user.action';
import { revalidatePath } from 'next/cache';



export const getAllBlogs = async ({
  search,
  category
}: {
  search?: string;
  category?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: blogData[]
}> => {
  try {
    const { data } = await axiosInstance.get(`/blog?${search ? `search=${search}` : ''}${category ? `&category=${category}` : ''}`)
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

export const getBlogByAuthor = async ():
  Promise<{
    success: boolean;
    message: string;
    data?: blogData
  }> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized - Please Sign In First'
      }
    }

    const { data } = await axiosInstance.get(`/blog/author/${userId}`)
    return {
      success: true,
      message: 'Blogs fetched successfully',
      data: data.data
    }
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const createBlog = async (
  prevState: unknown,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: blogData
}> => {
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

export const editBlog = async (
  prevState: unknown,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: blogData
}> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    const { data } = await axiosInstance.patch(`/blog/${formData.get('slug')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    return ({
      success: true,
      message: 'Blog edit successfully',
      data: data.data
    })
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const deleteBlog = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.USER_TOKEN_NAME!)?.value;
    await axiosInstance.delete(`/blog/${formData.get('slugBlog')}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `${cookieStore}`,
      }
    });
    revalidatePath('(root)/profile/my-post');
  } catch (error) {
    return handleAxiosError(error);
  }
}
