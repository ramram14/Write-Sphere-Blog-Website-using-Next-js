'use server';

import { axiosInstance } from './axios';
import { handleAxiosError } from './utils';

export const getAllBlogs = async () => {
  try {
    const { data } = await axiosInstance.get('/blog')
    return data.data
  } catch (error) {
    handleAxiosError(error);
  }
}

export const getBlogBySlug = async (slug: string) => {
  try {
    const { data } = await axiosInstance.get(`/blog/${slug}`)
    return data.data
  } catch (error) {
    handleAxiosError(error);
  }
}