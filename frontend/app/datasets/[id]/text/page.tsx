import { Accordion } from "@/components/accordion"
import { TextAnalysis } from "@/components/text-analysis"
import { useDataset } from "@/lib/data-context"

export default function TextPage({ params }: { params: { id: string } }) {
  const { getDataset } = useDataset()
  const dataset = getDataset(params.id)

  // Check if dataset has text columns
  const hasTextColumns = dataset?.columns.some((col) => col.type === "text")

  if (!hasTextColumns) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No text columns found in this dataset.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Text & NLP Analysis</h2>

      <div className="space-y-4">
        <Accordion title="Sentiment Analysis" defaultOpen>
          <TextAnalysis
            type="sentiment"
            datasetId={params.id}
            description="Analyze sentiment distribution in text data."
          />
        </Accordion>

        <Accordion title="Topic Modeling">
          <TextAnalysis
            type="topics"
            datasetId={params.id}
            description="Extract key topics and generate word clouds."
          />
        </Accordion>

        <Accordion title="Named Entity Recognition">
          <TextAnalysis type="ner" datasetId={params.id} description="Identify and classify named entities in text." />
        </Accordion>
      </div>
    </div>
  )
}
