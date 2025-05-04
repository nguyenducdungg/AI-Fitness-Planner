"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Flame, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data - would be fetched from API in a real app
const workoutPlan = {
  workoutPlan: [
    {
      day: "Monday",
      focus: "Upper Body Strength",
      exercises: [
        {
          name: "Bench Press",
          sets: 4,
          reps: "8-10",
          restTime: "90 seconds",
          notes: "Focus on controlled movement",
        },
        {
          name: "Bent Over Rows",
          sets: 4,
          reps: "10-12",
          restTime: "60 seconds",
        },
        {
          name: "Overhead Press",
          sets: 3,
          reps: "8-10",
          restTime: "90 seconds",
        },
        {
          name: "Lat Pulldowns",
          sets: 3,
          reps: "10-12",
          restTime: "60 seconds",
        },
        {
          name: "Bicep Curls",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
        {
          name: "Tricep Pushdowns",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
      ],
      duration: "45-60 minutes",
      intensity: "Moderate to High",
      warmup: "5 minutes of light cardio, dynamic stretching for upper body",
      cooldown: "Static stretching for chest, back, shoulders, and arms",
    },
    {
      day: "Tuesday",
      focus: "Lower Body Power",
      exercises: [
        {
          name: "Squats",
          sets: 4,
          reps: "8-10",
          restTime: "120 seconds",
          notes: "Focus on depth and form",
        },
        {
          name: "Romanian Deadlifts",
          sets: 4,
          reps: "8-10",
          restTime: "120 seconds",
        },
        {
          name: "Leg Press",
          sets: 3,
          reps: "10-12",
          restTime: "90 seconds",
        },
        {
          name: "Walking Lunges",
          sets: 3,
          reps: "12 per leg",
          restTime: "60 seconds",
        },
        {
          name: "Leg Extensions",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
        {
          name: "Leg Curls",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
      ],
      duration: "45-60 minutes",
      intensity: "High",
      warmup: "5 minutes of light cardio, dynamic stretching for lower body",
      cooldown: "Static stretching for quads, hamstrings, glutes, and calves",
    },
    {
      day: "Wednesday",
      focus: "Active Recovery",
      exercises: [
        {
          name: "Light Cardio (Walking or Cycling)",
          sets: 1,
          reps: "20-30 minutes",
          restTime: "As needed",
        },
        {
          name: "Foam Rolling",
          sets: 1,
          reps: "5 minutes per major muscle group",
          restTime: "None",
        },
        {
          name: "Yoga or Mobility Work",
          sets: 1,
          reps: "15-20 minutes",
          restTime: "None",
        },
      ],
      duration: "30-45 minutes",
      intensity: "Low",
      warmup: "Light movement to increase blood flow",
      cooldown: "Deep breathing and relaxation",
    },
    {
      day: "Thursday",
      focus: "Push Day (Chest, Shoulders, Triceps)",
      exercises: [
        {
          name: "Incline Bench Press",
          sets: 4,
          reps: "8-10",
          restTime: "90 seconds",
        },
        {
          name: "Dumbbell Shoulder Press",
          sets: 4,
          reps: "8-10",
          restTime: "90 seconds",
        },
        {
          name: "Chest Flyes",
          sets: 3,
          reps: "10-12",
          restTime: "60 seconds",
        },
        {
          name: "Lateral Raises",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
        {
          name: "Tricep Dips",
          sets: 3,
          reps: "10-12",
          restTime: "60 seconds",
        },
        {
          name: "Overhead Tricep Extensions",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
      ],
      duration: "45-60 minutes",
      intensity: "Moderate to High",
      warmup: "5 minutes of light cardio, dynamic stretching for upper body",
      cooldown: "Static stretching for chest, shoulders, and triceps",
    },
    {
      day: "Friday",
      focus: "Pull Day (Back and Biceps)",
      exercises: [
        {
          name: "Deadlifts",
          sets: 4,
          reps: "6-8",
          restTime: "120 seconds",
          notes: "Focus on form and brace core",
        },
        {
          name: "Pull-Ups or Assisted Pull-Ups",
          sets: 4,
          reps: "8-10",
          restTime: "90 seconds",
        },
        {
          name: "Seated Rows",
          sets: 3,
          reps: "10-12",
          restTime: "60 seconds",
        },
        {
          name: "Face Pulls",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
        {
          name: "Hammer Curls",
          sets: 3,
          reps: "10-12",
          restTime: "45 seconds",
        },
        {
          name: "Preacher Curls",
          sets: 3,
          reps: "10-12",
          restTime: "45 seconds",
        },
      ],
      duration: "45-60 minutes",
      intensity: "Moderate to High",
      warmup: "5 minutes of light cardio, dynamic stretching for back and arms",
      cooldown: "Static stretching for back, biceps, and forearms",
    },
    {
      day: "Saturday",
      focus: "Legs and Core",
      exercises: [
        {
          name: "Front Squats",
          sets: 4,
          reps: "8-10",
          restTime: "90 seconds",
        },
        {
          name: "Bulgarian Split Squats",
          sets: 3,
          reps: "10 per leg",
          restTime: "60 seconds",
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          restTime: "45 seconds",
        },
        {
          name: "Calf Raises",
          sets: 4,
          reps: "15-20",
          restTime: "30 seconds",
        },
        {
          name: "Planks",
          sets: 3,
          reps: "30-60 seconds",
          restTime: "45 seconds",
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: "20 total",
          restTime: "45 seconds",
        },
      ],
      duration: "45-60 minutes",
      intensity: "Moderate to High",
      warmup: "5 minutes of light cardio, dynamic stretching for lower body",
      cooldown: "Static stretching for legs and core",
    },
    {
      day: "Sunday",
      focus: "Rest Day",
      exercises: [
        {
          name: "Light Walking",
          sets: 1,
          reps: "20-30 minutes (optional)",
          restTime: "None",
        },
        {
          name: "Stretching",
          sets: 1,
          reps: "10-15 minutes (optional)",
          restTime: "None",
        },
      ],
      duration: "Rest",
      intensity: "Very Low",
      warmup: "None required",
      cooldown: "None required",
    },
  ],
  recommendations: {
    nutrition:
      "Focus on a high protein diet with moderate carbs and healthy fats. Aim for 1.8-2g of protein per kg of bodyweight. Ensure adequate carbohydrate intake before and after workouts. Stay hydrated throughout the day.",
    recovery:
      "Ensure 7-8 hours of quality sleep each night. Consider foam rolling and stretching on rest days. Epsom salt baths can help with muscle soreness. Listen to your body and take extra rest if needed.",
    progression:
      "Aim to increase weight or reps every 1-2 weeks. After 4-6 weeks, reassess the program and make adjustments. Consider deloading every 6-8 weeks to prevent overtraining and allow for recovery.",
  },
}

export function WorkoutPlanView() {
  const [openDay, setOpenDay] = useState<string | null>("Monday")

  const toggleDay = (day: string) => {
    setOpenDay(openDay === day ? null : day)
  }

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
            {workoutPlan.workoutPlan.map((day) => (
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
                      {day.exercises.map((exercise, index) => (
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
              <p className="text-muted-foreground">{workoutPlan.recommendations.nutrition}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Recovery</h3>
              <p className="text-muted-foreground">{workoutPlan.recommendations.recovery}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Progression</h3>
              <p className="text-muted-foreground">{workoutPlan.recommendations.progression}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
