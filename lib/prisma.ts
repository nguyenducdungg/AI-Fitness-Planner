import { PrismaClient } from "@prisma/client"

// Check if we're in a production environment
const isProd = process.env.NODE_ENV === "production"

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Initialize Prisma Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isProd ? ["error"] : ["query", "error", "warn"],
    errorFormat: "pretty",
  })

// If not in production, attach prisma to the global object
if (!isProd) globalForPrisma.prisma = prisma

// Handle potential connection issues
prisma
  .$connect()
  .then(() => {
    if (!isProd) console.log("🚀 Prisma connected successfully")
  })
  .catch((e) => {
    console.error("❌ Failed to connect to database", e)
  })

export default prisma
