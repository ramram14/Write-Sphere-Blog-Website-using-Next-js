import { handleErrorHttp } from '@/helpers/utils'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export const POST = async () => {
  try {
    const cookieStrore = await cookies();
    cookieStrore.delete(process.env.USER_TOKEN_NAME!);
    return NextResponse.json({
      success: true,
      message: 'User signed out successfully',
    }, {
      status: 200
    });
  } catch (error) {
    return handleErrorHttp(error)
  }
}