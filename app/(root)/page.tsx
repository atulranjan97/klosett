import ProductList from '@/components/shared/product/product-list';
// import sampleData from '@/db/sample-data';
import { getLatestProducts } from '@/lib/actions/product.actions';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
// }

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  // since we're using `await`, we have to make this `Homepage` function asynchronous which we can do since we're using a server component.

  return (
    <>
      {/* REMOVE IT ONCE WEBSITE IS COMPLETED */}
      <div className="text-center text-destructive">
        🚧 The website is currently under development. Some features may be
        incomplete or subject to change. Thank you for visiting!
      </div>

      {/* <ProductList data={sampleData.products} title="Newest Arrivals" limit={4} /> */}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
};

export default HomePage;
