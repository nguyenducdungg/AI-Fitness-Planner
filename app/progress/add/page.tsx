import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AddProgressRecord } from "@/components/progress/add-progress-record"

export const metadata: Metadata = {
  title: "Add Progress | AI Fitness Planner",
  description: "Record your fitness progress",
}

export default async function AddProgressPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Record Progress" text="Track your fitness journey by recording your measurements" />
      <div className="grid gap-8">
        <AddProgressRecord />
      </div>
    </DashboardShell>
  )
}
