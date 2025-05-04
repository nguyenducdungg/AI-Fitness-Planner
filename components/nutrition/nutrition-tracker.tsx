"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/trpc/client"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"

interface NutritionTrackerProps {
  nutritionPlanId: string
  dailyCalories: number
  macroDistribution: {
    protein: {
      percentage: number
      grams: number
    }
    carbs: {
      percentage: number
      grams: number
    }
    fat: {
      percentage: number
      grams: number
    }
  }
}

export function NutritionTracker({ nutritionPlanId, dailyCalories, macroDistribution }: NutritionTrackerProps) {
  const [caloriesConsumed, setCaloriesConsumed] = useState(dailyCalories)
  const [proteinConsumed, setProteinConsumed] = useState(macroDistribution.protein.grams)
  const [carbsConsumed, setCarbsConsumed] = useState(macroDistribution.carbs.grams)
  const [fatConsumed, setFatConsumed] = useState(macroDistribution.fat.grams)
  const [adherenceScore, setAdherenceScore] = useState(90)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const logNutrition = api.nutrition.logNutrition.useMutation({
    onSuccess: () => {
      toast({
        title: "Nutrition Logged",
        description: "Your nutrition has been logged successfully.",
      })
      setNotes("")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log nutrition. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const handleLogNutrition = () => {
    setIsSubmitting(true)
    logNutrition.mutate({
      nutritionPlanId,
      logDate: new Date(),
      adherenceScore,
      caloriesConsumed,
      proteinConsumed,
      carbsConsumed,
      fatConsumed,
      notes,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log Today's Nutrition</CardTitle>
        <CardDescription>Track your daily food intake and adherence to your nutrition plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Calories Consumed</label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={caloriesConsumed}
              onChange={(e) => setCaloriesConsumed(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">Target: {dailyCalories} kcal</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Macronutrients</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Protein</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={proteinConsumed}
                  onChange={(e) => setProteinConsumed(Number(e.target.value))}
                  className="w-16 h-7"
                />
                <span className="text-xs text-muted-foreground">/ {macroDistribution.protein.grams}g</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Carbs</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={carbsConsumed}
                  onChange={(e) => setCarbsConsumed(Number(e.target.value))}
                  className="w-16 h-7"
                />
                <span className="text-xs text-muted-foreground">/ {macroDistribution.carbs.grams}g</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Fat</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={fatConsumed}
                  onChange={(e) => setFatConsumed(Number(e.target.value))}
                  className="w-16 h-7"
                />
                <span className="text-xs text-muted-foreground">/ {macroDistribution.fat.grams}g</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Plan Adherence</label>
            <span className="text-sm">{adherenceScore}%</span>
          </div>
          <Slider
            value={[adherenceScore]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => setAdherenceScore(value[0])}
          />
          <p className="text-xs text-muted-foreground">How well did you follow your nutrition plan today?</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="nutrition-notes" className="text-sm font-medium">
            Notes
          </label>
          <Textarea
            id="nutrition-notes"
            placeholder="Any specific meals or challenges today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t flex justify-end">
        <Button onClick={handleLogNutrition} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Log Nutrition
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
