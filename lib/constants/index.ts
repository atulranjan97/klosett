export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Klosett';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce store built with Next.js';

// this environment variable is compulsory to be in `.env` file because this one will access directly from here because when we deploy we're gonna want that to be whatever your domain name will be
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;