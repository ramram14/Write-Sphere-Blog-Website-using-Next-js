import { formatZodErrorMessage } from '@/lib/utils';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod'

export const handleErrorHttp = (error: unknown) => {
  ;
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
  } else if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json({
      success: false,
      message: error.message
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