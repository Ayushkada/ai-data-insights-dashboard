"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface PredictiveModelingTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function PredictiveModelingTab({ dataset, columnTypes }: PredictiveModelingTabProps) {
  if (columnTypes.numeric.length <= 1) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Insufficient Data for Modeling</h3>
            <p className="text-sm">
              AI has disabled predictive modeling for this dataset. At least 2 numeric variables are required for
              meaningful predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Predictive Modeling (AutoML)</h3>
            <p className="text-sm">
              AutoML tools for regression and classification will be available here. Detected{" "}
              {columnTypes.numeric.length} numeric variables suitable for modeling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
