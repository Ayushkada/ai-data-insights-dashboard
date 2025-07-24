"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Layers } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface ClusteringTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function ClusteringTab({ dataset, columnTypes }: ClusteringTabProps) {
  // Show PCA + KMeans tools only if >2 numeric variables
  if (columnTypes.numeric.length <= 2) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Insufficient Variables for Clustering</h3>
            <p className="text-sm">
              AI has disabled clustering analysis for this dataset. At least 3 numeric variables are required for
              meaningful clustering.
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
            <Layers className="h-12 w-12 mx-auto mb-4 text-indigo-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Clustering Analysis</h3>
            <p className="text-sm">
              PCA and K-Means clustering tools will be available here. Detected {columnTypes.numeric.length} numeric
              variables suitable for clustering.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
