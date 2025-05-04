import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/db/user-profiles"
import { getFitnessGoals } from "@/lib/db/fitness-goals"
import { createWorkoutPlan } from "@/lib/db/workout-plans"

const WorkoutPlanSchema = z.object({
  workoutPlan: z.array(
    z.object({
      day: z.string(),
      focus: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.string(),
          restTime: z.string(),
          notes: z.string().optional(),
        }),
      ),
      duration: z.string(),
      intensity: z.string(),
      warmup: z.string().optional(),
      cooldown: z.string().optional(),
    }),
  ),
  recommendations: z.object({
    nutrition: z.string(),
    recovery: z.string(),
    progression: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Get user ID
    const { data: userData } = await supabase.from("users").select("id").eq("email", session.user.email).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user profile and fitness goals
    const userProfile = await getUserProfile(userData.id)
    const fitnessGoals = await getFitnessGoals(userData.id)

    if (!userProfile || !fitnessGoals) {
      return NextResponse.json({ error: "Please complete your profile and fitness goals first" }, { status: 400 })
    }

    // Generate workout plan using AI
    const { object } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Create a personalized workout plan based on the following user profile and fitness goals:
        
        User Profile:
        - Age: ${userProfile.age}
        - Gender: ${userProfile.gender}
        - Height: ${userProfile.height} cm
        - Weight: ${userProfile.weight} kg
        - Medical Conditions: ${userProfile.medical_conditions || "None"}
        
        Fitness Goals:
        - Primary Goal: ${fitnessGoals.primary_goal}
        - Experience Level: ${fitnessGoals.experience_level}
        - Target Weight: ${fitnessGoals.target_weight} kg
        - Timeframe: ${fitnessGoals.timeframe}
        - Workout Days Per Week: ${fitnessGoals.workout_days_per_week}
        - Workout Duration: ${fitnessGoals.workout_duration} minutes
        - Additional Goals: ${fitnessGoals.additional_goals || "None"}
        
        Create a detailed workout plan with specific exercises, sets, reps, and rest times. Include warmup and cooldown recommendations. Also provide nutrition, recovery, and progression recommendations.
        
        Return the response as a JSON object with the following structure:
        {
          "workoutPlan": [
            {
              "day": "Monday",
              "focus": "Upper Body",
              "exercises": [
                {
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": "8-10",
                  "restTime": "60 seconds",
                  "notes": "Optional notes"
                }
              ],
              "duration": "45 minutes",
              "intensity": "Moderate",
              "warmup": "5 minutes of cardio",
              "cooldown": "5 minutes of stretching"
            }
          ],
          "recommendations": {
            "nutrition": "Nutrition advice",
            "recovery": "Recovery advice",
            "progression": "Progression advice"
          }
        }
      `,
    })

    // Parse the response to ensure it matches our schema
    const workoutPlan = WorkoutPlanSchema.parse(JSON.parse(object))

    // Save the workout plan to the database
    await createWorkoutPlan({
      user_id: userData.id,
      plan_data: workoutPlan,
      is_active: true,
    })

    return NextResponse.json(workoutPlan)
  } catch (error) {
    console.error("Error generating workout plan:", error)
    return NextResponse.json({ error: "Failed to generate workout plan" }, { status: 500 })
  }
}
