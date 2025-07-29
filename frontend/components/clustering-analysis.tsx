"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataset } from "@/lib/data-context"
import { AIInsightCard } from "@/components/ai-insight-card"

interface ClusteringAnalysisProps {
  type: "kmeans"
  datasetId: string
  description: string
}

export function ClusteringAnalysis({ type, datasetId, description }: ClusteringAnalysisProps) {
  const { getDataset } = useDataset()
  const dataset = getDataset(datasetId)
  const [numClusters, setNumClusters] = useState("3")
  const [showResult, setShowResult] = useState(false)

  if (!dataset) return null

  const handleRunClustering = () => {
    setShowResult(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Number of Clusters</Label>
          <Select value={numClusters} onValueChange={setNumClusters}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} clusters
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleRunClustering}>Run K-Means Clustering</Button>

      {showResult && (
        <div className="space-y-4">
          <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            PCA scatter plot with cluster colors placeholder
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">Clustering Results</h4>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Number of Clusters:</span> {numClusters}
              </div>
              <div>
                <span className="font-medium">Silhouette Score:</span> 0.72
              </div>
              <div>
                <span className="font-medium">Inertia:</span> 1,234.56
              </div>
            </div>
          </div>

          <AIInsightCard>
            The K-means clustering with {numClusters} clusters shows good separation (Silhouette Score: 0.72). Cluster 1
            represents high-value customers, Cluster 2 shows moderate engagement, and Cluster 3 indicates potential
            churn risk. Consider targeted strategies for each cluster.
          </AIInsightCard>
        </div>
      )}
    </div>
  )
}
