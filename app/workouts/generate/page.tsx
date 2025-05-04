import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WorkoutGenerator } from "@/components/workouts/workout-generator"

export const metadata: Metadata = {
  title: "Generate Workout | AI Fitness Planner",
  description: "Generate a personalized AI workout plan",
}

export default async function GenerateWorkoutPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Generate Workout Plan"
        text="Create a personalized workout plan based on your profile and fitness goals"
      />
      <div className="grid gap-8">
        <WorkoutGenerator />
      </div>
    </DashboardShell>
  )
}
