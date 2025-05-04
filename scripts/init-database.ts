import { execSync } from "child_process"

async function main() {
  try {
    console.log("🚀 Initializing database...")

    // Step 1: Set up the database schema
    console.log("\n📊 Setting up database schema...")
    execSync("npm run setup-db", { stdio: "inherit" })

    // Step 2: Seed the database with initial data
    console.log("\n🌱 Seeding database with initial data...")
    execSync("npm run seed-db", { stdio: "inherit" })

    console.log("\n✅ Database initialization completed successfully!")
  } catch (error) {
    console.error("\n❌ Error initializing database:", error)
    process.exit(1)
  }
}

main()
