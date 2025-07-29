import { Accordion } from "@/components/accordion"
import { ChartGenerator } from "@/components/chart-generator"

export default function ChartsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Charts & Visualizations</h2>

      <div className="space-y-4">
        <Accordion title="Histogram Generator" defaultOpen>
          <ChartGenerator
            type="histogram"
            datasetId={params.id}
            description="Generate histograms to visualize the distribution of numerical variables."
          />
        </Accordion>

        <Accordion title="Boxplot Comparison">
          <ChartGenerator
            type="boxplot"
            datasetId={params.id}
            description="Compare distributions across different categories using boxplots."
          />
        </Accordion>

        <Accordion title="Correlation Heatmap">
          <ChartGenerator
            type="heatmap"
            datasetId={params.id}
            description="Visualize correlations between numerical variables."
          />
        </Accordion>
      </div>
    </div>
  )
}
