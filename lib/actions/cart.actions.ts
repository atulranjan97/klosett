'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '../prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@/prisma/generated/prisma/client';

// <-------------------------------------------------------------------------------------------------------------------->
// Calculate cart prices
const calcPrices = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 400 ? 0 : 50),
    taxPrice = round2(0.18 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

// <-------------------------------------------------------------------------------------------------------------------->
export async function addItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');
    // Get the sessionCartId from the cookie

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    // This is just some TS stuff we need to add because we need to make sure that if `session?.user?.id` isn't here then `userId` will get assigned to undefined without throwing any errors
    // Get the user if there is one, if the user is not logged in then userId will be undefined (which is okay because we can use the cart as the guest)

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error('Product not found');

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrices([item]),
      });

      // console.log(newCart);

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      // so when you add to the database, a lot of times you want to revalidate a specific page because you wanna basically clear that cache, and for us its gonna be the product page

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        // Check the stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock');
        }

        // Increase the quantity
        existItem.qty += 1;
      } else {
        // If item doen't exist in cart
        // Check stock
        if (product.stock < 1) throw new Error('Not enough stock');

        // Add the item to cart.items
        cart.items.push(item);
      }

      // Save to the database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrices(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
      };
    }

    // TESTING
    // console.log({
    //   'Session Cart Id': sessionCartId,
    //   'User Id': userId,
    //   'Item Requested': item,
    //   'Product Found': product,
    // });
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// <-------------------------------------------------------------------------------------------------------------------->
export async function removeItemFromCart(productId: string) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    // Get users cart
    const cart = await getMyCart();

    if (!cart) throw new Error('Cart not found');

    // Check for item in the cart
    const existItem = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );

    if (!existItem) throw new Error('Item not found');

    // Decrease qty or remove if last one
    // Check if only one in qty
    if (existItem.qty === 1) {
      // Remove from the cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== productId,
      );
    } else {
      // Decrease the quantity
      existItem.qty -= 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrices(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// <-------------------------------------------------------------------------------------------------------------------->
export async function getMyCart() {
  // Check for the cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  // console.log(cart);

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
