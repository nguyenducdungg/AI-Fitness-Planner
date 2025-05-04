import { createServerSupabaseClient } from "../supabase"

export type UserProfile = {
  id?: string
  user_id: string
  age: number
  gender: string
  height: number
  weight: number
  medical_conditions?: string
  created_at?: string
  updated_at?: string
}

export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as UserProfile
}

export async function createUserProfile(profile: UserProfile) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("user_profiles").insert([profile]).select()

  if (error) {
    console.error("Error creating user profile:", error)
    throw error
  }

  return data[0] as UserProfile
}

export async function updateUserProfile(profile: UserProfile) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      medical_conditions: profile.medical_conditions,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", profile.user_id)
    .select()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data[0] as UserProfile
}
