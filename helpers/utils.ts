import { formatZodErrorMessage } from '@/lib/utils';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers';

interface DecodedToken extends JwtPayload {
  _id: string;
}
export const handleErrorHttp = (error: unknown) => {
  ;
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue) => {
      const fieldName = issue.path.join('.');
      const formattedFieldName = formatZodErrorMessage(fieldName);
      return `${formattedFieldName} is ${issue.message}`;
    });

    return NextResponse.json({
      success: false,
      message: errorMessages
    }, {
      status: 400
    })
  }
  else if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, {
      status: 400
    })
  }
  else if (error instanceof jwt.TokenExpiredError) {
    // Handle expired token error
    return NextResponse.json({
      success: false,
      message: 'Token has expired. Please log in again.',
    }, { status: 401 });
  }
  else {
    console.log('Unknown error', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, {
      status: 500
    })
  }
}

export const getDataFromToken = async (token: unknown) => {
  try {
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Please sign in first'
      }, {
        status: 401
      })
    }
    const decodedToken = jwt.verify((token as { value: string }).value, process.env.JWT_SECRET_KEY!);
    if (!decodedToken) {
      const cookieStore = await cookies();
      cookieStore.delete(process.env.USER_TOKEN_NAME!);
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid token'
      }, {
        status: 401
      })
    }
    const userId = (decodedToken as DecodedToken)._id;
    return userId
  } catch (error) {

    return handleErrorHttp(error)
  }
}
