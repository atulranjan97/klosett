import ProductList from '@/components/shared/product/product-list';
// import sampleData from '@/db/sample-data';
import { getLatestProducts } from '@/lib/actions/product.actions';

// export const metadata = {
//   title: 'Home',
// }

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  // since we're using `await`, we have to make this `Homepage` function asynchronous which we can do since we're using a server component.

  return (
    <>
      {/* <ProductList data={sampleData.products} title="Newest Arrivals" limit={4} /> */}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
};

export default HomePage;
