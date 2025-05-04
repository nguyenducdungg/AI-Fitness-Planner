import { initTRPC, TRPCError } from "@trpc/server"
import { getServerSession } from "next-auth"
import superjson from "superjson"
import { ZodError } from "zod"

import { prisma } from "@/lib/prisma"

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerSession()

  return {
    prisma,
    session,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createCallerFactory = t.createCallerFactory
export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)
