import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UserProfileForm } from "@/components/profile/user-profile-form"

export const metadata: Metadata = {
  title: "Profile | AI Fitness Planner",
  description: "Manage your fitness profile and goals",
}

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="User Profile" text="Manage your personal information and fitness goals." />
      <div className="grid gap-8">
        <UserProfileForm />
      </div>
    </DashboardShell>
  )
}
