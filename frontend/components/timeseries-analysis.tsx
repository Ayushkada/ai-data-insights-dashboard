"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface TimeSeriesAnalysisProps {
  type: "decomposition" | "stationarity" | "forecasting"
  datasetId: string
  description: string
}

export function TimeSeriesAnalysis({ type, datasetId, description }: TimeSeriesAnalysisProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [selectedDateColumn, setSelectedDateColumn] = useState("")
  const [selectedValueColumn, setSelectedValueColumn] = useState("")
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const dateColumns = dataset.columns.filter((col) => col.type === "datetime")
  const numericColumns = dataset.columns.filter((col) => col.type === "numeric")

  const handleAnalyze = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date Column</Label>
          <Select value={selectedDateColumn} onValueChange={setSelectedDateColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Select date column" />
            </SelectTrigger>
            <SelectContent>
              {dateColumns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Value Column</Label>
          <Select value={selectedValueColumn} onValueChange={setSelectedValueColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Select value column" />
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
      </div>

      <Button onClick={handleAnalyze} disabled={!selectedDateColumn || !selectedValueColumn}>
        Run {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
      </Button>

      {showResult && (
        <div className="space-y-4">
          <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            Time series {type} chart placeholder - integrate with Recharts
          </div>

          {type === "stationarity" && (
            <div className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Stationarity Test Results</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">ADF Statistic:</span> -3.45
                </div>
                <div>
                  <span className="font-medium">P-value:</span> 0.012
                </div>
                <div>
                  <span className="font-medium">Result:</span>
                  <span className="ml-1 text-green-600 font-medium">Stationary</span>
                </div>
              </div>
            </div>
          )}

          <AIInsightCard>
            {type === "decomposition" &&
              "The time series shows clear seasonal patterns with an upward trend. The residuals appear to be normally distributed with minimal autocorrelation."}
            {type === "stationarity" &&
              "The ADF test indicates the series is stationary (p = 0.012 < 0.05), making it suitable for ARIMA modeling."}
            {type === "forecasting" &&
              "The forecast model shows good fit with the historical data. The predicted values suggest continued growth with seasonal variations."}
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
