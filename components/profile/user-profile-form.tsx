"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { createClientSupabaseClient } from "@/lib/supabase"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid age.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid height in cm.",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid weight in kg.",
  }),
  medicalConditions: z.string().optional(),
})

const fitnessGoalsSchema = z.object({
  primaryGoal: z.string({
    required_error: "Please select a primary goal.",
  }),
  experienceLevel: z.string({
    required_error: "Please select your experience level.",
  }),
  targetWeight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid target weight in kg.",
  }),
  timeframe: z.string({
    required_error: "Please select a timeframe.",
  }),
  workoutDaysPerWeek: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 7, {
    message: "Please enter a number between 1 and 7.",
  }),
  workoutDuration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 15, {
    message: "Please enter a valid duration in minutes.",
  }),
  additionalGoals: z.string().optional(),
})

export function UserProfileForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const supabase = createClientSupabaseClient()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      medicalConditions: "",
    },
  })

  const goalsForm = useForm<z.infer<typeof fitnessGoalsSchema>>({
    resolver: zodResolver(fitnessGoalsSchema),
    defaultValues: {
      primaryGoal: "",
      experienceLevel: "",
      targetWeight: "",
      timeframe: "",
      workoutDaysPerWeek: "",
      workoutDuration: "",
      additionalGoals: "",
    },
  })

  // Fetch user profile and fitness goals data
  useEffect(() => {
    if (!session?.user?.email) return

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Get user ID
        const { data: userData } = await supabase.from("users").select("id").eq("email", session.user.email).single()

        if (userData) {
          // Fetch profile data
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", userData.id)
            .single()

          if (profileData) {
            profileForm.setValue("name", session.user.name || "")
            profileForm.setValue("email", session.user.email)
            profileForm.setValue("age", profileData.age.toString())
            profileForm.setValue("gender", profileData.gender)
            profileForm.setValue("height", profileData.height.toString())
            profileForm.setValue("weight", profileData.weight.toString())
            profileForm.setValue("medicalConditions", profileData.medical_conditions || "")
          }

          // Fetch fitness goals
          const { data: goalsData } = await supabase
            .from("fitness_goals")
            .select("*")
            .eq("user_id", userData.id)
            .single()

          if (goalsData) {
            goalsForm.setValue("primaryGoal", goalsData.primary_goal)
            goalsForm.setValue("experienceLevel", goalsData.experience_level)
            goalsForm.setValue("targetWeight", goalsData.target_weight.toString())
            goalsForm.setValue("timeframe", goalsData.timeframe)
            goalsForm.setValue("workoutDaysPerWeek", goalsData.workout_days_per_week.toString())
            goalsForm.setValue("workoutDuration", goalsData.workout_duration.toString())
            goalsForm.setValue("additionalGoals", goalsData.additional_goals || "")
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, profileForm, goalsForm, supabase])

  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    if (!session?.user?.email) return

    setIsLoading(true)
    try {
      // Get or create user
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single()

      let userId = userData?.id

      if (userError) {
        // Create user if not exists
        const { data: newUser } = await supabase
          .from("users")
          .insert([
            {
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            },
          ])
          .select()

        userId = newUser?.[0]?.id
      }

      if (!userId) {
        throw new Error("Failed to get or create user")
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("user_id", userId).single()

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from("user_profiles")
          .update({
            age: Number.parseInt(data.age),
            gender: data.gender,
            height: Number.parseFloat(data.height),
            weight: Number.parseFloat(data.weight),
            medical_conditions: data.medicalConditions,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
      } else {
        // Create new profile
        await supabase.from("user_profiles").insert([
          {
            user_id: userId,
            age: Number.parseInt(data.age),
            gender: data.gender,
            height: Number.parseFloat(data.height),
            weight: Number.parseFloat(data.weight),
            medical_conditions: data.medicalConditions,
          },
        ])
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onGoalsSubmit(data: z.infer<typeof fitnessGoalsSchema>) {
    if (!session?.user?.email) return

    setIsLoading(true)
    try {
      // Get user ID
      const { data: userData } = await supabase.from("users").select("id").eq("email", session.user.email).single()

      if (!userData?.id) {
        throw new Error("User not found")
      }

      // Check if goals exist
      const { data: existingGoals } = await supabase
        .from("fitness_goals")
        .select("id")
        .eq("user_id", userData.id)
        .single()

      if (existingGoals) {
        // Update existing goals
        await supabase
          .from("fitness_goals")
          .update({
            primary_goal: data.primaryGoal,
            experience_level: data.experienceLevel,
            target_weight: Number.parseFloat(data.targetWeight),
            timeframe: data.timeframe,
            workout_days_per_week: Number.parseInt(data.workoutDaysPerWeek),
            workout_duration: Number.parseInt(data.workoutDuration),
            additional_goals: data.additionalGoals,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userData.id)
      } else {
        // Create new goals
        await supabase.from("fitness_goals").insert([
          {
            user_id: userData.id,
            primary_goal: data.primaryGoal,
            experience_level: data.experienceLevel,
            target_weight: Number.parseFloat(data.targetWeight),
            timeframe: data.timeframe,
            workout_days_per_week: Number.parseInt(data.workoutDaysPerWeek),
            workout_duration: Number.parseInt(data.workoutDuration),
            additional_goals: data.additionalGoals,
          },
        ])
      }

      toast({
        title: "Fitness goals updated",
        description: "Your fitness goals have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving fitness goals:", error)
      toast({
        title: "Error",
        description: "There was a problem updating your fitness goals.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal Information</TabsTrigger>
        <TabsTrigger value="goals">Fitness Goals</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and body measurements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="Your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your height in cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your weight in kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions or Limitations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any medical conditions or physical limitations that might affect your workout routine"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This information helps our AI create safer workout plans for you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Personal Information"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="goals">
        <Card>
          <CardHeader>
            <CardTitle>Fitness Goals</CardTitle>
            <CardDescription>Set your fitness goals and preferences to get a personalized plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...goalsForm}>
              <form onSubmit={goalsForm.handleSubmit(onGoalsSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={goalsForm.control}
                    name="primaryGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your primary goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weight-loss">Weight Loss</SelectItem>
                            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="endurance">Endurance</SelectItem>
                            <SelectItem value="flexibility">Flexibility</SelectItem>
                            <SelectItem value="general-fitness">General Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={goalsForm.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={goalsForm.control}
                    name="targetWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your target weight in kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={goalsForm.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Timeframe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-month">1 Month</SelectItem>
                            <SelectItem value="3-months">3 Months</SelectItem>
                            <SelectItem value="6-months">6 Months</SelectItem>
                            <SelectItem value="1-year">1 Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={goalsForm.control}
                    name="workoutDaysPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Days Per Week</FormLabel>
                        <FormControl>
                          <Input placeholder="Number of days (1-7)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={goalsForm.control}
                    name="workoutDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input placeholder="Duration per session" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={goalsForm.control}
                  name="additionalGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Goals or Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific areas you want to focus on or additional fitness goals"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This helps our AI tailor your fitness plan to your specific needs.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Fitness Goals"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
