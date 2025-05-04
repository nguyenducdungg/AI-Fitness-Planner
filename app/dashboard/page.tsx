import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { WorkoutOverview } from "@/components/dashboard/workout-overview"
import { NutritionOverview } from "@/components/dashboard/nutrition-overview"

export const metadata: Metadata = {
  title: "Dashboard | AI Fitness Planner",
  description: "Manage your fitness journey",
}

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here's an overview of your fitness journey." />
      <div className="grid gap-4 md:gap-8">
        <DashboardCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <WorkoutOverview className="col-span-4" />
          <NutritionOverview className="col-span-3" />
        </div>
      </div>
    </DashboardShell>
  )
}
