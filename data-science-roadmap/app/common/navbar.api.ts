import type { DatasetTab } from "./types"
import { baseFetch } from "@/app/common/baseFetch.api"

export async function getSessionDatasets(): Promise<DatasetTab[]> {
  const data = await baseFetch<{datasets: DatasetTab[]}>("/api/upload/session-datasets")
  return (data.datasets || []).map((d: any) => ({ id: d.id, title: d.title }))
} 