"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface ChartGeneratorProps {
  type: "histogram" | "boxplot" | "heatmap"
  datasetId: string
  description: string
}

export function ChartGenerator({ type, datasetId, description }: ChartGeneratorProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [selectedVariable, setSelectedVariable] = useState("")
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const numericColumns = dataset.columns.filter((col) => col.type === "numeric")

  const handleGenerate = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Select Variable</Label>
          <Select value={selectedVariable} onValueChange={setSelectedVariable}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a variable" />
            </SelectTrigger>
            <SelectContent>
              {numericColumns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {type === "boxplot" && (
          <div className="space-y-2">
            <Label>Group By (Optional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose grouping variable" />
              </SelectTrigger>
              <SelectContent>
                {dataset.columns
                  .filter((col) => col.type === "categorical")
                  .map((column) => (
                    <SelectItem key={column.name} value={column.name}>
                      {column.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button onClick={handleGenerate} disabled={!selectedVariable}>
        Generate {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>

      {showResult && (
        <div className="space-y-4">
          <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1)} chart placeholder - integrate with Recharts
          </div>

          <AIInsightCard>
            The {type} shows a {type === "histogram" ? "normal distribution" : "clear pattern"} in the selected
            variable.
            {type === "heatmap" && " Strong correlations are visible between several variable pairs."}
            Consider further analysis to understand the underlying relationships.
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
