import type { DatasetMeta, UrlUploadResponse } from "./types"
import { baseFetch } from "@/app/common/baseFetch.api"

export async function getAllUploads(): Promise<DatasetMeta[]> {
  const data = await baseFetch<{datasets: DatasetMeta[]}>("/api/upload/summary")
  return data.datasets || []
}

export async function uploadDataset(file: File, title?: string): Promise<UrlUploadResponse> {
  const formData = new FormData()
  formData.append("mode", "upload")
  formData.append("file", file)
  if (title) formData.append("title", title)
  try {
    return await baseFetch<UrlUploadResponse>("/api/upload/session-file", {
      method: "POST",
      body: formData,
    })
  } catch (err: any) {
    if (err?.status === 409) {
      throw new Error("A dataset with the same content or title already exists in your session.")
    }
    throw err
  }
}

export async function uploadDatasetByUrl(url: string): Promise<UrlUploadResponse> {
  const formData = new FormData()
  formData.append("mode", "link")
  formData.append("url", url)
  try {
    return await baseFetch<UrlUploadResponse>("/api/upload/session-file", {
      method: "POST",
      body: formData,
    })
  } catch (err: any) {
    if (err?.status === 409) {
      throw new Error("A dataset with the same content or title already exists in your session.")
    }
    throw err
  }
}

export async function selectDataset(filename: string): Promise<UrlUploadResponse> {
  const formData = new FormData()
  formData.append("mode", "select")
  formData.append("filename", filename)
  try {
    return await baseFetch<UrlUploadResponse>("/api/upload/session-file", {
      method: "POST",
      body: formData,
    })
  } catch (err: any) {
    if (err?.status === 409) {
      throw new Error("A dataset with the same content or title already exists in your session.")
    }
    throw err
  }
}

export async function removeSessionDataset(id: string): Promise<{status: string}> {
  return baseFetch<{status: string}>("/api/upload/remove-session-dataset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
}
