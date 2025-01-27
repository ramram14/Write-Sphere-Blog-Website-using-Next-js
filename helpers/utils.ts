import { formatZodErrorMessage } from '@/lib/utils';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Blog from '@/models/blog.model';
import slugify from 'slugify';
import moment from 'moment';

interface DecodedToken extends JwtPayload {
  _id: string;
}
export const handleErrorHttp = (error: unknown) => {

  // Handle error from Zod
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue) => {
      const fieldName = issue.path.join('.');
      const formattedFieldName = formatZodErrorMessage(fieldName);
      return `${formattedFieldName} is ${issue.message}`;
    });

    return NextResponse.json({
      success: false,
      message: errorMessages
    }, {
      status: 400
    })
  }
  // Handle error from mongoose validation, usually because lack of required data from schema
  else if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, {
      status: 400
    })
  }
  // Handle expired token error
  else if (error instanceof jwt.TokenExpiredError) {
    return NextResponse.json({
      success: false,
      message: 'Token has expired. Please log in again.',
    }, { status: 401 });
  }
  // Handle error from mongoose usually when we nned to find by id and the id is not valid
  else if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json({
      success: false,
      message: 'Invalid ID format'
    }, {
      status: 400
    })
  }
  else {
    console.log('Unknown error', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, {
      status: 500
    })
  }
}

export const getDataFromToken = async (token: unknown) => {
  try {
    if (!token) {
      return null
    }
    const decodedToken = jwt.verify((token as { value: string }).value, process.env.JWT_SECRET_KEY!);
    // Return the _id from the decoded token
    const userId = (decodedToken as DecodedToken)._id;
    return userId
  } catch (error) {

    return handleErrorHttp(error)
  }
}

export const generateSlug = async (title: string) => {
  try {
    const slug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = slug;
    // if there is same existing title name we start slug counter from 2
    let counter = 2
    while (await Blog.exists({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return uniqueSlug
  } catch (error) {
    console.log('Error generating unique slug:', error);
    throw new Error('Failed to generate unique slug');
  }
}


export const formatTimeAgo = (date: Date) => {
  return moment(date).fromNow();
};

export const formatViews = (views: number) => {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M views`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K views`;
  } else {
    return views;
  }
};

