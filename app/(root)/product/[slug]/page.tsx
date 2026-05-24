import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Images Column */}
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>
        {/* Details Column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                value={Number(product.price)}
                className="rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        {/* Action Column */}
        <div>
          <Card className='p-2'>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>
              <div className="mb-4 flex justify-between">
                <div>Status</div>
                {product.stock > 0 ? (
                  <Badge variant="outline">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out Of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className="flex-center">
                  <Button className="w-full">Add To Cart</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;

/*
  const ProductDetailsPage = async (props: {
    params: Promise<{slug: string}>
  }) => { ...}

  props ek object hai jisme params property hai, aur params ek promise hai jo eventually resolve hoke { slug: string } return karega.

  Promise<T>, yaha T generic hai
    Yaha T matlab: future me kya return hoga
    So:
      Promise<string>
      Promise<number>
      Promise<boolean>
      Promise<User>
    sab valid hai.
*/

// `notFound` Next.js App Router ka built-in function hai jo 404 page render karne ke liye use hota hai. Isko "next/navigation" se import kiya jata hai. Jab kisi page ka required data exist nahi karta — jaise database me requested product, user, ya blog post na mile — tab `notFound()` call kiya jata hai. Ye internally ek special Next.js error throw karta hai jise framework catch karke default 404 page ya custom not-found.tsx component render karta hai. Example: if (!product) notFound(); ka matlab hai agar product null ya undefined hai to normal UI render mat karo, directly “Page Not Found” dikhao. Ye mostly dynamic routes ([slug], [id]) me use hota hai.

// npx shadcn@latest add badge
// that's gonna be for the stock option
