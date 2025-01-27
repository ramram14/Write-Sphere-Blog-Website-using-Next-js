import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import { NextRequest, NextResponse } from 'next/server';
import Comment from '@/models/comment.model';
connectDb();

// Like or unlike a comment by comment id
export const POST = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    _id: string
  }>
}) => {
  try {
    const _id = (await params)._id;
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }

    const comment = await Comment.findOne({ _id });
    if (!comment) {
      return NextResponse.json({
        success: false,
        message: 'Comment not found'
      }, {
        status: 404
      })
    }

    // Check if the user has already liked the comment
    const isLikedIndex = comment.LikeUsers.indexOf(userId);
    if (isLikedIndex === -1) {
      // If not, add the user to the LikeUsers array and increment the likesNumber
      comment.LikeUsers.push(userId);
      comment.likesNumber = comment.likesNumber + 1;
    } else {
      // If yes, remove the user from the LikeUsers array and decrement the likesNumber
      comment.LikeUsers.splice(isLikedIndex, 1);
      comment.likesNumber = comment.likesNumber - 1;
    }

    await comment.save();

    return NextResponse.json({
      success: true,
      message: 'Comment liked or unliked successfully'
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error);
  }
}