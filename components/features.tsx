import { Dumbbell, Utensils, Bell, LineChart, Brain, Calendar } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Dumbbell className="h-10 w-10 text-primary" />,
      title: "AI Workout Planning",
      description: "Get personalized workout routines based on your fitness level, goals, and available equipment.",
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Nutrition Management",
      description: "Track your calorie intake and macronutrients with AI-generated meal plans tailored to your goals.",
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: "Smart Reminders",
      description: "Never miss a workout or meal with our intelligent notification system.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "Progress Tracking",
      description: "Visualize your fitness journey with detailed charts and analytics.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Adaptive Planning",
      description: "Our AI adjusts your fitness plan based on your actual progress and adherence.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Goal-Based Timeline",
      description: "Set realistic timeframes for your fitness goals and track your progress towards them.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered fitness planner comes with everything you need to achieve your fitness goals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
