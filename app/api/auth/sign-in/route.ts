import connectDb from '@/helpers/dbConfig';
import { handleErrorHttp } from '@/helpers/utils';
import { cookieSetting } from '@/lib/constants';
import { signInSchema } from '@/lib/validators';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    signInSchema.parse(reqBody);

    const existedUser = await User.findOne({ email: reqBody.email });
    if (!existedUser) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, {
        status: 400
      })
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(reqBody.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, {
        status: 400
      })
    }
    const token = await existedUser.generateJWTToken();

    const response = NextResponse.json({
      success: true,
      message: 'User sign in successfully',
    }, {
      status: 200
    })
    response.cookies.set(cookieSetting(token));

    return response;
  } catch (error) {
    return handleErrorHttp(error)
  }
}