// @ts-nocheck
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
  // Required for Neon DB with pg on local environments
  ssl: {
    rejectUnauthorized: false
  }
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Tambahin log error biar ketahuan kalau client-nya gagal buat
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'] // Tambah ini buat debug
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma