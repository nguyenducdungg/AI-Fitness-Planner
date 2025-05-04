import { z } from "zod"
import { router, protectedProcedure } from "@/lib/trpc/server"

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const profile = await ctx.prisma.userProfile.findUnique({
      where: { userId },
    })

    return profile
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        age: z.number().min(13).max(100),
        gender: z.string(),
        height: z.number().positive(),
        weight: z.number().positive(),
        medicalConditions: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const profile = await ctx.prisma.userProfile.upsert({
        where: { userId },
        update: input,
        create: {
          userId,
          ...input,
        },
      })

      return profile
    }),

  getFitnessGoals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const goals = await ctx.prisma.fitnessGoal.findUnique({
      where: { userId },
    })

    return goals
  }),

  updateFitnessGoals: protectedProcedure
    .input(
      z.object({
        primaryGoal: z.string(),
        experienceLevel: z.string(),
        targetWeight: z.number().positive(),
        timeframe: z.string(),
        workoutDaysPerWeek: z.number().min(1).max(7),
        workoutDuration: z.number().positive(),
        additionalGoals: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const goals = await ctx.prisma.fitnessGoal.upsert({
        where: { userId },
        update: input,
        create: {
          userId,
          ...input,
        },
      })

      return goals
    }),
})
