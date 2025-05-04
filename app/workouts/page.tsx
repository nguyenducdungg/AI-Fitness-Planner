import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ActiveWorkoutPlan } from "@/components/workouts/active-workout-plan"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Workouts | AI Fitness Planner",
  description: "View and manage your workout plans",
}

export default async function WorkoutsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Workout Plans">
        <Button asChild>
          <Link href="/workouts/generate">
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New Plan
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-8">
        <ActiveWorkoutPlan />
      </div>
    </DashboardShell>
  )
}
