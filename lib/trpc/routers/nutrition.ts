import { z } from "zod"
import { router, protectedProcedure } from "@/lib/trpc/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { TRPCError } from "@trpc/server"

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

export const nutritionRouter = router({
  getActiveNutritionPlan: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const nutritionPlan = await ctx.prisma.nutritionPlan.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return nutritionPlan
  }),

  getNutritionHistory: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const limit = input.limit || 5

      const nutritionPlans = await ctx.prisma.nutritionPlan.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      })

      return nutritionPlans
    }),

  generateNutritionPlan: protectedProcedure.mutation(async ({ ctx }) => {
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
          
          Return the response as a JSON object with the following structure:
          {
            "dailyCalories": 2200,
            "macroDistribution": {
              "protein": {
                "percentage": 30,
                "grams": 165
              },
              "carbs": {
                "percentage": 40,
                "grams": 220
              },
              "fat": {
                "percentage": 30,
                "grams": 73
              }
            },
            "mealPlan": [
              {
                "meal": "Breakfast",
                "time": "7:00 - 8:00 AM",
                "calories": 550,
                "options": [
                  {
                    "name": "Meal Name",
                    "ingredients": ["ingredient 1", "ingredient 2"],
                    "macros": {
                      "protein": 30,
                      "carbs": 60,
                      "fat": 12
                    },
                    "calories": 550,
                    "recipe": "Optional cooking instructions"
                  }
                ]
              }
            ],
            "recommendations": {
              "hydration": "Hydration advice",
              "supplements": "Supplement advice",
              "timing": "Meal timing advice"
            }
          }
        `,
      })

      // Parse the response to ensure it matches our schema
      const nutritionPlan = NutritionPlanSchema.parse(JSON.parse(object))

      // Deactivate all existing plans
      await ctx.prisma.nutritionPlan.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      })

      // Save the nutrition plan to the database
      const savedPlan = await ctx.prisma.nutritionPlan.create({
        data: {
          userId,
          dailyCalories: nutritionPlan.dailyCalories,
          macroDistribution: nutritionPlan.macroDistribution,
          mealPlan: nutritionPlan.mealPlan,
          recommendations: nutritionPlan.recommendations,
          isActive: true,
        },
      })

      // Create a notification for the new nutrition plan
      await ctx.prisma.notification.create({
        data: {
          userId,
          title: "New Nutrition Plan",
          message: "Your new AI-generated nutrition plan is ready!",
          notificationType: "nutrition",
          isRead: false,
          scheduledFor: new Date(),
        },
      })

      return savedPlan
    } catch (error) {
      console.error("Error generating nutrition plan:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate nutrition plan",
      })
    }
  }),

  logNutrition: protectedProcedure
    .input(
      z.object({
        nutritionPlanId: z.string(),
        logDate: z.date(),
        adherenceScore: z.number().min(0).max(100),
        caloriesConsumed: z.number().positive(),
        proteinConsumed: z.number().positive(),
        carbsConsumed: z.number().positive(),
        fatConsumed: z.number().positive(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const nutritionLog = await ctx.prisma.nutritionLog.create({
        data: {
          userId,
          nutritionPlanId: input.nutritionPlanId,
          logDate: input.logDate,
          adherenceScore: input.adherenceScore,
          caloriesConsumed: input.caloriesConsumed,
          proteinConsumed: input.proteinConsumed,
          carbsConsumed: input.carbsConsumed,
          fatConsumed: input.fatConsumed,
          notes: input.notes,
        },
      })

      return nutritionLog
    }),

  getNutritionLogs: protectedProcedure
    .input(
      z.object({
        nutritionPlanId: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const limit = input.limit || 10

      const nutritionLogs = await ctx.prisma.nutritionLog.findMany({
        where: {
          userId,
          nutritionPlanId: input.nutritionPlanId,
        },
        orderBy: { logDate: "desc" },
        take: limit,
      })

      return nutritionLogs
    }),
})
