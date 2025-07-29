// upload.api.ts

import type { DatasetMeta, UrlUploadResponse, DatasetSummary, DatasetFullResponse } from "./types"
import { baseFetch } from "@/app/common/baseFetch.api"

// Get all datasets in global uploads directory
export async function getAllUploads(): Promise<DatasetMeta[]> {
  try {
    const data = await baseFetch<{datasets: DatasetMeta[]}>("/api/upload/summary")
    return data.datasets || []
  } catch (err: any) {
    throw new Error(`Failed to fetch uploads: ${err.message}`)
  }
}

// Upload new dataset file to session
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
    throw new Error(`Upload failed: ${err.message}`)
  }
}

// Upload by public URL
export async function uploadDatasetByUrl(url: string, title?: string): Promise<UrlUploadResponse> {
  const formData = new FormData()
  formData.append("mode", "link")
  formData.append("url", url)
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
    throw new Error(`URL upload failed: ${err.message}`)
  }
}

// Select an existing dataset from uploads folder into session
export async function selectDataset(filename: string, title?: string): Promise<UrlUploadResponse> {
  const formData = new FormData()
  formData.append("mode", "select")
  formData.append("filename", filename)
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
    throw new Error(`Dataset selection failed: ${err.message}`)
  }
}

// Get all datasets in the current session (Redis)
export async function getSessionDatasets(): Promise<DatasetMeta[]> {
  try {
    const data = await baseFetch<{datasets: DatasetMeta[]}>("/api/upload/session-datasets")
    return data.datasets || []
  } catch (err: any) {
    throw new Error(`Failed to fetch session datasets: ${err.message}`)
  }
}

// Get full dataset info (meta, preview, analyses, first 500 rows) for a session dataset
export async function getSessionDatasetFull(datasetId: string): Promise<DatasetFullResponse> {
  try {
    return await baseFetch<DatasetFullResponse>(`/api/upload/session-dataset/${datasetId}/full`)
  } catch (err: any) {
    throw err.message
  }
}

// Remove a dataset from the session
export async function removeSessionDataset(id: string): Promise<{status: string}> {
  try {
    return baseFetch<{status: string}>("/api/upload/remove-session-dataset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
  } catch (err: any) {
    throw new Error(`Failed to remove dataset: ${err.message}`)
  }
}

// Save a session dataset to uploads (disk)
export async function saveSessionDatasetToUploads(datasetId: string, title?: string): Promise<DatasetSummary> {
  const formData = new FormData()
  formData.append("dataset_id", datasetId)
  if (title) formData.append("title", title)
  try {
    const data = await baseFetch<DatasetSummary>("/api/upload/session-to-uploads", {
      method: "POST",
      body: formData,
    })
    return data
  } catch (err: any) {
    if (err?.status === 409) {
      throw new Error("A dataset with the same name already exists in uploads.")
    }
    throw new Error(`Failed to save dataset to uploads: ${err.message}`)
  }
}
