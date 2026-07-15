import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  // redirect to the cart page if either cart doesn't exist or there is nothing in the cart
  if (!cart || cart.items.length === 0) redirect('/cart');

  // get the session
  const session = await auth();

  // get the userId from the session
  const userId = session?.user?.id;

  if (!userId) throw new Error('No User ID');

  // get the user from the database
  const user = await getUserById(userId);
  // now we can get the user's address (which was not there in the session.user)
  // now this will give us the user's address and so on, which right away when you sign up, you don't add an address so it'll be null but once we add shipping address form and we will fill that out, then that will get added to the user table

  return (
    <>
      {/* shipping address is the second page in the steps and it's a 0 based so thats make it 1 */}
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;

{
  /* 
  Prisma 'address' field DB me Json type hai, isliye TS isko generic 
  JsonValue | null maanta hai — exact shape (fullName, city, etc.) ka 
  pata nahi hota. Cast kar rahe hain kyunki yahan guarantee hai ki 
  address hamesha set hota hai aur ShippingAddress shape me hi hota hai.
  NOTE: Ye sirf compile-time trust hai, runtime validation nahi karta — 
  agar kabhi data corrupt mile to crash ho sakta hai. Behtar option: 
  shippingAddressSchema.parse(user.address) use karo runtime safety ke liye.

  <ShippingAddressForm address={user.address as ShippingAddress} />
*/
}
