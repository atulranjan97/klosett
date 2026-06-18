'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { CartItem } from '@/types';
import { addItemToCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ item }: { item: CartItem }) => {
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

  return (
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
