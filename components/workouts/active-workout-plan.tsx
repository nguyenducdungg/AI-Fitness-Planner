"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Flame, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { api } from "@/lib/trpc/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function ActiveWorkoutPlan() {
  const [openDay, setOpenDay] = useState<string | null>("Monday")
  const router = useRouter()

  const { data: workoutPlan, isLoading } = api.workout.getActiveWorkoutPlan.useQuery()

  const toggleDay = (day: string) => {
    setOpenDay(openDay === day ? null : day)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!workoutPlan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Active Workout Plan</CardTitle>
          <CardDescription>You don't have an active workout plan yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <p className="text-muted-foreground text-center">
            Generate a personalized workout plan based on your profile and fitness goals.
          </p>
          <Button asChild>
            <Link href="/workouts/generate">Generate Workout Plan</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const plan = workoutPlan.plan_data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Workout Plan</CardTitle>
        <CardDescription>Your personalized workout plan based on your fitness goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plan">Workout Plan</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="space-y-4 mt-4">
            {plan.workoutPlan.map((day: any) => (
              <Collapsible
                key={day.day}
                open={openDay === day.day}
                onOpenChange={() => toggleDay(day.day)}
                className="border rounded-lg"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{day.day}</h3>
                    <Badge
                      variant={
                        day.intensity === "Low" ? "outline" : day.intensity === "High" ? "destructive" : "default"
                      }
                    >
                      {day.focus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {day.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Flame className="mr-1 h-4 w-4" />
                      {day.intensity}
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {openDay === day.day ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    {day.warmup && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Warmup</p>
                        <p className="text-sm text-muted-foreground">{day.warmup}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {day.exercises.map((exercise: any, index: number) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="h-4 w-4 text-primary" />
                              <span className="font-medium">{exercise.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps}
                            </div>
                          </div>
                          {(exercise.restTime || exercise.notes) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              {exercise.restTime && <span>Rest: {exercise.restTime}</span>}
                              {exercise.restTime && exercise.notes && <span> • </span>}
                              {exercise.notes && <span>Note: {exercise.notes}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {day.cooldown && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Cooldown</p>
                        <p className="text-sm text-muted-foreground">{day.cooldown}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TabsContent>
          <TabsContent value="recommendations" className="space-y-6 mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Nutrition</h3>
              <p className="text-muted-foreground">{plan.recommendations.nutrition}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Recovery</h3>
              <p className="text-muted-foreground">{plan.recommendations.recovery}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Progression</h3>
              <p className="text-muted-foreground">{plan.recommendations.progression}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
