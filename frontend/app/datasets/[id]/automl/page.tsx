import { AutoMLAnalysis } from "@/components/automl-analysis"

export default function AutoMLPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AutoML</h2>
      <p className="text-muted-foreground">Automatically build and compare machine learning models for your dataset.</p>

      <AutoMLAnalysis datasetId={params.id} />
    </div>
  )
}
