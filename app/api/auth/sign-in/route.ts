import connectDb from '@/helpers/dbConfig';
import { handleErrorHttp } from '@/helpers/utils';
import { cookieSetting } from '@/lib/constants';
import { signInSchema } from '@/lib/validators';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData);

    signInSchema.parse(fields);

    const existedUser = await User.findOne({ email: fields.email });
    if (!existedUser) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, {
        status: 400
      })
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(fields.password);
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
      data: {
        _id: existedUser._id,
        fullname: existedUser.fullname,
        username: existedUser.username,
        profileImage: existedUser.profileImage,
        email: existedUser.email
      }
    }, {
      status: 200
    })
    response.cookies.set(cookieSetting(token));

    return response;
  } catch (error) {
    return handleErrorHttp(error)
  }
}