import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface NutritionOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NutritionOverview({ className, ...props }: NutritionOverviewProps) {
  const nutritionData = {
    calories: {
      consumed: 1850,
      target: 2200,
      percentage: 84,
    },
    macros: {
      protein: {
        consumed: 120,
        target: 150,
        percentage: 80,
      },
      carbs: {
        consumed: 200,
        target: 220,
        percentage: 91,
      },
      fat: {
        consumed: 55,
        target: 70,
        percentage: 79,
      },
    },
  }

  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nutrition Tracker</CardTitle>
          <CardDescription>Today's nutrition overview</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/nutrition">
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Calories</h4>
              <span className="text-sm text-muted-foreground">
                {nutritionData.calories.consumed} / {nutritionData.calories.target} kcal
              </span>
            </div>
            <Progress value={nutritionData.calories.percentage} className="h-2" />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Macronutrients</h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Protein</span>
                <span className="text-sm text-muted-foreground">
                  {nutritionData.macros.protein.consumed}g / {nutritionData.macros.protein.target}g
                </span>
              </div>
              <Progress value={nutritionData.macros.protein.percentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Carbohydrates</span>
                <span className="text-sm text-muted-foreground">
                  {nutritionData.macros.carbs.consumed}g / {nutritionData.macros.carbs.target}g
                </span>
              </div>
              <Progress value={nutritionData.macros.carbs.percentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fat</span>
                <span className="text-sm text-muted-foreground">
                  {nutritionData.macros.fat.consumed}g / {nutritionData.macros.fat.target}g
                </span>
              </div>
              <Progress value={nutritionData.macros.fat.percentage} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
