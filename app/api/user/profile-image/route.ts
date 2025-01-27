import { deleteImage } from '@/helpers/cloudinary.config';
import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const DELETE = async (req: NextRequest) => {
  try {
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

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, {
        status: 404
      })
    }

    // Delete profile image on cloudinary
    await deleteImage(user.profileImage!);
    user.profileImage = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile image deleted successfully',
      data: {
        fullname: user.fullname,
        username: user.username,
        profileImage: user.profileImage
      }
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error);
  }
}