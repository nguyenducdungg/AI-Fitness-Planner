import { createServerSupabaseClient } from "../supabase"

export type ProgressRecord = {
  id?: string
  user_id: string
  record_type: string
  record_value: number
  record_date: string
  notes?: string
  created_at?: string
}

export async function getProgressRecords(userId: string, recordType: string, limit = 30) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("progress_records")
    .select("*")
    .eq("user_id", userId)
    .eq("record_type", recordType)
    .order("record_date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching progress records:", error)
    return []
  }

  return data as ProgressRecord[]
}

export async function addProgressRecord(record: ProgressRecord) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("progress_records").insert([record]).select()

  if (error) {
    console.error("Error adding progress record:", error)
    throw error
  }

  return data[0] as ProgressRecord
}

export async function getLatestProgressRecord(userId: string, recordType: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("progress_records")
    .select("*")
    .eq("user_id", userId)
    .eq("record_type", recordType)
    .order("record_date", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching latest progress record:", error)
    return null
  }

  return data as ProgressRecord
}
