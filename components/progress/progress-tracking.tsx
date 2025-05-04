"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Chart } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data - would be fetched from API in a real app
const progressData = {
  weight: [
    { date: "2025-01-01", value: 75 },
    { date: "2025-01-08", value: 74.5 },
    { date: "2025-01-15", value: 74.2 },
    { date: "2025-01-22", value: 73.8 },
    { date: "2025-01-29", value: 73.5 },
    { date: "2025-02-05", value: 73.1 },
    { date: "2025-02-12", value: 72.8 },
    { date: "2025-02-19", value: 72.3 },
    { date: "2025-02-26", value: 72.0 },
    { date: "2025-03-05", value: 71.7 },
    { date: "2025-03-12", value: 71.5 },
    { date: "2025-03-19", value: 71.2 },
    { date: "2025-03-26", value: 70.9 },
  ],
  measurements: {
    chest: [
      { date: "2025-01-01", value: 95 },
      { date: "2025-01-15", value: 94.5 },
      { date: "2025-02-01", value: 94 },
      { date: "2025-02-15", value: 93.5 },
      { date: "2025-03-01", value: 93 },
      { date: "2025-03-15", value: 92.5 },
    ],
    waist: [
      { date: "2025-01-01", value: 85 },
      { date: "2025-01-15", value: 84 },
      { date: "2025-02-01", value: 83 },
      { date: "2025-02-15", value: 82 },
      { date: "2025-03-01", value: 81 },
      { date: "2025-03-15", value: 80 },
    ],
    arms: [
      { date: "2025-01-01", value: 33 },
      { date: "2025-01-15", value: 33.2 },
      { date: "2025-02-01", value: 33.5 },
      { date: "2025-02-15", value: 33.8 },
      { date: "2025-03-01", value: 34.1 },
      { date: "2025-03-15", value: 34.5 },
    ],
    thighs: [
      { date: "2025-01-01", value: 58 },
      { date: "2025-01-15", value: 57.5 },
      { date: "2025-02-01", value: 57 },
      { date: "2025-02-15", value: 56.5 },
      { date: "2025-03-01", value: 56 },
      { date: "2025-03-15", value: 55.5 },
    ],
  },
  workouts: [
    { date: "2025-01-01", completed: 3, target: 4 },
    { date: "2025-01-08", completed: 4, target: 4 },
    { date: "2025-01-15", completed: 3, target: 4 },
    { date: "2025-01-22", completed: 4, target: 4 },
    { date: "2025-01-29", completed: 4, target: 4 },
    { date: "2025-02-05", completed: 5, target: 4 },
    { date: "2025-02-12", completed: 4, target: 4 },
    { date: "2025-02-19", completed: 5, target: 4 },
    { date: "2025-02-26", completed: 4, target: 4 },
    { date: "2025-03-05", completed: 5, target: 4 },
    { date: "2025-03-12", completed: 5, target: 4 },
    { date: "2025-03-19", completed: 4, target: 4 },
    { date: "2025-03-26", completed: 5, target: 4 },
  ],
  nutrition: [
    { date: "2025-01-01", adherence: 75 },
    { date: "2025-01-08", adherence: 80 },
    { date: "2025-01-15", adherence: 85 },
    { date: "2025-01-22", adherence: 80 },
    { date: "2025-01-29", adherence: 85 },
    { date: "2025-02-05", adherence: 90 },
    { date: "2025-02-12", adherence: 85 },
    { date: "2025-02-19", adherence: 90 },
    { date: "2025-02-26", adherence: 95 },
    { date: "2025-03-05", adherence: 90 },
    { date: "2025-03-12", adherence: 95 },
    { date: "2025-03-19", adherence: 90 },
    { date: "2025-03-26", adherence: 95 },
  ],
}

export function ProgressTracking() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [measurementType, setMeasurementType] = useState("weight")
  const [measurementValue, setMeasurementValue] = useState("")

  const formatChartData = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      date: format(new Date(item.date), "MMM dd"),
    }))
  }

  const handleAddMeasurement = () => {
    // In a real app, this would send data to the backend
    console.log("Adding measurement:", {
      type: measurementType,
      value: measurementValue,
      date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    })

    setIsDialogOpen(false)
    setMeasurementValue("")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Progress</h2>
          <p className="text-muted-foreground">Track your fitness journey over time</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Measurement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Measurement</DialogTitle>
              <DialogDescription>Record your latest measurement to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="measurement-type">Measurement Type</Label>
                <select
                  id="measurement-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={measurementType}
                  onChange={(e) => setMeasurementType(e.target.value)}
                >
                  <option value="weight">Weight (kg)</option>
                  <option value="chest">Chest (cm)</option>
                  <option value="waist">Waist (cm)</option>
                  <option value="arms">Arms (cm)</option>
                  <option value="thighs">Thighs (cm)</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="measurement-value">Value</Label>
                <Input
                  id="measurement-value"
                  type="number"
                  step="0.1"
                  value={measurementValue}
                  onChange={(e) => setMeasurementValue(e.target.value)}
                  placeholder="Enter measurement value"
                />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeasurement}>Save Measurement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
          <TabsTrigger value="workouts">Workout Adherence</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Adherence</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
              <CardDescription>Track your weight changes over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatChartData(progressData.weight)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip formatter={(value) => [`${value} kg`, "Weight"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Weight (kg)"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Body Measurements</CardTitle>
              <CardDescription>Track changes in your body measurements over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      ...formatChartData(progressData.measurements.chest).map((item) => ({
                        ...item,
                        measurement: "Chest",
                      })),
                      ...formatChartData(progressData.measurements.waist).map((item) => ({
                        ...item,
                        measurement: "Waist",
                      })),
                      ...formatChartData(progressData.measurements.arms).map((item) => ({
                        ...item,
                        measurement: "Arms",
                      })),
                      ...formatChartData(progressData.measurements.thighs).map((item) => ({
                        ...item,
                        measurement: "Thighs",
                      })),
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} cm`, "Measurement"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Chest (cm)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      connectNulls
                      activeDot={{ r: 8 }}
                      hide={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Waist (cm)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      connectNulls
                      activeDot={{ r: 8 }}
                      hide={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Arms (cm)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      connectNulls
                      activeDot={{ r: 8 }}
                      hide={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Thighs (cm)"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      connectNulls
                      activeDot={{ r: 8 }}
                      hide={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Adherence</CardTitle>
              <CardDescription>Track how well you're sticking to your workout plan</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatChartData(progressData.workouts)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, "dataMax + 1"]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed Workouts" fill="#10b981" />
                    <Bar dataKey="target" name="Target Workouts" fill="#d1d5db" />
                  </BarChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Adherence</CardTitle>
              <CardDescription>Track how well you're following your nutrition plan</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatChartData(progressData.nutrition)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Adherence"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="adherence"
                      name="Nutrition Adherence (%)"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
