import connectDb from '@/helpers/dbConfig';
import { handleErrorHttp } from '@/helpers/utils';
import { cookieSetting } from '@/lib/constants';
import { signUpSchema } from '@/lib/validators';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData);
    signUpSchema.parse(fields);

    const existedUser = await User.findOne({
      $or: [{ email: fields.email }, { username: fields.username }]
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
      fullname: fields.fullname,
      username: fields.username,
      email: fields.email,
      password: fields.password
    })
    await user.save();
    const token = await user.generateJWTToken();

    const response = NextResponse.json({
      success: true,
      message: 'User sign up successfully',
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    }, {
      status: 201
    })
    response.cookies.set(cookieSetting(token));

    return response;
  } catch (error: unknown) {
    return handleErrorHttp(error)
  }
}