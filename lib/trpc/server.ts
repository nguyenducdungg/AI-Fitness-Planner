import { initTRPC, TRPCError } from "@trpc/server"
import { getServerSession } from "next-auth"
import superjson from "superjson"
import { ZodError } from "zod"

// Add this at the top of the file, after the imports
import { prisma } from "@/lib/prisma"

// Make sure the createTRPCContext function properly handles potential connection issues
export const createTRPCContext = async (opts: { headers: Headers }) => {
  try {
    const session = await getServerSession()

    return {
      prisma,
      session,
      ...opts,
    }
  } catch (error) {
    console.error("Error creating TRPC context:", error)
    return {
      prisma,
      session: null,
      ...opts,
    }
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
