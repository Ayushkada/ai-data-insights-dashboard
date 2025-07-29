import { Accordion } from "@/components/accordion"
import { OutlierDetection } from "@/components/outlier-detection"

export default function OutliersPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Outlier Detection</h2>

      <div className="space-y-4">
        <Accordion title="Z-Score Method" defaultOpen>
          <OutlierDetection
            method="z-score"
            datasetId={params.id}
            description="Identify outliers using Z-score threshold (typically > 3 or < -3)."
          />
        </Accordion>

        <Accordion title="Interquartile Range (IQR)">
          <OutlierDetection
            method="iqr"
            datasetId={params.id}
            description="Detect outliers using the IQR method (Q1 - 1.5*IQR, Q3 + 1.5*IQR)."
          />
        </Accordion>

        <Accordion title="Isolation Forest">
          <OutlierDetection
            method="isolation-forest"
            datasetId={params.id}
            description="Machine learning approach for anomaly detection."
          />
        </Accordion>
      </div>
    </div>
  )
}
