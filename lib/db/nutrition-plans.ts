import { createServerSupabaseClient } from "../supabase"

export type NutritionPlan = {
  id?: string
  user_id: string
  daily_calories: number
  macro_distribution: any
  meal_plan: any
  recommendations: any
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getActiveNutritionPlan(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching nutrition plan:", error)
    return null
  }

  return data as NutritionPlan
}

export async function createNutritionPlan(plan: NutritionPlan) {
  const supabase = createServerSupabaseClient()

  // First, deactivate all existing plans for this user
  await supabase.from("nutrition_plans").update({ is_active: false }).eq("user_id", plan.user_id)

  // Then create the new plan
  const { data, error } = await supabase.from("nutrition_plans").insert([plan]).select()

  if (error) {
    console.error("Error creating nutrition plan:", error)
    throw error
  }

  return data[0] as NutritionPlan
}

export async function getNutritionHistory(userId: string, limit = 5) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching nutrition history:", error)
    return []
  }

  return data as NutritionPlan[]
}
