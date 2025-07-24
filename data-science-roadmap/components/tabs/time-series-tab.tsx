"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface TimeSeriesTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function TimeSeriesTab({ dataset, columnTypes }: TimeSeriesTabProps) {
  // Only show if datetime + numeric columns are present
  if (columnTypes.datetime.length === 0 || columnTypes.numeric.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Time Series Analysis Not Available</h3>
            <p className="text-sm">
              AI has disabled time series analysis for this dataset. Both datetime and numeric columns are required.
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
            <Clock className="h-12 w-12 mx-auto mb-4 text-indigo-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Time Series Analysis</h3>
            <p className="text-sm">
              Time series analysis tools will be available here. Detected {columnTypes.datetime.length} datetime columns
              and {columnTypes.numeric.length} numeric columns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
