"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AutoMLAnalysisProps {
  datasetId: string
}

export function AutoMLAnalysis({ datasetId }: AutoMLAnalysisProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [targetVariable, setTargetVariable] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  if (!dataset) return null

  const handleRunAutoML = async () => {
    setIsRunning(true)
    // Simulate AutoML processing time
    setTimeout(() => {
      setIsRunning(false)
      setShowResult(true)
    }, 3000)
  }

  const mockLeaderboard = [
    { model: "Random Forest", accuracy: 0.94, precision: 0.92, recall: 0.91, f1: 0.91 },
    { model: "XGBoost", accuracy: 0.93, precision: 0.91, recall: 0.9, f1: 0.9 },
    { model: "Logistic Regression", accuracy: 0.89, precision: 0.87, recall: 0.88, f1: 0.87 },
    { model: "SVM", accuracy: 0.87, precision: 0.85, recall: 0.86, f1: 0.85 },
    { model: "Neural Network", accuracy: 0.86, precision: 0.84, recall: 0.85, f1: 0.84 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Target Variable</Label>
          <Select value={targetVariable} onValueChange={setTargetVariable}>
            <SelectTrigger>
              <SelectValue placeholder="Select target variable" />
            </SelectTrigger>
            <SelectContent>
              {dataset.columns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name} ({column.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleRunAutoML} disabled={!targetVariable || isRunning} className="w-full md:w-auto">
        {isRunning ? "Running AutoML..." : "Run AutoML"}
      </Button>

      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div>
                <p className="font-medium">AutoML in Progress</p>
                <p className="text-sm text-muted-foreground">
                  Training multiple models and optimizing hyperparameters...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Precision</TableHead>
                    <TableHead>Recall</TableHead>
                    <TableHead>F1-Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboard.map((model, index) => (
                    <TableRow key={model.model} className={index === 0 ? "bg-green-50 dark:bg-green-950/20" : ""}>
                      <TableCell className="font-medium">
                        {model.model}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best</span>
                        )}
                      </TableCell>
                      <TableCell>{model.accuracy.toFixed(3)}</TableCell>
                      <TableCell>{model.precision.toFixed(3)}</TableCell>
                      <TableCell>{model.recall.toFixed(3)}</TableCell>
                      <TableCell>{model.f1.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <AIInsightCard>
            AutoML completed successfully! The Random Forest model achieved the best performance with 94% accuracy. The
            model shows excellent precision and recall balance, making it suitable for production deployment. Key
            features contributing to predictions include the top 3 variables in your dataset. Consider feature
            engineering to potentially improve performance further.
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
