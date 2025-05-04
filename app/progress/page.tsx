import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProgressTracking } from "@/components/progress/progress-tracking"

export const metadata: Metadata = {
  title: "Progress | AI Fitness Planner",
  description: "Track your fitness progress",
}

export default async function ProgressPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Progress Tracking"
        text="Monitor your fitness journey and see your improvements over time."
      />
      <div className="grid gap-8">
        <ProgressTracking />
      </div>
    </DashboardShell>
  )
}
