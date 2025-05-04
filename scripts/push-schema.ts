import { execSync } from "child_process"

async function main() {
  try {
    console.log("Pushing Prisma schema to database...")
    execSync("npx prisma db push", { stdio: "inherit" })
    console.log("Schema pushed successfully!")
  } catch (error) {
    console.error("Error pushing schema:", error)
    process.exit(1)
  }
}

main()
