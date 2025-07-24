"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from "recharts"
import { BarChart3, TrendingUp, ScatterChartIcon as ScatterIcon } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface ChartsTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function ChartsTab({ dataset, columnTypes }: ChartsTabProps) {
  const [selectedCharts, setSelectedCharts] = useState<Record<string, any>>({})
  const [chartResults, setChartResults] = useState<Record<string, any>>({})

  // Show if numeric columns exist
  if (columnTypes.numeric.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Numeric Data Available</h3>
            <p className="text-sm">
              AI has disabled chart analysis for this dataset. Numeric columns are required for visualization.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmitChart = (chartType: string) => {
    const params = selectedCharts[chartType]
    if (!params) return

    // Prepare chart data based on selected parameters
    const chartData = dataset.data.slice(0, 20).map((row, index) => ({
      index: index + 1,
      ...Object.fromEntries(
        Object.entries(row).filter(
          ([key]) => params.variables?.includes(key) || key === params.xAxis || key === params.yAxis,
        ),
      ),
    }))

    setChartResults((prev) => ({
      ...prev,
      [chartType]: { data: chartData, params },
    }))
  }

  const updateChartParams = (chartType: string, updates: any) => {
    setSelectedCharts((prev) => ({
      ...prev,
      [chartType]: { ...prev[chartType], ...updates },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Accordion type="multiple" className="w-full space-y-4">
        {/* Bar Chart */}
        <AccordionItem
          value="bar-chart"
          className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
        >
          <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Bar Chart</div>
                <div className="text-sm text-gray-600">Compare values across categories or time periods</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">X-Axis Variable</Label>
                <Select onValueChange={(value) => updateChartParams("bar", { xAxis: value })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select X-axis variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...columnTypes.categorical, ...columnTypes.numeric].map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Y-Axis Variable</Label>
                <Select onValueChange={(value) => updateChartParams("bar", { yAxis: value })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Y-axis variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnTypes.numeric.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => handleSubmitChart("bar")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              disabled={!selectedCharts.bar?.xAxis || !selectedCharts.bar?.yAxis}
            >
              Generate Bar Chart
            </Button>

            {chartResults.bar && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartResults.bar.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey={chartResults.bar.params.xAxis} stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey={chartResults.bar.params.yAxis} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-blue-800">
                    The bar chart shows the relationship between {chartResults.bar.params.xAxis} and{" "}
                    {chartResults.bar.params.yAxis}. This visualization helps identify patterns and compare values
                    across different categories.
                  </p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Line Chart */}
        <AccordionItem
          value="line-chart"
          className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
        >
          <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Line Chart</div>
                <div className="text-sm text-gray-600">
                  Visualize trends and changes over time or continuous variables
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">X-Axis Variable</Label>
                <Select onValueChange={(value) => updateChartParams("line", { xAxis: value })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select X-axis variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...columnTypes.numeric, ...columnTypes.datetime].map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Y-Axis Variable</Label>
                <Select onValueChange={(value) => updateChartParams("line", { yAxis: value })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Y-axis variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnTypes.numeric.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => handleSubmitChart("line")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              disabled={!selectedCharts.line?.xAxis || !selectedCharts.line?.yAxis}
            >
              Generate Line Chart
            </Button>

            {chartResults.line && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartResults.line.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey={chartResults.line.params.xAxis} stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={chartResults.line.params.yAxis}
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-green-800">
                    The line chart reveals trends in {chartResults.line.params.yAxis} across{" "}
                    {chartResults.line.params.xAxis}. Look for patterns, seasonality, or outliers that might indicate
                    important insights in your data.
                  </p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Scatter Plot */}
        {columnTypes.numeric.length > 1 && (
          <AccordionItem
            value="scatter-plot"
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
          >
            <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ScatterIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Scatter Plot</div>
                  <div className="text-sm text-gray-600">Explore correlations between two numeric variables</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">X-Axis Variable</Label>
                  <Select onValueChange={(value) => updateChartParams("scatter", { xAxis: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select X-axis variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.numeric.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Y-Axis Variable</Label>
                  <Select onValueChange={(value) => updateChartParams("scatter", { yAxis: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Y-axis variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.numeric.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleSubmitChart("scatter")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                disabled={!selectedCharts.scatter?.xAxis || !selectedCharts.scatter?.yAxis}
              >
                Generate Scatter Plot
              </Button>

              {chartResults.scatter && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart data={chartResults.scatter.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey={chartResults.scatter.params.xAxis} stroke="#6b7280" />
                        <YAxis dataKey={chartResults.scatter.params.yAxis} stroke="#6b7280" />
                        <Tooltip />
                        <Scatter dataKey={chartResults.scatter.params.yAxis} fill="#8b5cf6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">AI Analysis</h4>
                    <p className="text-sm text-purple-800">
                      The scatter plot shows the relationship between {chartResults.scatter.params.xAxis} and{" "}
                      {chartResults.scatter.params.yAxis}. Look for linear relationships, clusters, or outliers that
                      might indicate correlations or anomalies in your data.
                    </p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
