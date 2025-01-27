import connectDb from '@/helpers/dbConfig';
import { getDataFromToken, handleErrorHttp } from '@/helpers/utils';
import { NextRequest, NextResponse } from 'next/server';
import Comment from '@/models/comment.model';
import { createCommentSchema } from '@/lib/validators';
import Blog from '@/models/blog.model';
connectDb();

export const POST = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    _id: string
  }>
}) => {
  try {
    // _id is blog id, we need it to create comment because it has a relation
    const _id = (await params)._id
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!)
    const userId = await getDataFromToken(token)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }

    const blog = await Blog.findOne({ _id })
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, {
        status: 404
      })
    }

    const formData = await req.formData();
    const fields = Object.fromEntries(formData);
    createCommentSchema.parse(fields);

    const comment = new Comment({
      content: fields.content,
      author: userId,
      blog: _id
    })
    blog.comments.push(comment._id);
    await Promise.all([comment.save(), blog.save()])
    return NextResponse.json({
      success: true,
      message: 'Comment post successfully',
      data: comment
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error);
  }
}


// Edit comment by comment id
export const PATCH = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    _id: string
  }>
}) => {
  try {
    const _id = (await params)._id
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!)
    const userId = await getDataFromToken(token)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }

    const comment = await Comment.findOne({ _id })
    if (!comment) {
      return NextResponse.json({
        success: false,
        message: 'Comment not found'
      }, {
        status: 404
      })
    }

    const isAuthor = comment.author.equals(userId)
    if (!isAuthor) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - You are not the author of this comment'
      }, {
        status: 401
      })
    }

    const formData = await req.formData();
    const fields = Object.fromEntries(formData);
    createCommentSchema.parse(fields);

    comment.content = fields.content;
    await comment.save();

    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    }, {
      status: 200
    })

  } catch (error) {
    return handleErrorHttp(error);
  }
}

export const DELETE = async (req: NextRequest, {
  params
}: {
  params: Promise<{
    _id: string
  }>
}) => {
  try {
    const _id = (await params)._id
    const token = req.cookies.get(process.env.USER_TOKEN_NAME!)
    const userId = await getDataFromToken(token)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - User not found'
      }, {
        status: 401
      })
    }

    const comment = await Comment.findOne({ _id })
    if (!comment) {
      return NextResponse.json({
        success: false,
        message: 'Comment not found'
      }, {
        status: 404
      })
    }

    const isAuthor = comment.author.equals(userId)
    if (!isAuthor) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - You are not the author of this comment'
      }, {
        status: 401
      })
    }

    const deleteComment = Comment.deleteOne({ _id })

    // Find the blog that has this comment and remove the comment id from its comments array
    const deleteCommentOnBlog = Blog.updateOne({
      _id: comment.blog
    }, {
      $pull: {
        comments: _id
      }
    })

    await Promise.all([deleteComment, deleteCommentOnBlog])

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    }, {
      status: 200
    })
  } catch (error) {
    return handleErrorHttp(error);
  }
}
