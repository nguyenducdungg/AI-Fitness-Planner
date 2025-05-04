import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Setting up database...")

    // Step 1: Push the schema to the database
    console.log("📊 Pushing Prisma schema to database...")
    execSync("pnpm exec prisma db push", { stdio: "inherit" })
    console.log("✅ Schema pushed successfully!")

    // Step 2: Verify connection and tables
    console.log("🔍 Verifying database connection and tables...")
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log(`✅ Database connection successful. Found ${JSON.stringify(tableCount)} tables.`)

    console.log("✨ Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
