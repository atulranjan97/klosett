import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
