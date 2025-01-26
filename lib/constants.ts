export const cookieSetting = (token: string) => {
  return {
    name: process.env.USER_TOKEN_NAME || 'WriteSphere',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict' as "strict" | "lax" | "none" | false,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  }
}