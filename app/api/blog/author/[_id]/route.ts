import connectDb from '@/helpers/dbConfig';
import { handleErrorHttp } from '@/helpers/utils';
import Blog from '@/models/blog.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const GET = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    _id: string
  }>
}) => {
  try {
    const _id = (await params)._id;

    const blogs = await Blog.find({
      author: _id
    }, '-content')
      .populate({
        path: 'author',
        select: '_id fullName username profileImage'
      })
      .sort({ createdAt: -1 });

    if (!blogs) {
      return NextResponse.json({
        success: false,
        message: 'Blogs not found'
      }, {
        status: 404
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Blogs fetched successfully',
      data: blogs
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}