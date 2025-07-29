import { Accordion } from "@/components/accordion"
import { ClusteringAnalysis } from "@/components/clustering-analysis"
import { useDataset } from "@/lib/data-context"

export default function ClusteringPage({ params }: { params: { id: string } }) {
  const { getDataset } = useDataset()
  const dataset = getDataset(params.id)

  // Check if dataset has at least 2 numeric columns
  const numericColumns = dataset?.columns.filter((col) => col.type === "numeric").length || 0

  if (numericColumns < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">At least 2 numeric columns required for clustering analysis.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Clustering Analysis</h2>

      <div className="space-y-4">
        <Accordion title="PCA + K-Means Clustering" defaultOpen>
          <ClusteringAnalysis
            type="kmeans"
            datasetId={params.id}
            description="Perform dimensionality reduction with PCA and cluster using K-Means."
          />
        </Accordion>
      </div>
    </div>
  )
}
