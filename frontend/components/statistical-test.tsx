"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface StatisticalTestProps {
  type: "t-test" | "anova" | "chi-square" | "mann-whitney"
  datasetId: string
  description: string
}

export function StatisticalTest({ type, datasetId, description }: StatisticalTestProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [confidenceLevel, setConfidenceLevel] = useState("0.95")
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const numericColumns = dataset.columns.filter((col) => col.type === "numeric")
  const categoricalColumns = dataset.columns.filter((col) => col.type === "categorical")

  const handleRunTest = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Variable 1</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {(type === "chi-square" ? categoricalColumns : numericColumns).map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(type === "t-test" || type === "mann-whitney") && (
          <div className="space-y-2">
            <Label>Variable 2</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select variable" />
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
        )}

        {(type === "anova" || type === "chi-square") && (
          <div className="space-y-2">
            <Label>Grouping Variable</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select grouping" />
              </SelectTrigger>
              <SelectContent>
                {categoricalColumns.map((column) => (
                  <SelectItem key={column.name} value={column.name}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Confidence Level</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            max="0.99"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleRunTest}>Run {type.toUpperCase().replace("-", " ")} Test</Button>

      {showResult && (
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">Test Results</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Test Statistic:</span> 2.45
              </div>
              <div>
                <span className="font-medium">P-value:</span> 0.032
              </div>
              <div>
                <span className="font-medium">Degrees of Freedom:</span> 18
              </div>
              <div>
                <span className="font-medium">Significance:</span>
                <span className="ml-1 text-green-600 font-medium">Significant</span>
              </div>
            </div>
          </div>

          <div className="h-48 border rounded-md flex items-center justify-center text-muted-foreground">
            Statistical test visualization placeholder
          </div>

          <AIInsightCard>
            The {type} test shows a statistically significant result (p = 0.032 {"<"} 0.05). This suggests there is a
            meaningful difference between the groups being compared. Consider the practical significance alongside
            statistical significance.
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
