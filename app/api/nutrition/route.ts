import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const NutritionPlanSchema = z.object({
  dailyCalories: z.number(),
  macroDistribution: z.object({
    protein: z.object({
      percentage: z.number(),
      grams: z.number(),
    }),
    carbs: z.object({
      percentage: z.number(),
      grams: z.number(),
    }),
    fat: z.object({
      percentage: z.number(),
      grams: z.number(),
    }),
  }),
  mealPlan: z.array(
    z.object({
      meal: z.string(),
      time: z.string(),
      calories: z.number(),
      options: z.array(
        z.object({
          name: z.string(),
          ingredients: z.array(z.string()),
          macros: z.object({
            protein: z.number(),
            carbs: z.number(),
            fat: z.number(),
          }),
          calories: z.number(),
          recipe: z.string().optional(),
        }),
      ),
    }),
  ),
  recommendations: z.object({
    hydration: z.string(),
    supplements: z.string(),
    timing: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const { userProfile, fitnessGoals } = await req.json()

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0
    if (userProfile.gender === "male") {
      bmr =
        10 * Number.parseFloat(userProfile.weight) +
        6.25 * Number.parseFloat(userProfile.height) -
        5 * Number.parseFloat(userProfile.age) +
        5
    } else {
      bmr =
        10 * Number.parseFloat(userProfile.weight) +
        6.25 * Number.parseFloat(userProfile.height) -
        5 * Number.parseFloat(userProfile.age) -
        161
    }

    // Generate nutrition plan using AI
    const { object } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Create a personalized nutrition plan based on the following user profile and fitness goals:
        
        User Profile:
        - Age: ${userProfile.age}
        - Gender: ${userProfile.gender}
        - Height: ${userProfile.height} cm
        - Weight: ${userProfile.weight} kg
        - BMR (calculated): ${Math.round(bmr)} calories
        - Medical Conditions: ${userProfile.medicalConditions || "None"}
        
        Fitness Goals:
        - Primary Goal: ${fitnessGoals.primaryGoal}
        - Target Weight: ${fitnessGoals.targetWeight} kg
        - Timeframe: ${fitnessGoals.timeframe}
        - Workout Days Per Week: ${fitnessGoals.workoutDaysPerWeek}
        - Workout Duration: ${fitnessGoals.workoutDuration} minutes
        
        Create a detailed nutrition plan with daily calorie targets, macro distribution, and meal options. Include recommendations for hydration, supplements, and meal timing.
      `,
    })

    // Parse the response to ensure it matches our schema
    const nutritionPlan = NutritionPlanSchema.parse(JSON.parse(object))

    return NextResponse.json(nutritionPlan)
  } catch (error) {
    console.error("Error generating nutrition plan:", error)
    return NextResponse.json({ error: "Failed to generate nutrition plan" }, { status: 500 })
  }
}
