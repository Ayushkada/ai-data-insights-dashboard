import { DatasetMeta } from "../upload/types";
import type { DatasetTab } from "./types"
import { baseFetch } from "@/app/common/baseFetch.api"

export async function getSessionTabs(): Promise<DatasetTab[]> {
  const data = await baseFetch<{datasets: DatasetTab[]}>("/api/upload/session-datasets")
  return (data.datasets || []).map((d: any) => ({ id: d.id, title: d.title }))
} 

export async function getSessionDatasets(): Promise<DatasetMeta[]> {
  const data = await baseFetch<{datasets: DatasetMeta[]}>("/api/upload/session-datasets");
  return data.datasets || [];
}   