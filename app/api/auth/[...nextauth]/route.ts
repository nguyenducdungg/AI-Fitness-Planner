import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { createServerSupabaseClient } from "@/lib/supabase"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In a real app, you would verify credentials against your database
        if (credentials?.email === "demo@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@example.com",
            image: "/placeholder.svg?height=32&width=32",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      } else if (token.email) {
        // If we have the email but not the ID, try to get it from Supabase
        try {
          const supabase = createServerSupabaseClient()
          const { data } = await supabase.from("users").select("id").eq("email", token.email).single()
          if (data) {
            token.id = data.id
          }
        } catch (error) {
          console.error("Error fetching user ID:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
