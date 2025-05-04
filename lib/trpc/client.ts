import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/lib/trpc/routers/root"

export const api = createTRPCReact<AppRouter>()
