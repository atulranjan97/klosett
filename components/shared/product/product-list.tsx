import ProductCard from './product-card';
import { Product } from '@/types';

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No product found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;

// this component is gonna take in a couple props so we wanna destructure and it's going to have the `data` and also a `title` that will just be put into an h2 at the top, and the title is optional, {data, title}
// for the types, we set data to be `any`, Now you shouldn't really use `any` in TS as it kind of defeats the purpose, later on we're gonna create a product type and this will be instead of `any`, it'll be product but that doesn't exist yet, so for now we're just putting `any`
// title?: string -> that ? symbol signifies optional
