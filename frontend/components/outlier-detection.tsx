"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface OutlierDetectionProps {
  method: "z-score" | "iqr" | "isolation-forest"
  datasetId: string
  description: string
}

export function OutlierDetection({ method, datasetId, description }: OutlierDetectionProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const numericColumns = dataset.columns.filter((col) => col.type === "numeric")

  const handleColumnChange = (columnName: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, columnName])
    } else {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName))
    }
  }

  const handleDetectOutliers = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="space-y-3">
        <Label>Select Variables for Outlier Detection</Label>
        <div className="grid md:grid-cols-2 gap-2">
          {numericColumns.map((column) => (
            <div key={column.name} className="flex items-center space-x-2">
              <Checkbox
                id={column.name}
                checked={selectedColumns.includes(column.name)}
                onCheckedChange={(checked) => handleColumnChange(column.name, !!checked)}
              />
              <Label htmlFor={column.name} className="text-sm">
                {column.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleDetectOutliers} disabled={selectedColumns.length === 0}>
        Detect Outliers using {method.toUpperCase().replace("-", " ")}
      </Button>

      {showResult && (
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">Outlier Detection Results</h4>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Total Outliers Found:</span> 23
              </div>
              <div>
                <span className="font-medium">Percentage of Data:</span> 2.3%
              </div>
              <div>
                <span className="font-medium">Most Affected Column:</span> {selectedColumns[0]}
              </div>
            </div>
          </div>

          <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            Outlier visualization (scatter plot with highlighted outliers)
          </div>

          <AIInsightCard>
            The {method} method identified 23 outliers (2.3% of the data). Most outliers are concentrated in the{" "}
            {selectedColumns[0]} variable. Consider investigating these data points for data quality issues or genuine
            extreme values that might provide valuable insights.
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
