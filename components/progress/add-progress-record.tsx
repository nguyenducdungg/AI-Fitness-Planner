"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/trpc/client"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function AddProgressRecord() {
  const [recordType, setRecordType] = useState("weight")
  const [recordValue, setRecordValue] = useState("")
  const [recordDate, setRecordDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const addRecord = api.progress.addProgressRecord.useMutation({
    onSuccess: () => {
      toast({
        title: "Progress Recorded",
        description: "Your progress has been recorded successfully.",
      })
      setRecordValue("")
      setNotes("")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record progress. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const handleAddRecord = () => {
    if (!recordValue || isNaN(Number(recordValue))) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid number.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    addRecord.mutate({
      recordType,
      recordValue: Number(recordValue),
      recordDate,
      notes,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Progress</CardTitle>
        <CardDescription>Track your fitness journey by recording your measurements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Measurement Type</label>
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger>
              <SelectValue placeholder="Select measurement type" />
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Value</label>
          <Input
            type="number"
            step="0.1"
            value={recordValue}
            onChange={(e) => setRecordValue(e.target.value)}
            placeholder={`Enter ${recordType} measurement`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !recordDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recordDate ? format(recordDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={recordDate}
                onSelect={(date) => date && setRecordDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            placeholder="Any additional notes about this measurement"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddRecord} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Measurement"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
