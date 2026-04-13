import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const bundledSqliteUrl = `file:${path.join(process.cwd(), 'db', 'custom.db').replace(/\\/g, '/')}`

function getDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL?.trim()

  if (!configuredUrl || configuredUrl === 'file:/home/z/my-project/db/custom.db') {
    return bundledSqliteUrl
  }

  return configuredUrl
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
