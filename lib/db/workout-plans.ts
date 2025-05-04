import { createServerSupabaseClient } from "../supabase"

export type WorkoutPlan = {
  id?: string
  user_id: string
  plan_data: any
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getActiveWorkoutPlan(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching workout plan:", error)
    return null
  }

  return data as WorkoutPlan
}

export async function createWorkoutPlan(plan: WorkoutPlan) {
  const supabase = createServerSupabaseClient()

  // First, deactivate all existing plans for this user
  await supabase.from("workout_plans").update({ is_active: false }).eq("user_id", plan.user_id)

  // Then create the new plan
  const { data, error } = await supabase.from("workout_plans").insert([plan]).select()

  if (error) {
    console.error("Error creating workout plan:", error)
    throw error
  }

  return data[0] as WorkoutPlan
}

export async function getWorkoutHistory(userId: string, limit = 5) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching workout history:", error)
    return []
  }

  return data as WorkoutPlan[]
}
