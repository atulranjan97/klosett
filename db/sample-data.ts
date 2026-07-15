import { hashSync } from 'bcrypt-ts-edge';

const sampleData = {
  users: [
    {
      name: 'John',
      email: 'john.admin@example.com',
      password: hashSync('123456', 10),
      role: 'admin',
    },
    {
      name: 'Jane',
      email: 'jane.user@example.com',
      password: hashSync('123456', 10),
      role: 'user',
    },
    // Even though this is just demo/seed data, passwords should NEVER be stored as plain text.
    // We hash the password before saving it so that the actual password is never stored in the database.
    // We're using `bcrypt-ts-edge` instead of the regular `bcrypt` or `bcryptjs` because this project runs in a TypeScript + Edge/Serverless environment (such as Next.js Edge Runtime). This package provides the same bcrypt API while being compatible with Edge runtimes where the native bcrypt package cannot be used.
    //
    // `hashSync(password, saltRounds)` takes two arguments:
    //   1. The plain-text password.
    //   2. The number of salt rounds (cost factor).
    //
    // A salt is a randomly generated value that bcrypt automatically adds to the password before hashing.
    // This prevents identical passwords from producing identical hashes. For example, if two users choose
    // the password "123456", their stored password hashes will still be completely different because each
    // hash gets its own unique salt.
    //
    // The second argument (`10`) is the salt rounds (also called the cost factor). It determines how much
    // computational work bcrypt performs while generating the hash. A higher value increases security by
    // making brute-force attacks more expensive, but it also takes longer to hash passwords. A value of
    // 10 is a common and well-balanced default for most applications.
    //
    // Note: Although we're using `hashSync()` here for simplicity while seeding data, in production
    // request handlers it's generally recommended to use the asynchronous `hash()` function to avoid
    // blocking the event loop.
  ],
  products: [
    {
      name: 'Polo Sporting Stretch Shirt',
      slug: 'polo-sporting-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Classic Polo style with modern comfort',
      images: [
        '/images/sample-products/p1-1.jpg',
        '/images/sample-products/p1-2.jpg',
      ],
      // price: 59.99,
      price: 5699,
      brand: 'Polo',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'Brooks Brothers Long Sleeved Shirt',
      slug: 'brooks-brothers-long-sleeved-shirt',
      category: "Men's Dress Shirts",
      description: 'Timeless style and premium comfort',
      images: [
        '/images/sample-products/p2-1.jpg',
        '/images/sample-products/p2-2.jpg',
      ],
      // price: 85.9,
      price: 8099,
      brand: 'Brooks Brothers',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      name: 'Tommy Hilfiger Classic Fit Dress Shirt',
      slug: 'tommy-hilfiger-classic-fit-dress-shirt',
      category: "Men's Dress Shirts",
      description: 'A perfect blend of sophistication and comfort',
      images: [
        '/images/sample-products/p3-1.jpg',
        '/images/sample-products/p3-2.jpg',
      ],
      // price: 99.95,
      price: 9430,
      brand: 'Tommy Hilfiger',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Calvin Klein Slim Fit Stretch Shirt',
      slug: 'calvin-klein-slim-fit-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Streamlined design with flexible stretch fabric',
      images: [
        '/images/sample-products/p4-1.jpg',
        '/images/sample-products/p4-2.jpg',
      ],
      // price: 39.95,
      price: 3770,
      brand: 'Calvin Klein',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Polo Ralph Lauren Oxford Shirt',
      slug: 'polo-ralph-lauren-oxford-shirt',
      category: "Men's Dress Shirts",
      description: 'Iconic Polo design with refined oxford fabric',
      images: [
        '/images/sample-products/p5-1.jpg',
        '/images/sample-products/p5-2.jpg',
      ],
      // price: 79.99,
      price: 7499,
      brand: 'Polo',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Polo Classic Pink Hoodie',
      slug: 'polo-classic-pink-hoodie',
      category: "Men's Sweatshirts",
      description: 'Soft, stylish, and perfect for laid-back days',
      images: [
        '/images/sample-products/p6-1.jpg',
        '/images/sample-products/p6-2.jpg',
      ],
      // price: 99.99,
      price: 9440,
      brand: 'Polo',
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
