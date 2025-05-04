import * as React from "react"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className="rounded-md border" ref={ref} {...props} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="py-2" ref={ref} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="px-2 py-1.5" ref={ref} {...props} />,
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p className="text-sm font-medium" ref={ref} {...props} />,
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="flex justify-center pt-2" ref={ref} {...props} />,
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="flex items-center gap-2 text-sm" ref={ref} {...props} />,
)
ChartLegendContent.displayName = "ChartLegendContent"

const ChartStyle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="h-2 w-2 rounded-full" ref={ref} {...props} />,
)
ChartStyle.displayName = "ChartStyle"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
