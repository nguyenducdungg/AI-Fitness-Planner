import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-8">
        <div className="container">
          <div className={cn("grid gap-8", className)} {...props}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
