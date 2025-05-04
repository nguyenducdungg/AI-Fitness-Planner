import { z } from "zod"
import { router, protectedProcedure } from "@/lib/trpc/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { TRPCError } from "@trpc/server"

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

export const workoutRouter = router({
  getActiveWorkoutPlan: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const workoutPlan = await ctx.prisma.workoutPlan.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return workoutPlan
  }),

  getWorkoutHistory: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const limit = input.limit || 5

      const workoutPlans = await ctx.prisma.workoutPlan.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      })

      return workoutPlans
    }),

  generateWorkoutPlan: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id

    // Get user profile and fitness goals
    const userProfile = await ctx.prisma.userProfile.findUnique({
      where: { userId },
    })

    const fitnessGoals = await ctx.prisma.fitnessGoal.findUnique({
      where: { userId },
    })

    if (!userProfile || !fitnessGoals) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Please complete your profile and fitness goals first",
      })
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0
    if (userProfile.gender === "male") {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161
    }

    try {
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
          - BMR (calculated): ${Math.round(bmr)} calories
          - Medical Conditions: ${userProfile.medicalConditions || "None"}
          
          Fitness Goals:
          - Primary Goal: ${fitnessGoals.primaryGoal}
          - Experience Level: ${fitnessGoals.experienceLevel}
          - Target Weight: ${fitnessGoals.targetWeight} kg
          - Timeframe: ${fitnessGoals.timeframe}
          - Workout Days Per Week: ${fitnessGoals.workoutDaysPerWeek}
          - Workout Duration: ${fitnessGoals.workoutDuration} minutes
          - Additional Goals: ${fitnessGoals.additionalGoals || "None"}
          
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

      // Deactivate all existing plans
      await ctx.prisma.workoutPlan.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      })

      // Save the workout plan to the database
      const savedPlan = await ctx.prisma.workoutPlan.create({
        data: {
          userId,
          planData: workoutPlan,
          isActive: true,
        },
      })

      // Create a notification for the new workout plan
      await ctx.prisma.notification.create({
        data: {
          userId,
          title: "New Workout Plan",
          message: "Your new AI-generated workout plan is ready!",
          notificationType: "workout",
          isRead: false,
          scheduledFor: new Date(),
        },
      })

      return savedPlan
    } catch (error) {
      console.error("Error generating workout plan:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate workout plan",
      })
    }
  }),

  logWorkout: protectedProcedure
    .input(
      z.object({
        workoutPlanId: z.string(),
        workoutDay: z.string(),
        completed: z.boolean(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const workoutLog = await ctx.prisma.workoutLog.create({
        data: {
          userId,
          workoutPlanId: input.workoutPlanId,
          workoutDay: input.workoutDay,
          completed: input.completed,
          completionDate: input.completed ? new Date() : null,
          notes: input.notes,
        },
      })

      return workoutLog
    }),

  getWorkoutLogs: protectedProcedure
    .input(
      z.object({
        workoutPlanId: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const limit = input.limit || 10

      const workoutLogs = await ctx.prisma.workoutLog.findMany({
        where: {
          userId,
          workoutPlanId: input.workoutPlanId,
        },
        orderBy: { completionDate: "desc" },
        take: limit,
      })

      return workoutLogs
    }),
})
