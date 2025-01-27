import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import Comment from '@/models/comment.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);
    const user = await User.exists({ _id: userId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }

    const comments = await Comment.find({ author: userId });

    return NextResponse.json({
      success: true,
      message: 'Comments fetched successfully',
      data: comments
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error);
  }
}