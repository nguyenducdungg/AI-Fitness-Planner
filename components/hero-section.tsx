import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Utensils, LineChart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                AI-Powered Fitness Planning
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Achieve your fitness goals with personalized workout plans, nutrition guidance, and progress tracking
                powered by artificial intelligence.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/get-started">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mr-0 flex items-center justify-center p-4 bg-background rounded-lg shadow-lg border">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                <Dumbbell className="h-10 w-10 mb-2 text-primary" />
                <h3 className="text-lg font-medium">Personalized Workouts</h3>
                <p className="text-sm text-center text-muted-foreground">Tailored to your goals and experience</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                <Utensils className="h-10 w-10 mb-2 text-primary" />
                <h3 className="text-lg font-medium">Nutrition Planning</h3>
                <p className="text-sm text-center text-muted-foreground">Calorie and macro tracking</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                <LineChart className="h-10 w-10 mb-2 text-primary" />
                <h3 className="text-lg font-medium">Progress Tracking</h3>
                <p className="text-sm text-center text-muted-foreground">Visualize your improvements</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 mb-2 text-primary"
                >
                  <path d="M10 3.2C10 2.1 9 1 7.5 1S5 2.1 5 3.2c0 .7.4 1.2 1 1.6" />
                  <path d="M5 5.8c-1.7.3-3 1.8-3 3.6 0 1.1.5 2.1 1.3 2.8" />
                  <path d="M6.1 12.2c-.7.2-1.1.7-1.1 1.3 0 .8.7 1.5 1.5 1.5h3c.8 0 1.5-.7 1.5-1.5 0-.6-.4-1.1-1.1-1.3" />
                  <path d="M14 3.2c0-1.1 1-2.2 2.5-2.2s2.5 1.1 2.5 2.2c0 .7-.4 1.2-1 1.6" />
                  <path d="M19 5.8c1.7.3 3 1.8 3 3.6 0 1.1-.5 2.1-1.3 2.8" />
                  <path d="M17.9 12.2c.7.2 1.1.7 1.1 1.3 0 .8-.7 1.5-1.5 1.5h-3c-.8 0-1.5-.7-1.5-1.5 0-.6.4-1.1 1.1-1.3" />
                  <path d="M12 8a3 3 0 0 0-3 3v1" />
                  <path d="M12 8a3 3 0 0 1 3 3v1" />
                  <path d="M9.7 15h4.6" />
                  <path d="M12 16v5" />
                </svg>
                <h3 className="text-lg font-medium">AI Adaptation</h3>
                <p className="text-sm text-center text-muted-foreground">Plans adjust to your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
