import { NextRequest, NextResponse } from 'next/server';



export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/register';
  const protectedPath = path === '/blog/create'
  const protectedApiRoute = path === '/api/user/profile-data' || path === '/api/blog/create'
  const token = req.cookies.get(process.env.USER_TOKEN_NAME!);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (protectedPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (protectedApiRoute && !token) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    }, {
      status: 401
    });
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