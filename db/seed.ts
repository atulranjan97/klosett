import { prisma } from '../lib/prisma';
import sampleData from './sample-data';

// it's asynchronous because prisma methods that we're going to use to get the products are asynchronous. We gonna call this function `main`
async function main() {
  // const prisma = new PrismaClient();

  // delete the existing product in the product table
  await prisma.product.deleteMany();

  // create the product
  await prisma.product.createMany({ data: sampleData.products });

  console.log('Database seeded successfully!');
}

main();

// to run this file, we use command `npx tsx ./db/seed`
