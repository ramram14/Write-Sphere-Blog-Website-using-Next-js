import connectDb from '@/helpers/dbConfig';
import { handleErrorHttp } from '@/helpers/utils';
import { cookieSetting } from '@/lib/constants';
import { signUpSchema } from '@/lib/validators';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    signUpSchema.parse(reqBody);

    const existedUser = await User.findOne({
      $or: [{ email: reqBody.email }, { username: reqBody.username }]
    });
    if (existedUser) {
      return NextResponse.json({
        success: false,
        message: 'User email or Username already exists'
      }, {
        status: 400
      })
    }

    const user = new User({
      fullname: reqBody.fullname,
      username: reqBody.username,
      email: reqBody.email,
      password: reqBody.password
    })
    await user.save();
    const token = await user.generateJWTToken();

    const response = NextResponse.json({
      success: true,
      message: 'User sign up successfully',
    }, {
      status: 201
    })
    response.cookies.set(cookieSetting(token));

    return response;
  } catch (error: unknown) {
    return handleErrorHttp(error)
  }
}