'use server'

import { getDataFromToken, handleErrorHttp } from '@/helpers/utils'
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);

    return NextResponse.json({
      success: true,
      message: 'User found successfully',
      data: userId
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}