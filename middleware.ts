import { NextRequest, NextResponse } from 'next/server';



export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === '/sign-in' || path === '/sign-up';
  const protectedPath = path === '/write';

  const token = req.cookies.get(process.env.USER_TOKEN_NAME!);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (protectedPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }



};

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/blog/create',
    "/(api|trpc)(.*)"
  ]
}