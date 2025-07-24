export type UploadMode = "upload" | "link" | "select"

export interface DatasetMeta {
  id?: string
  filename: string
  title?: string
  summary?: string
  columns?: string[]
  size?: number
  created_at?: string
  preview?: FilePreview
  num_rows?: number
}

export interface FilePreview {
  columns: string[]
  sample_rows: Record<string, any>[]
}

export interface UrlUploadResponse {
  id: string  
  filename: string
  size: number
  mime_type: string
  preview?: FilePreview
  message?: string
}
