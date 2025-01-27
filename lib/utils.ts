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

export const handleAxiosError = (error: AxiosError | unknown) => {
  // toast.dismiss()
  if (error instanceof AxiosError) {
    if (error.response && error.response.data && (error.response.data as { message: string }).message) {
      console.log(error.response.data.message)
      return error.response.data.meessage
    } else {
      return error.message
    }
  } else {
    console.log(error)
    return error
    // toast.error('An unknown error occurred')
  }
}