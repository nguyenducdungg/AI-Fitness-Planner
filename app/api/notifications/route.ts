import { NextResponse } from "next/server"

// This would be connected to a real database in a production app
const subscriptions: { [userId: string]: PushSubscription } = {}

export async function POST(req: Request) {
  try {
    const { subscription, userId } = await req.json()

    // Store the subscription with the user ID
    subscriptions[userId] = subscription

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save push subscription" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const subscription = subscriptions[userId]

  if (!subscription) {
    return NextResponse.json({ error: "No subscription found for this user" }, { status: 404 })
  }

  return NextResponse.json({ subscription })
}
