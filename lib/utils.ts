import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// <T>: this is called the TS generic and this T, it's basically a placeholder for any type that the function might accept when it's called, so it could be a string, an object, a Prisma model, and this value T is just specifying the type of the argument that passed in and TS infers the type at the time of the function call
// :T : this is for the return of the function, the return type, it specifies that it should be the same type as the input
// so, if you called a function with a product object then TS knows that the return value will also be the type of product

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = error.issues.map(
      (issue: z.core.$ZodIssue) => issue.message,
    );
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    // if only email field is unique in User schema
    return 'Email already exists.';

    // if multiple field is unique in User schema
    // const fields = error.meta?.driverAdapterError?.cause?.constraint
    //   ?.fields as string[];
    // const field = fields?.[0] ?? 'Field';
    // return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}
// we're gonna use type of `any` and this is the one of the rare occasions where I like to use the disable comment for TS, this will work by using `any` but when we deploy to vercel, it'll actually throw an error. So what we can do is add a comment here says `//eslint-disabled-next-line`, so we're just saying in the next line we wanna disable a certain rule and the rule we wanna disable is gonna be `@typesscript-eslint/no-explicit-any` so that will just let us use the `any` type without throwing any problem
// you could try to get around this by bringing in certain types from Prisma and Zod, but we aren't because it was too much and too confusing, so this is one of those rare occasion where we just wanna add this comment
