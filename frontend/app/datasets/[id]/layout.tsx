import type { ReactNode } from "react"
import { DatasetHeader } from "@/components/dataset-header"
import { TabBar } from "@/components/tab-bar"
import { DashboardDataProvider } from "@/lib/data-provider"

export default function DatasetLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { id: string }
}) {
  return (
    <DashboardDataProvider datasetId={params.id}>
      <div className="min-h-screen bg-background flex flex-col">
        <DatasetHeader datasetId={params.id} />
        <TabBar datasetId={params.id} />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      </div>
    </DashboardDataProvider>
  )
}
