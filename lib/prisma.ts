import { PrismaClient } from '@/prisma/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const adapter = new PrismaNeon({ connectionString })

  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            return product.price.toString()
          },
        },
        rating: {
          needs: { rating: true },
          compute(product) {
            return product.rating.toString()
          },
        },
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}