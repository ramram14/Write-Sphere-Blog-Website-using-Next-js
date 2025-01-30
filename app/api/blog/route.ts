import { uploadImage } from '@/helpers/cloudinary.config';
import connectDb from '@/helpers/dbConfig';
import { generateSlug, getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import { CreateBlogSchema } from '@/lib/validators';
import Blog from '@/models/blog.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
connectDb();

export const GET = async (req: NextRequest) => {
  try {
    const reqQuery = req.nextUrl.searchParams;
    const search = reqQuery.get('search');
    const category = reqQuery.get('category');
    let blogs

    // If client sends search or category we search for it
    if (search || category) {
      if (search && search.length > 15) {
        return NextResponse.json({
          success: false,
          message: 'Search query is too long, maximum length is 15',
        }, { status: 400 });
      }

      const searchRegex = {
        $regex: search || category,
        $options: 'i',
      };

      blogs = await Blog.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { category: searchRegex },
        ]
      }, '-content')
        .populate({
          path: 'author',
          select: '_id fullName username profileImage'
        })
        .sort({ createdAt: -1 });
    } else {

      // If client doesn't send search or category we fetch all blogs
      blogs = await Blog.find({}, '-content')
        .populate({
          path: 'author',
          select: '_id fullName username profileImage'
        })
        .sort({ createdAt: -1 });
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

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!);
    const userId = await getDataFromToken(token);
    const user = await User.findOne({ _id: userId });
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
    CreateBlogSchema.parse(fields);
    const imageUrl = await uploadImage(fields.image as File);
    const slug = await generateSlug(fields.title as string);
    const newBlog = new Blog({
      ...fields,
      slug,
      author: user._id,
      image: imageUrl
    })
    await newBlog.save()

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    }, {
      status: 201
    })
  } catch (error) {
    return handleErrorHttp(error)
  }
}

