
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Write Sphere';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'where your thoughts find their voice through words'

export const blogCategories = ['Lifestyle', 'Hobby', 'Finance', 'Health', 'Philosophy', 'Technology', 'Self Improvement', 'Food', 'Education', 'Entertainment']

export const cookieSetting = (token: string) => {
  return {
    name: process.env.USER_TOKEN_NAME || 'WriteSphere',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict' as "strict" | "lax" | "none" | false,
    path: '/',
    maxAge: Number(process.env.COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}