import { z } from 'zod';
import { createCommentSchema } from './validators';

export interface userStoreData {
  _id: string;
  fullname: string;
  username: string;
  profileImage: string;
  email: string;
}
export interface blogData {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  slug: string;
  category: string;
  image: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: userStoreData;
  comments: commentData[];
  likeuser: {
    _id: string[];
  }
}
export interface commentData
  extends z.infer<typeof createCommentSchema> {
  _id: string;
  author: userStoreData;
  blog: blogData;
  likeUsers: userStoreData[];
  likesNumber: number;
  createdAt: string;
  updatedAt: string;
}
