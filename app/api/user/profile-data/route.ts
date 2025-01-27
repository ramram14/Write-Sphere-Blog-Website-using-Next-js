import { updateImage } from '@/helpers/cloudinary.config';
import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import { updateProfileDataSchema } from '@/lib/validators';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const PATCH = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData);

    updateProfileDataSchema.parse(fields);

    const token = req.cookies.get(process.env.USER_TOKEN_NAME!)
    const userId = await getDataFromToken(token)

    const user = await User.findOne({ _id: userId });
    if (!user) {
      const response = NextResponse.json({
        success: false,
        message: 'User not found'
      }, {
        status: 404
      })
      response.cookies.delete(process.env.USER_TOKEN_NAME!);
      return response;
    }


    let imageUrl = null;
    if (fields.profileImage) {
      const uploadResult = await updateImage(fields.profileImage as File, user.profileImage);
      imageUrl = uploadResult
    }
    user.fullname = fields.fullname || user.fullname;
    user.username = fields.username || user.username;
    user.email = fields.email || user.email;
    user.profileImage = imageUrl || user.profileImage;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile data updated successfully',
      data: {
        fullname: user.fullname,
        username: user.username,
        profileImage: user.profileImage,
        email: user.email
      }
    }, {
      status: 200
    });
  } catch (error: unknown) {
    return handleErrorHttp(error)
  }
}