'use server';

import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import Blog from '@/models/blog.model';
import Comment from '@/models/comment.model';
import User from '@/models/user.model';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

connectDb();


// Delete account
export const DELETE = async (req: NextRequest) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);
    const user = await User.findOne
      ({ _id: userId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }
    const formData = await req.formData();
    const fields = Object.fromEntries(formData);
    const isPasswordValid = await user.isPasswordCorrect(fields.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Password'
      }, {
        status: 400
      })
    }
    await User.deleteOne({ _id: userId }).session(session);
    await Blog.deleteMany({ author: userId }).session(session);
    await Comment.deleteMany({ author: userId }).session(session);
    const cookieStrore = await cookies();
    cookieStrore.delete(process.env.USER_TOKEN_NAME!);
    await session.commitTransaction();


    return NextResponse.json({
      success: true,
      message: 'Delete user success'
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error)
  } finally {
    session.endSession();

  }
}