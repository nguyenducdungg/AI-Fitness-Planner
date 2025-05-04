"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/trpc/client"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Clock } from "lucide-react"

interface WorkoutTrackerProps {
  workoutPlanId: string
  workoutDay: string
  focus: string
  exercises: {
    name: string
    sets: number
    reps: string
    restTime: string
    notes?: string
  }[]
  duration: string
  intensity: string
  warmup?: string
  cooldown?: string
}

export function WorkoutTracker({
  workoutPlanId,
  workoutDay,
  focus,
  exercises,
  duration,
  intensity,
  warmup,
  cooldown,
}: WorkoutTrackerProps) {
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const logWorkout = api.workout.logWorkout.useMutation({
    onSuccess: () => {
      toast({
        title: "Workout Logged",
        description: "Your workout has been logged successfully.",
      })
      setNotes("")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log workout. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const handleLogWorkout = () => {
    setIsSubmitting(true)
    logWorkout.mutate({
      workoutPlanId,
      workoutDay,
      completed: true,
      notes,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {workoutDay}: {focus}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {duration} • {intensity} Intensity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {warmup && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Warmup</p>
            <p className="text-sm text-muted-foreground">{warmup}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Exercises</h3>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                <Checkbox id={`exercise-${index}`} />
                <div className="grid gap-1">
                  <label
                    htmlFor={`exercise-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {exercise.name}
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps} • Rest: {exercise.restTime}
                  </div>
                  {exercise.notes && <div className="text-xs text-muted-foreground">Note: {exercise.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {cooldown && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Cooldown</p>
            <p className="text-sm text-muted-foreground">{cooldown}</p>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <label htmlFor="workout-notes" className="text-sm font-medium">
            Workout Notes
          </label>
          <Textarea
            id="workout-notes"
            placeholder="How did the workout feel? Any achievements or challenges?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t flex justify-end">
        <Button onClick={handleLogWorkout} disabled={isSubmitting}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Workout
        </Button>
      </div>
    </Card>
  )
}
