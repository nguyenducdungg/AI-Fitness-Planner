import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🌱 Seeding database...")

    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        email: "demo@example.com",
        name: "Demo User",
        image: "/placeholder.svg?height=32&width=32",
        profile: {
          create: {
            age: 30,
            gender: "male",
            height: 175,
            weight: 75,
            medicalConditions: "None",
          },
        },
        fitnessGoals: {
          create: {
            primaryGoal: "weight-loss",
            experienceLevel: "intermediate",
            targetWeight: 70,
            timeframe: "3-months",
            workoutDaysPerWeek: 4,
            workoutDuration: 45,
            additionalGoals: "Improve overall fitness and energy levels",
          },
        },
      },
    })

    console.log(`✅ Created user: ${user.name} (${user.email})`)

    // Create a sample workout plan
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        isActive: true,
        planData: {
          workoutPlan: [
            {
              day: "Monday",
              focus: "Upper Body Strength",
              exercises: [
                {
                  name: "Bench Press",
                  sets: 4,
                  reps: "8-10",
                  restTime: "90 seconds",
                  notes: "Focus on controlled movement",
                },
                {
                  name: "Bent Over Rows",
                  sets: 4,
                  reps: "10-12",
                  restTime: "60 seconds",
                },
                {
                  name: "Overhead Press",
                  sets: 3,
                  reps: "8-10",
                  restTime: "90 seconds",
                },
              ],
              duration: "45 minutes",
              intensity: "Moderate",
              warmup: "5 minutes of light cardio",
              cooldown: "5 minutes of stretching",
            },
            {
              day: "Wednesday",
              focus: "Lower Body Power",
              exercises: [
                {
                  name: "Squats",
                  sets: 4,
                  reps: "8-10",
                  restTime: "90 seconds",
                  notes: "Focus on depth and form",
                },
                {
                  name: "Romanian Deadlifts",
                  sets: 4,
                  reps: "10-12",
                  restTime: "60 seconds",
                },
                {
                  name: "Walking Lunges",
                  sets: 3,
                  reps: "12 per leg",
                  restTime: "60 seconds",
                },
              ],
              duration: "45 minutes",
              intensity: "High",
              warmup: "5 minutes of light cardio",
              cooldown: "5 minutes of stretching",
            },
            {
              day: "Friday",
              focus: "Full Body",
              exercises: [
                {
                  name: "Pull-ups",
                  sets: 3,
                  reps: "8-10",
                  restTime: "90 seconds",
                },
                {
                  name: "Push-ups",
                  sets: 3,
                  reps: "12-15",
                  restTime: "60 seconds",
                },
                {
                  name: "Goblet Squats",
                  sets: 3,
                  reps: "12-15",
                  restTime: "60 seconds",
                },
              ],
              duration: "45 minutes",
              intensity: "Moderate",
              warmup: "5 minutes of light cardio",
              cooldown: "5 minutes of stretching",
            },
          ],
          recommendations: {
            nutrition: "Focus on a high protein diet with moderate carbs and healthy fats.",
            recovery: "Ensure 7-8 hours of quality sleep each night.",
            progression: "Aim to increase weight or reps every 1-2 weeks.",
          },
        },
      },
    })

    console.log(`✅ Created workout plan for user: ${user.name}`)

    // Create a sample nutrition plan
    const nutritionPlan = await prisma.nutritionPlan.create({
      data: {
        userId: user.id,
        isActive: true,
        dailyCalories: 2200,
        macroDistribution: {
          protein: {
            percentage: 30,
            grams: 165,
          },
          carbs: {
            percentage: 40,
            grams: 220,
          },
          fat: {
            percentage: 30,
            grams: 73,
          },
        },
        mealPlan: [
          {
            meal: "Breakfast",
            time: "7:00 - 8:00 AM",
            calories: 550,
            options: [
              {
                name: "Protein Oatmeal",
                ingredients: [
                  "1 cup rolled oats",
                  "1 scoop protein powder",
                  "1 tbsp almond butter",
                  "1/2 banana",
                  "1 tsp honey",
                ],
                macros: {
                  protein: 30,
                  carbs: 60,
                  fat: 12,
                },
                calories: 550,
              },
            ],
          },
          {
            meal: "Lunch",
            time: "12:00 - 1:00 PM",
            calories: 650,
            options: [
              {
                name: "Chicken and Quinoa Bowl",
                ingredients: [
                  "5 oz grilled chicken breast",
                  "3/4 cup cooked quinoa",
                  "1 cup mixed vegetables",
                  "1 tbsp olive oil",
                ],
                macros: {
                  protein: 45,
                  carbs: 50,
                  fat: 18,
                },
                calories: 650,
              },
            ],
          },
          {
            meal: "Dinner",
            time: "6:00 - 7:00 PM",
            calories: 550,
            options: [
              {
                name: "Salmon with Sweet Potato",
                ingredients: [
                  "5 oz baked salmon",
                  "1 medium sweet potato",
                  "1 cup steamed broccoli",
                  "1 tsp olive oil",
                ],
                macros: {
                  protein: 35,
                  carbs: 45,
                  fat: 20,
                },
                calories: 550,
              },
            ],
          },
        ],
        recommendations: {
          hydration: "Drink at least 3 liters of water daily.",
          supplements: "Consider a whey protein supplement to help meet protein goals.",
          timing: "Try to eat within 1 hour of waking up.",
        },
      },
    })

    console.log(`✅ Created nutrition plan for user: ${user.name}`)

    // Create some progress records
    const today = new Date()
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    await prisma.progressRecord.createMany({
      data: [
        {
          userId: user.id,
          recordType: "weight",
          recordValue: 75,
          recordDate: twoWeeksAgo,
          notes: "Starting weight",
        },
        {
          userId: user.id,
          recordType: "weight",
          recordValue: 74.2,
          recordDate: oneWeekAgo,
          notes: "Making progress",
        },
        {
          userId: user.id,
          recordType: "weight",
          recordValue: 73.5,
          recordDate: today,
          notes: "Continuing to lose weight",
        },
      ],
    })

    console.log(`✅ Created progress records for user: ${user.name}`)

    console.log("✨ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
