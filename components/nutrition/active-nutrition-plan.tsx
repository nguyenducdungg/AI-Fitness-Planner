"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Utensils, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Chart } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { api } from "@/lib/trpc/client"
import Link from "next/link"

export function ActiveNutritionPlan() {
  const [openMeal, setOpenMeal] = useState<string | null>("Breakfast")

  const { data: nutritionPlan, isLoading } = api.nutrition.getActiveNutritionPlan.useQuery()

  const toggleMeal = (meal: string) => {
    setOpenMeal(openMeal === meal ? null : meal)
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

  if (!nutritionPlan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Active Nutrition Plan</CardTitle>
          <CardDescription>You don't have an active nutrition plan yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <p className="text-muted-foreground text-center">
            Generate a personalized nutrition plan based on your profile and fitness goals.
          </p>
          <Button asChild>
            <Link href="/nutrition/generate">Generate Nutrition Plan</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const macroData = [
    {
      name: "Protein",
      value: nutritionPlan.macro_distribution.protein.percentage,
      color: "#10b981",
    },
    {
      name: "Carbs",
      value: nutritionPlan.macro_distribution.carbs.percentage,
      color: "#3b82f6",
    },
    {
      name: "Fat",
      value: nutritionPlan.macro_distribution.fat.percentage,
      color: "#f59e0b",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Nutrition Plan</CardTitle>
        <CardDescription>Your personalized nutrition plan based on your fitness goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">Daily Calorie Target</h3>
                <p className="text-muted-foreground">{nutritionPlan.daily_calories} calories</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Macro Distribution</h3>
                <p className="text-muted-foreground">
                  Protein: {nutritionPlan.macro_distribution.protein.percentage}% (
                  {nutritionPlan.macro_distribution.protein.grams}g) • Carbs:{" "}
                  {nutritionPlan.macro_distribution.carbs.percentage}% ({nutritionPlan.macro_distribution.carbs.grams}g)
                  • Fat: {nutritionPlan.macro_distribution.fat.percentage}% (
                  {nutritionPlan.macro_distribution.fat.grams}g)
                </p>
              </div>
            </div>

            {nutritionPlan.meal_plan.map((meal: any) => (
              <Collapsible
                key={meal.meal}
                open={openMeal === meal.meal}
                onOpenChange={() => toggleMeal(meal.meal)}
                className="border rounded-lg"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{meal.meal}</h3>
                    <Badge variant="outline">{meal.calories} calories</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {meal.time}
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {openMeal === meal.meal ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    {meal.options.map((option: any, index: number) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-primary" />
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{option.calories} calories</div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Ingredients:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                            {option.ingredients.map((ingredient: string, i: number) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span>Protein: {option.macros.protein}g</span>
                          <span>Carbs: {option.macros.carbs}g</span>
                          <span>Fat: {option.macros.fat}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TabsContent>

          <TabsContent value="macros" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Macro Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Calories</h4>
                      <span className="text-sm text-muted-foreground">{nutritionPlan.daily_calories} kcal</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Protein</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macro_distribution.protein.grams}g
                      </span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" style={{ color: "#10b981" }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Carbohydrates</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macro_distribution.carbs.grams}g
                      </span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" style={{ color: "#3b82f6" }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Fat</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macro_distribution.fat.grams}g
                      </span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" style={{ color: "#f59e0b" }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6 mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Hydration</h3>
              <p className="text-muted-foreground">{nutritionPlan.recommendations.hydration}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Supplements</h3>
              <p className="text-muted-foreground">{nutritionPlan.recommendations.supplements}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Meal Timing</h3>
              <p className="text-muted-foreground">{nutritionPlan.recommendations.timing}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
