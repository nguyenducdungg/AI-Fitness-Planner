"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Utensils, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Chart } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Mock data - would be fetched from API in a real app
const nutritionPlan = {
  dailyCalories: 2200,
  macroDistribution: {
    protein: {
      percentage: 30,
      grams: 165,
    },
    carbs: {
      percentage: 40,
      grams: 220,
    },
    fat: {
      percentage: 30,
      grams: 73,
    },
  },
  mealPlan: [
    {
      meal: "Breakfast",
      time: "7:00 - 8:00 AM",
      calories: 550,
      options: [
        {
          name: "Protein Oatmeal",
          ingredients: [
            "1 cup rolled oats",
            "1 scoop protein powder",
            "1 tbsp almond butter",
            "1/2 banana",
            "1 tsp honey",
            "Cinnamon to taste",
          ],
          macros: {
            protein: 30,
            carbs: 60,
            fat: 12,
          },
          calories: 550,
        },
        {
          name: "Greek Yogurt Parfait",
          ingredients: [
            "1 cup Greek yogurt",
            "1/4 cup granola",
            "1 tbsp honey",
            "1/2 cup mixed berries",
            "1 tbsp chia seeds",
          ],
          macros: {
            protein: 28,
            carbs: 55,
            fat: 14,
          },
          calories: 550,
        },
      ],
    },
    {
      meal: "Mid-Morning Snack",
      time: "10:00 - 11:00 AM",
      calories: 250,
      options: [
        {
          name: "Protein Shake with Fruit",
          ingredients: ["1 scoop protein powder", "1 cup almond milk", "1 small apple"],
          macros: {
            protein: 25,
            carbs: 30,
            fat: 3,
          },
          calories: 250,
        },
        {
          name: "Cottage Cheese with Fruit",
          ingredients: ["1/2 cup cottage cheese", "1/2 cup pineapple chunks", "10 almonds"],
          macros: {
            protein: 20,
            carbs: 25,
            fat: 8,
          },
          calories: 250,
        },
      ],
    },
    {
      meal: "Lunch",
      time: "1:00 - 2:00 PM",
      calories: 650,
      options: [
        {
          name: "Chicken and Quinoa Bowl",
          ingredients: [
            "5 oz grilled chicken breast",
            "3/4 cup cooked quinoa",
            "1 cup mixed vegetables",
            "1 tbsp olive oil",
            "Herbs and spices to taste",
          ],
          macros: {
            protein: 45,
            carbs: 50,
            fat: 18,
          },
          calories: 650,
        },
        {
          name: "Tuna Salad Wrap",
          ingredients: [
            "1 whole grain wrap",
            "5 oz canned tuna in water",
            "1 tbsp light mayo",
            "1 cup mixed greens",
            "1/4 avocado",
            "1 small apple on the side",
          ],
          macros: {
            protein: 40,
            carbs: 55,
            fat: 20,
          },
          calories: 650,
        },
      ],
    },
    {
      meal: "Afternoon Snack",
      time: "4:00 - 5:00 PM",
      calories: 200,
      options: [
        {
          name: "Greek Yogurt with Berries",
          ingredients: ["3/4 cup Greek yogurt", "1/2 cup mixed berries", "1 tsp honey"],
          macros: {
            protein: 18,
            carbs: 20,
            fat: 2,
          },
          calories: 200,
        },
        {
          name: "Protein Bar",
          ingredients: ["1 protein bar (choose one with at least 15g protein and under 200 calories)"],
          macros: {
            protein: 15,
            carbs: 20,
            fat: 7,
          },
          calories: 200,
        },
      ],
    },
    {
      meal: "Dinner",
      time: "7:00 - 8:00 PM",
      calories: 550,
      options: [
        {
          name: "Salmon with Sweet Potato and Vegetables",
          ingredients: [
            "5 oz baked salmon",
            "1 medium sweet potato",
            "1 cup steamed broccoli",
            "1 tsp olive oil",
            "Lemon and herbs to taste",
          ],
          macros: {
            protein: 35,
            carbs: 45,
            fat: 20,
          },
          calories: 550,
        },
        {
          name: "Turkey Chili",
          ingredients: [
            "5 oz ground turkey",
            "1/2 cup black beans",
            "1/2 cup kidney beans",
            "1/2 cup diced tomatoes",
            "1/4 cup onions",
            "Spices to taste",
          ],
          macros: {
            protein: 40,
            carbs: 40,
            fat: 15,
          },
          calories: 550,
        },
      ],
    },
  ],
  recommendations: {
    hydration: "Drink at least 3 liters of water daily. Consider adding electrolytes on heavy workout days.",
    supplements:
      "Consider a whey protein supplement to help meet protein goals. A multivitamin may be beneficial. Consult with a healthcare provider before starting any supplement regimen.",
    timing:
      "Try to eat within 1 hour of waking up. Have a meal or snack containing protein and carbs within 30-60 minutes after workouts. Avoid large meals within 2 hours of bedtime.",
  },
}

export function NutritionPlanView() {
  const [openMeal, setOpenMeal] = useState<string | null>("Breakfast")

  const toggleMeal = (meal: string) => {
    setOpenMeal(openMeal === meal ? null : meal)
  }

  const macroData = [
    { name: "Protein", value: nutritionPlan.macroDistribution.protein.percentage, color: "#10b981" },
    { name: "Carbs", value: nutritionPlan.macroDistribution.carbs.percentage, color: "#3b82f6" },
    { name: "Fat", value: nutritionPlan.macroDistribution.fat.percentage, color: "#f59e0b" },
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
                <p className="text-muted-foreground">{nutritionPlan.dailyCalories} calories</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Macro Distribution</h3>
                <p className="text-muted-foreground">
                  Protein: {nutritionPlan.macroDistribution.protein.percentage}% (
                  {nutritionPlan.macroDistribution.protein.grams}g) • Carbs:{" "}
                  {nutritionPlan.macroDistribution.carbs.percentage}% ({nutritionPlan.macroDistribution.carbs.grams}g) •
                  Fat: {nutritionPlan.macroDistribution.fat.percentage}% ({nutritionPlan.macroDistribution.fat.grams}g)
                </p>
              </div>
            </div>

            {nutritionPlan.mealPlan.map((meal) => (
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
                    {meal.options.map((option, index) => (
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
                            {option.ingredients.map((ingredient, i) => (
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
                      <span className="text-sm text-muted-foreground">{nutritionPlan.dailyCalories} kcal</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Protein</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macroDistribution.protein.grams}g
                      </span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" style={{ color: "#10b981" }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Carbohydrates</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macroDistribution.carbs.grams}g
                      </span>
                    </div>
                    <Progress value={100} className="h-2 bg-muted" style={{ color: "#3b82f6" }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Fat</h4>
                      <span className="text-sm text-muted-foreground">
                        {nutritionPlan.macroDistribution.fat.grams}g
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
