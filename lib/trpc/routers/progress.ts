import { z } from "zod"
import { router, protectedProcedure } from "@/lib/trpc/server"

export const progressRouter = router({
  getProgressRecords: protectedProcedure
    .input(
      z.object({
        recordType: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const limit = input.limit || 30

      const records = await ctx.prisma.progressRecord.findMany({
        where: {
          userId,
          recordType: input.recordType,
        },
        orderBy: {
          recordDate: "asc",
        },
        take: limit,
      })

      return records
    }),

  addProgressRecord: protectedProcedure
    .input(
      z.object({
        recordType: z.string(),
        recordValue: z.number(),
        recordDate: z.date(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const record = await ctx.prisma.progressRecord.create({
        data: {
          userId,
          recordType: input.recordType,
          recordValue: input.recordValue,
          recordDate: input.recordDate,
          notes: input.notes,
        },
      })

      // Update user profile weight if the record type is weight
      if (input.recordType === "weight") {
        await ctx.prisma.userProfile.update({
          where: { userId },
          data: { weight: input.recordValue },
        })
      }

      return record
    }),

  getLatestProgressRecord: protectedProcedure
    .input(z.object({ recordType: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const record = await ctx.prisma.progressRecord.findFirst({
        where: {
          userId,
          recordType: input.recordType,
        },
        orderBy: {
          recordDate: "desc",
        },
      })

      return record
    }),

  analyzeProgress: protectedProcedure.input(z.object({ recordType: z.string() })).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    // Get all records of the specified type
    const records = await ctx.prisma.progressRecord.findMany({
      where: {
        userId,
        recordType: input.recordType,
      },
      orderBy: {
        recordDate: "asc",
      },
    })

    if (records.length < 2) {
      return {
        change: 0,
        percentageChange: 0,
        trend: "neutral",
        averageWeeklyChange: 0,
      }
    }

    // Calculate overall change
    const firstRecord = records[0]
    const lastRecord = records[records.length - 1]
    const change = lastRecord.recordValue - firstRecord.recordValue
    const percentageChange = (change / firstRecord.recordValue) * 100

    // Calculate average weekly change
    const totalDays = Math.ceil(
      (lastRecord.recordDate.getTime() - firstRecord.recordDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    const totalWeeks = totalDays / 7
    const averageWeeklyChange = totalWeeks > 0 ? change / totalWeeks : 0

    // Determine trend
    let trend = "neutral"
    if (input.recordType === "weight") {
      // For weight, negative change is usually good for weight loss goals
      const userGoals = await ctx.prisma.fitnessGoal.findUnique({
        where: { userId },
      })

      if (userGoals) {
        const isWeightLossGoal = userGoals.primaryGoal === "weight-loss"
        trend = isWeightLossGoal
          ? change < 0
            ? "positive"
            : change > 0
              ? "negative"
              : "neutral"
          : change > 0
            ? "positive"
            : change < 0
              ? "negative"
              : "neutral"
      } else {
        trend = change < 0 ? "positive" : change > 0 ? "negative" : "neutral"
      }
    } else {
      // For other measurements like muscle gain, positive change is usually good
      trend = change > 0 ? "positive" : change < 0 ? "negative" : "neutral"
    }

    return {
      change,
      percentageChange,
      trend,
      averageWeeklyChange,
      firstRecord,
      lastRecord,
      totalRecords: records.length,
    }
  }),
})
