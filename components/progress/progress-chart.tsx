"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/trpc/client"
import { format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

export function ProgressChart() {
  const [recordType, setRecordType] = useState("weight")

  const { data: records, isLoading } = api.progress.getProgressRecords.useQuery({
    recordType,
  })

  const { data: analysis } = api.progress.analyzeProgress.useQuery(
    {
      recordType,
    },
    {
      enabled: records !== undefined && records.length > 0,
    },
  )

  const formatChartData = () => {
    if (!records) return []

    return records.map((record) => ({
      date: format(new Date(record.recordDate), "MMM dd"),
      value: record.recordValue,
    }))
  }

  const getTrendColor = () => {
    if (!analysis) return "text-muted-foreground"

    if (recordType === "weight") {
      return analysis.trend === "positive"
        ? "text-green-500"
        : analysis.trend === "negative"
          ? "text-red-500"
          : "text-muted-foreground"
    } else {
      return analysis.trend === "positive"
        ? "text-green-500"
        : analysis.trend === "negative"
          ? "text-red-500"
          : "text-muted-foreground"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Track your fitness progress over time</CardDescription>
          </div>
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select measurement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight (kg)</SelectItem>
              <SelectItem value="chest">Chest (cm)</SelectItem>
              <SelectItem value="waist">Waist (cm)</SelectItem>
              <SelectItem value="hips">Hips (cm)</SelectItem>
              <SelectItem value="arms">Arms (cm)</SelectItem>
              <SelectItem value="thighs">Thighs (cm)</SelectItem>
              <SelectItem value="bodyfat">Body Fat (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : records && records.length > 0 ? (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip
                    formatter={(value) => [
                      `${value} ${recordType === "bodyfat" ? "%" : recordType === "weight" ? "kg" : "cm"}`,
                      recordType,
                    ]}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {analysis && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium">Total Change</p>
                  <p className={`text-xl font-bold ${getTrendColor()}`}>
                    {analysis.change > 0 ? "+" : ""}
                    {analysis.change.toFixed(1)}{" "}
                    {recordType === "bodyfat" ? "%" : recordType === "weight" ? "kg" : "cm"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analysis.percentageChange.toFixed(1)}% {analysis.change > 0 ? "increase" : "decrease"}
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium">Weekly Average</p>
                  <p className={`text-xl font-bold ${getTrendColor()}`}>
                    {analysis.averageWeeklyChange > 0 ? "+" : ""}
                    {analysis.averageWeeklyChange.toFixed(2)}{" "}
                    {recordType === "bodyfat" ? "%" : recordType === "weight" ? "kg" : "cm"}
                  </p>
                  <p className="text-xs text-muted-foreground">per week over {analysis.totalRecords} measurements</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-muted-foreground">No {recordType} measurements recorded yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first measurement to start tracking progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
