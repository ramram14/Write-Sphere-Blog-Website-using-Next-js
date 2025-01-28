import { AxiosError } from 'axios';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// We used this for formatting error that comes from zod validation
export const formatZodErrorMessage = (fieldname: string) => {
  return fieldname
    // Add space before capital letters for camel case words and capitalize it at first letter to be more readable for human
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase());
}

export const handleAxiosError = (error: AxiosError | unknown): { success: boolean, message: string } => {
  if (error instanceof AxiosError) {
    if (error.response && error.response.data && (error.response.data as { message: string }).message) {
      console.log(error.response.data.message)
      return {
        success: false,
        message: error.response.data.message
      }
    } else {
      console.log(error.message)
      return {
        success: false,
        message: error.message
      }
    }
  } else {
    console.log(error)
    return {
      success: false,
      message: error as string
    }
  }
}