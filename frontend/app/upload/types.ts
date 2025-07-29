// types.ts

export interface FilePreview {
    columns: string[]
    sample_rows: Record<string, any>[]
  }
  
  export interface DatasetMeta {
    id: string
    filename: string
    title?: string
    summary?: string
    columns?: string[]
    size?: number
    created_at?: string
    preview?: FilePreview
    num_rows?: number
    hash?: string    // Optional: add if you want to expose it
  }
  
  export interface UrlUploadResponse {
    id: string  
    filename: string
    size: number
    mime_type: string
    preview?: FilePreview
    message?: string
  }
  
  export interface DatasetSummary {
    filename: string
    title?: string
    summary?: string
    columns?: string[]
    size?: number
    preview?: FilePreview
    num_rows?: number
    created_at?: string
  }
  
  export type UploadMode = "upload" | "link" | "select"
  