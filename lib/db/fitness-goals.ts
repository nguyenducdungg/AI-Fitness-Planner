import { createServerSupabaseClient } from "../supabase"

export type FitnessGoal = {
  id?: string
  user_id: string
  primary_goal: string
  experience_level: string
  target_weight: number
  timeframe: string
  workout_days_per_week: number
  workout_duration: number
  additional_goals?: string
  created_at?: string
  updated_at?: string
}

export async function getFitnessGoals(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("fitness_goals").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching fitness goals:", error)
    return null
  }

  return data as FitnessGoal
}

export async function createFitnessGoals(goals: FitnessGoal) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("fitness_goals").insert([goals]).select()

  if (error) {
    console.error("Error creating fitness goals:", error)
    throw error
  }

  return data[0] as FitnessGoal
}

export async function updateFitnessGoals(goals: FitnessGoal) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("fitness_goals")
    .update({
      primary_goal: goals.primary_goal,
      experience_level: goals.experience_level,
      target_weight: goals.target_weight,
      timeframe: goals.timeframe,
      workout_days_per_week: goals.workout_days_per_week,
      workout_duration: goals.workout_duration,
      additional_goals: goals.additional_goals,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", goals.user_id)
    .select()

  if (error) {
    console.error("Error updating fitness goals:", error)
    throw error
  }

  return data[0] as FitnessGoal
}
