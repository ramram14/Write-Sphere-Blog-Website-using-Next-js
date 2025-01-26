import { updateImage } from '@/helpers/cloudinary.config';
import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils'
import Blog from '@/models/blog.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const GET = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  try {
    const slug = (await params).slug;

    const blog = await Blog.findOneAndUpdate({
      slug
    }, {
      // Increament views for every request to specific blog
      $inc: { views: 1 }
    }, {
      new: true
    })
      .populate({
        path: 'author',
        select: '_id fullName username profileImage'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: '_id username profileImage',
        }
      }).sort({ createdAt: -1 });

    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, {
        status: 404
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Blog fetched successfully',
      data: blog
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}

export const PATCH = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  try {
    const slug = (await params).slug;
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
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, {
        status: 404
      })
    }

    // Always check if the user make the request is the author
    const isAuthor = blog.author.equals(user._id);
    if (!isAuthor) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - You are not the author of this blog'
      }, {
        status: 401
      })
    }

    const formData = await req.formData();
    const fields = Object.fromEntries(formData);
    let imageUrl = null;
    if (fields.image) {
      const uploadResult = await updateImage(fields.image as File, blog.image);
      imageUrl = uploadResult
    }

    blog.title = fields.title || blog.title;
    blog.content = fields.content || blog.content;
    blog.category = fields.category || blog.category;
    blog.image = imageUrl || blog.image;
    blog.save();


    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}

export const DELETE = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  try {
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);
    const slug = (await params).slug;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, {
        status: 404
      })
    }

    // Always check if the user make the request is the author
    const isAuthor = blog.author.equals(userId);
    if (!isAuthor) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - You are not the author of this blog'
      }, {
        status: 401
      })
    }

    await Blog.findOneAndDelete({ slug });
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}