import { string, z } from 'zod'

function validateFile() {
  const maxUploadSize = 2 * 1024 * 1024;

  return z.instanceof(File).refine((file) => {
    return (
      !file ||
      file.size <= maxUploadSize
    )
  }, 'file size must be less than 2MB')
}
export const signUpSchema = z.object({
  fullname: z.string().min(5, 'Must be at least 5 characters')
    .max(20, 'Must be at most 20 characters'),
  username: z.string().min(3, 'Must be at least 3 characters')
    .max(10, 'Must be at most 10 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters long')
});
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters long')
});
export const updateProfileDataSchema = z.object({
  fullname: z.string().min(5, 'Must be at least 5 characters')
    .max(20, 'Must be at most 20 characters').optional(),
  username: z.string().min(3, 'Must be at least 3 characters')
    .max(10, 'Must be at most 10 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  profileImage: validateFile().optional()
}).refine((data) => {
  return data.fullname || data.username || data.email || data.profileImage;
}, {
  message: 'At least one field must be updated'
})
export const CreateBlogSchema = z.object({
  title: string().min(5, 'Must be at least 5 characters long'),
  subtitle: string().min(5, 'Must be at least 5 characters long'),
  image: validateFile(),
  content: string().min(10, 'Must be at least 10 characters long'),
  category: z.enum(['Lifestyle', 'Hobby', 'Finance', 'Health', 'Philosophy', 'Technology', 'Self Improvement', 'Food', 'Education', 'Entertainment'])
})
export const updateBlogSchema = z.object({
  title: string().min(5, 'Must be at least 5 characters long').optional(),
  image: validateFile().optional(),
  content: string().min(10, 'Must be at least 10 characters long').optional(),
  category: z.enum(['Lifestyle', 'Hobby', 'Finance', 'Health', 'Philosophy', 'Technology', 'Self Improvement', 'Food', 'Education', 'Entertainment']).optional(),
})
export const createCommentSchema = z.object({
  content: string().max(1000, 'Must be at most 1000 characters')
})