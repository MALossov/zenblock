import { PrismaClient, Prisma } from '@prisma/client'

const prismaOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
}

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaOptions)
  }
}