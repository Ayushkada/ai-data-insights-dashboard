"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface TextAnalysisProps {
  type: "sentiment" | "topics" | "ner"
  datasetId: string
  description: string
}

export function TextAnalysis({ type, datasetId, description }: TextAnalysisProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [selectedTextColumn, setSelectedTextColumn] = useState("")
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const textColumns = dataset.columns.filter((col) => col.type === "text")

  const handleAnalyze = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Text Column</Label>
          <Select value={selectedTextColumn} onValueChange={setSelectedTextColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Select text column" />
            </SelectTrigger>
            <SelectContent>
              {textColumns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleAnalyze} disabled={!selectedTextColumn}>
        Run {type.toUpperCase()} Analysis
      </Button>

      {showResult && (
        <div className="space-y-4">
          {type === "sentiment" && (
            <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
              Sentiment distribution pie chart placeholder
            </div>
          )}

          {type === "topics" && (
            <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
              Topic word cloud placeholder
            </div>
          )}

          {type === "ner" && (
            <div className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Named Entities Found</h4>
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium">Persons:</span> John Smith, Mary Johnson, David Brown
                </div>
                <div>
                  <span className="font-medium">Organizations:</span> Microsoft, Google, Apple Inc.
                </div>
                <div>
                  <span className="font-medium">Locations:</span> New York, California, London
                </div>
                <div>
                  <span className="font-medium">Dates:</span> 2023-01-15, March 2024, Q4 2023
                </div>
              </div>
            </div>
          )}

          <AIInsightCard>
            {type === "sentiment" &&
              "The sentiment analysis reveals 65% positive, 25% neutral, and 10% negative sentiments. The overall tone is optimistic with key positive themes around product quality and customer service."}
            {type === "topics" &&
              "Topic modeling identified 5 main themes: customer satisfaction, product features, pricing concerns, delivery experience, and support quality. The most prominent topic relates to product satisfaction."}
            {type === "ner" &&
              "Named entity recognition extracted 45 person names, 23 organizations, and 18 locations. The most frequently mentioned entities suggest this text focuses on business relationships and geographic markets."}
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
