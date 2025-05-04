import { router } from "@/lib/trpc/server"
import { userRouter } from "./user"
import { workoutRouter } from "./workout"
import { nutritionRouter } from "./nutrition"
import { progressRouter } from "./progress"

export const appRouter = router({
  user: userRouter,
  workout: workoutRouter,
  nutrition: nutritionRouter,
  progress: progressRouter,
})

export type AppRouter = typeof appRouter
