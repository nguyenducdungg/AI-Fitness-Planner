"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export function NotificationSetup() {
  const { data: session } = useSession()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setIsSupported(false)
      return
    }

    // Check if the user is already subscribed
    if (Notification.permission === "granted") {
      setIsSubscribed(true)
    }
  }, [])

  const subscribeToNotifications = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication required",
        description: "Please sign in to enable notifications",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Request permission
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        toast({
          title: "Permission denied",
          description: "Please allow notifications in your browser settings",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register("/service-worker.js")

      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      // Send subscription to server
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: session.user.email,
        }),
      })

      setIsSubscribed(true)
      toast({
        title: "Notifications enabled",
        description: "You will now receive workout and nutrition reminders",
      })
    } catch (error) {
      console.error("Error subscribing to notifications:", error)
      toast({
        title: "Subscription failed",
        description: "There was an error enabling notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
      }

      setIsSubscribed(false)
      toast({
        title: "Notifications disabled",
        description: "You will no longer receive notifications",
      })
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error)
      toast({
        title: "Error",
        description: "There was an error disabling notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Button variant="outline" disabled>
        <BellOff className="mr-2 h-4 w-4" />
        Notifications not supported
      </Button>
    )
  }

  return isSubscribed ? (
    <Button variant="outline" onClick={unsubscribeFromNotifications} disabled={isLoading}>
      <BellOff className="mr-2 h-4 w-4" />
      {isLoading ? "Disabling..." : "Disable Notifications"}
    </Button>
  ) : (
    <Button variant="default" onClick={subscribeToNotifications} disabled={isLoading}>
      <Bell className="mr-2 h-4 w-4" />
      {isLoading ? "Enabling..." : "Enable Notifications"}
    </Button>
  )
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
