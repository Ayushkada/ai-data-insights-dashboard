// types.ts

export interface AnalysisRequest {
    dataset_id: string
  }
  
  // Basic stats
  export interface BasicStatsResponse {
    stats: Record<string, any>
    gpt_summary?: string
  }
  
  // Skewness & Kurtosis
  export interface SkewKurtosisResponse {
    skewness: Record<string, number>
    kurtosis: Record<string, number>
  }
  
  // Correlation
  export interface CorrelationResponse {
    pearson: Record<string, Record<string, number>>
    spearman: Record<string, Record<string, number>>
    cramers_v: Record<string, number | null>
    top_pearson_pairs: [string, string, number][]
  }
  
  // Generic message type (for TODO/placeholder endpoints)
  export interface AnalysisMessageResponse {
    message: string
  }
  