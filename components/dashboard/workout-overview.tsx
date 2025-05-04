import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, ChevronRight } from "lucide-react"
import Link from "next/link"

interface WorkoutOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WorkoutOverview({ className, ...props }: WorkoutOverviewProps) {
  const workouts = [
    {
      name: "Upper Body Strength",
      description: "Chest, shoulders, and triceps",
      duration: "45 min",
      scheduled: "Today, 6:00 PM",
      completed: false,
    },
    {
      name: "Lower Body Power",
      description: "Quads, hamstrings, and calves",
      duration: "50 min",
      scheduled: "Tomorrow, 7:00 AM",
      completed: false,
    },
    {
      name: "Core Stability",
      description: "Abs and lower back",
      duration: "30 min",
      scheduled: "Yesterday, 6:30 PM",
      completed: true,
    },
  ]

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Workout Plan</CardTitle>
          <CardDescription>Your upcoming and recent workouts</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/workouts">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded-lg border p-4 ${
                workout.completed ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{workout.name}</h4>
                  <p className="text-sm text-muted-foreground">{workout.description}</p>
                  <div className="mt-1 flex items-center text-sm text-muted-foreground">
                    <span>{workout.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{workout.scheduled}</span>
                  </div>
                </div>
              </div>
              <Button variant={workout.completed ? "outline" : "default"} size="sm">
                {workout.completed ? "Completed" : "Start"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
