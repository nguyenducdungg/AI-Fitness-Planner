"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Loader2 } from "lucide-react"
import { api } from "@/lib/trpc/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function NutritionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const generateNutrition = api.nutrition.generateNutritionPlan.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Nutrition Plan Generated",
        description: "Your personalized nutrition plan has been created successfully.",
      })
      router.push("/nutrition")
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate nutrition plan. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsGenerating(false)
    },
  })

  const handleGenerateNutrition = async () => {
    setIsGenerating(true)
    generateNutrition.mutate()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate AI Nutrition Plan</CardTitle>
        <CardDescription>Create a personalized nutrition plan based on your profile and fitness goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Utensils className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-medium">AI-Powered Nutrition Planning</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Our AI will analyze your profile, fitness goals, and preferences to create a customized nutrition plan
              with meal suggestions and macro targets.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={handleGenerateNutrition} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            "Generate Nutrition Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
