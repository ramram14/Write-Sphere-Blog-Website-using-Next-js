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