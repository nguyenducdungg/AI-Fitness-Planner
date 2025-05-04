import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NutritionGenerator } from "@/components/nutrition/nutrition-generator"

export const metadata: Metadata = {
  title: "Generate Nutrition Plan | AI Fitness Planner",
  description: "Generate a personalized AI nutrition plan",
}

export default async function GenerateNutritionPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Generate Nutrition Plan"
        text="Create a personalized nutrition plan based on your profile and fitness goals"
      />
      <div className="grid gap-8">
        <NutritionGenerator />
      </div>
    </DashboardShell>
  )
}
