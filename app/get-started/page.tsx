import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Get Started | AI Fitness Planner",
  description: "Start your fitness journey with AI Fitness Planner",
}

export default function GetStartedPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Start Your Fitness Journey Today
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Follow these simple steps to get started with your personalized AI fitness plan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <CardTitle>Create an Account</CardTitle>
            </div>
            <CardDescription>Sign up to access all features and save your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Quick and easy sign-up process</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Secure authentication options</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Your data is always private and protected</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Create Account</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <CardTitle>Complete Your Profile</CardTitle>
            </div>
            <CardDescription>Tell us about yourself so we can personalize your plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Enter your body measurements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Set your fitness goals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Specify any limitations or preferences</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <CardTitle>Get Your AI Plan</CardTitle>
            </div>
            <CardDescription>Receive your personalized workout and nutrition plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>AI-generated workout routines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Personalized nutrition guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Progress tracking and adjustments</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 flex flex-col items-center text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Ready to transform your fitness journey?</h2>
        <p className="max-w-[600px] text-muted-foreground">
          Join thousands of users who have achieved their fitness goals with our AI-powered fitness planner.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/auth/signin">Get Started Now</Link>
        </Button>
      </div>
    </div>
  )
}
