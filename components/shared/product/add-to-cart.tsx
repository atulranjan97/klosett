'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Cart, CartItem } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    // console.log(res);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    // Handle success add to cart
    toast.success(`${res.message}`, {
      action: {
        label: 'Go to cart',
        onClick: () => router.push('/cart'),
      },
    });
  };
  // In this handler, we wanna call the `addItemToCart` action and we wanna get the response

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${res.message}`);
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="">
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      className="w-full cursor-pointer"
      type="button"
      onClick={handleAddToCart}
    >
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
