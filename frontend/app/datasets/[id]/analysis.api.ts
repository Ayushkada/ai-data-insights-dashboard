// analysis.api.ts

import type {
    AnalysisRequest,
    BasicStatsResponse,
    SkewKurtosisResponse,
    CorrelationResponse,
    AnalysisMessageResponse,
  } from "./types"
  import { baseFetch } from "@/app/common/baseFetch.api"
  
  // --- Placeholder endpoints ---
  export async function analyzeStatistics(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/statistics", { method: "POST" })
  }
  
  export async function analyzeHypothesis(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/hypothesis", { method: "POST" })
  }
  
  export async function analyzeOutliers(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/outliers", { method: "POST" })
  }
  
  export async function analyzeTimeseries(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/timeseries", { method: "POST" })
  }
  
  export async function analyzeClustering(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/clustering", { method: "POST" })
  }
  
  export async function analyzeSentiment(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/sentiment", { method: "POST" })
  }
  
  export async function analyzeAutoML(): Promise<AnalysisMessageResponse> {
    return baseFetch<AnalysisMessageResponse>("/api/statistics/automl", { method: "POST" })
  }
  
  // --- Implemented endpoints ---
  export async function analyzeBasicStats(dataset_id: string): Promise<BasicStatsResponse> {
    return baseFetch<BasicStatsResponse>("/api/statistics/basic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset_id }),
    })
  }
  
  export async function analyzeSkewnessKurtosis(dataset_id: string): Promise<SkewKurtosisResponse> {
    return baseFetch<SkewKurtosisResponse>("/api/statistics/skewness-kurtosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataset_id),
    })
  }
  
  export async function analyzeCorrelation(dataset_id: string): Promise<CorrelationResponse> {
    return baseFetch<CorrelationResponse>("/api/statistics/correlation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataset_id),
    })
  }
  