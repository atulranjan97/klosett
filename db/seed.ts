import { prisma } from '@/lib/prisma';
import sampleData from './sample-data';

// it's asynchronous because prisma methods that we're going to use to get the products are asynchronous. We gonna call this function `main`
async function main() {
  // delete the existing product in the product table
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  // order(sequence) will be the exact same

  // create the product
  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log('Database seeded successfully!');
}

main();

// to seed data (from `sample-data.ts) to your tables(db), run this file using command `npx tsx ./db/seed`

// import 'dotenv/config';
// Next.js loads .env automatically when running the app, but plain Node/tsx scripts do not — so seed scripts usually need dotenv manually.

// Now anytime you can just wipe the database and have two users, so you can login as those users when we add that functionality and ofcourse we have our products