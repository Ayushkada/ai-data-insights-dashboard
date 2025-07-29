"use client"

import { useEffect, useState } from "react"
import { DatasetFullResponse, getSessionDatasetFull } from "@/app/upload/upload.api"
import { DatasetMeta } from "@/app/upload/types"

interface PrimaryTabProps {
  meta: DatasetMeta
  data: {
    columns: string[]
    rows: Record<string, any>[]
  }
  analyses: Record<string, any>
}

function PrimaryTab({ meta, data, analyses }: PrimaryTabProps) {
  const stats = analyses?.basic_stats?.stats
  const gptSummary = analyses?.basic_stats?.gpt_summary

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Dataset Overview</h2>
        <div className="mb-2 text-muted-foreground">
          <span className="mr-4">Title: <b>{meta?.title || meta?.filename}</b></span>
          <span className="mr-4">Rows: <b>{meta?.num_rows}</b></span>
          <span className="mr-4">Columns: <b>{meta?.columns?.length}</b></span>
        </div>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-[600px] text-sm">
            <thead>
              <tr>
                {data.columns.map((col) => (
                  <th key={col} className="px-2 py-1 border-b font-semibold text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {data.columns.map((col) => (
                    <td key={col} className="px-2 py-1 border-b">{String(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Basic Statistics</h2>
        {stats ? (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-[400px] text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 border-b font-semibold text-left">Metric</th>
                  {Object.keys(stats.describe || {}).map((col) => (
                    <th key={col} className="px-2 py-1 border-b font-semibold text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.describe || {}).length > 0 &&
                  Object.keys(stats.describe[Object.keys(stats.describe)[0]] || {}).map((metric) => (
                    <tr key={metric}>
                      <td className="px-2 py-1 border-b font-medium">{metric}</td>
                      {Object.keys(stats.describe).map((col) => (
                        <td key={col} className="px-2 py-1 border-b">
                          {String(stats.describe[col][metric] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No stats available yet.</p>
        )}
      </section>
      {gptSummary && (
        <section>
          <h2 className="text-xl font-semibold mb-2">AI Data Summary</h2>
          <div className="bg-muted rounded-lg p-4 text-base">{gptSummary}</div>
        </section>
      )}
    </div>
  )
}

export default function OverviewTabPage({ params }: { params: { id: string } }) {
  const datasetId = params.id
  const [full, setFull] = useState<DatasetFullResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const resp = await getSessionDatasetFull(datasetId)
      setFull(resp)
      setLoading(false)
    }
    fetchData()
  }, [datasetId])

  if (loading) return <div>Loading...</div>
  if (!full) return <div>Error loading dataset.</div>

  return <PrimaryTab meta={full.meta} data={full.data} analyses={full.analyses} />
}
