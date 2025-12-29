import { PrismaClient } from '@prisma/client'

const prismaOptions = {
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