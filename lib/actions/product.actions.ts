'use server';
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

// now we're gonna create a funtion that fetches our products or our latest products and what that returns initially is a Prisma object. And we're gonna have to convert that to just a plain JS object, so we'll be writing just a very simple utility function to wrap around the value to make(or convert) it to just a regular JS function

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    // take: 4,
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}
// `take`: specifies how many we want to fetch, now even though our `product-list.tsx` component, we made it so it has a limit and we set it to 4 anyway, so it's only going to show four even if we get/fetch more than that. But why take more than we're gonna show
// `orderBy`: fetch data in descending order of their createdAt field

// the returned data is a Prima object  
// to bring this in and use it, we wanna do that in our 'homepage', in app -> (root) -> page.tsx