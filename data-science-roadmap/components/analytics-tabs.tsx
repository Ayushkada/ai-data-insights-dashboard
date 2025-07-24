"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/tabs/overview-tab"
import { ChartsTab } from "@/components/tabs/charts-tab"
import { StatisticalTestsTab } from "@/components/tabs/statistical-tests-tab"
import { OutliersTab } from "@/components/tabs/outliers-tab"
import { TimeSeriesTab } from "@/components/tabs/time-series-tab"
import { ClusteringTab } from "@/components/tabs/clustering-tab"
import { TextNLPTab } from "@/components/tabs/text-nlp-tab"
import { PredictiveModelingTab } from "@/components/tabs/predictive-modeling-tab"
import type { Dataset } from "@/components/data-provider"
import { BarChart3, TrendingUp, TestTube, AlertTriangle, Clock, Layers, MessageSquare, Brain } from "lucide-react"

interface AnalyticsTabsProps {
  dataset: Dataset
}

export function AnalyticsTabs({ dataset }: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Analyze dataset metadata
  const getColumnTypes = () => {
    if (dataset.data.length === 0) return { numeric: [], categorical: [], datetime: [], text: [] }

    const sample = dataset.data[0]
    const numeric: string[] = []
    const categorical: string[] = []
    const datetime: string[] = []
    const text: string[] = []

    Object.entries(sample).forEach(([key, value]) => {
      if (typeof value === "number") {
        numeric.push(key)
      } else if (typeof value === "string") {
        // Simple heuristics for column type detection
        if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time")) {
          datetime.push(key)
        } else if (value.length > 50) {
          text.push(key)
        } else {
          categorical.push(key)
        }
      }
    })

    return { numeric, categorical, datetime, text }
  }

  const columnTypes = getColumnTypes()

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3, enabled: true },
    { id: "charts", label: "Charts", icon: TrendingUp, enabled: columnTypes.numeric.length > 0 },
    {
      id: "statistical",
      label: "Statistical Tests",
      icon: TestTube,
      enabled: columnTypes.numeric.length > 1 || columnTypes.categorical.length > 0,
    },
    { id: "outliers", label: "Outliers", icon: AlertTriangle, enabled: columnTypes.numeric.length > 0 },
    {
      id: "timeseries",
      label: "Time Series",
      icon: Clock,
      enabled: columnTypes.datetime.length > 0 && columnTypes.numeric.length > 0,
    },
    { id: "clustering", label: "Clustering", icon: Layers, enabled: columnTypes.numeric.length > 2 },
    { id: "nlp", label: "Text/NLP", icon: MessageSquare, enabled: columnTypes.text.length > 0 },
    { id: "predictive", label: "Predictive Modeling", icon: Brain, enabled: columnTypes.numeric.length > 1 },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full bg-gray-50 rounded-xl shadow-sm p-4 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={!tab.enabled}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
                ${!tab.enabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <ChartsTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="statistical" className="space-y-6">
            <StatisticalTestsTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="outliers" className="space-y-6">
            <OutliersTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="timeseries" className="space-y-6">
            <TimeSeriesTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="clustering" className="space-y-6">
            <ClusteringTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="nlp" className="space-y-6">
            <TextNLPTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveModelingTab dataset={dataset} columnTypes={columnTypes} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
