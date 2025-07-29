import { Accordion } from "@/components/accordion"
import { TimeSeriesAnalysis } from "@/components/timeseries-analysis"
import { useDataset } from "@/lib/data-context"

export default function TimeSeriesPage({ params }: { params: { id: string } }) {
  const { getDataset } = useDataset()
  const dataset = getDataset(params.id)

  // Check if dataset has datetime columns
  const hasDatetimeColumns = dataset?.columns.some((col) => col.type === "datetime")

  if (!hasDatetimeColumns) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No datetime columns found in this dataset.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Time Series Analysis</h2>

      <div className="space-y-4">
        <Accordion title="Time Series Decomposition" defaultOpen>
          <TimeSeriesAnalysis
            type="decomposition"
            datasetId={params.id}
            description="Break down time series into trend, seasonal, and residual components."
          />
        </Accordion>

        <Accordion title="Stationarity Test">
          <TimeSeriesAnalysis
            type="stationarity"
            datasetId={params.id}
            description="Test if the time series is stationary using ADF test."
          />
        </Accordion>

        <Accordion title="Forecasting">
          <TimeSeriesAnalysis
            type="forecasting"
            datasetId={params.id}
            description="Generate future predictions using ARIMA or other models."
          />
        </Accordion>
      </div>
    </div>
  )
}
