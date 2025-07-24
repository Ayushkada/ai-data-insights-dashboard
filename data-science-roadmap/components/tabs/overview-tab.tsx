"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Database, Eye, BarChart3, TrendingUp } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface OverviewTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function OverviewTab({ dataset, columnTypes }: OverviewTabProps) {
  const previewData = dataset.data.slice(0, 10)

  // Calculate basic statistics for numeric columns
  const calculateStats = (column: string) => {
    const values = dataset.data.map((row) => Number(row[column])).filter((val) => !isNaN(val))
    const sum = values.reduce((acc, val) => acc + val, 0)
    const mean = sum / values.length
    const sorted = values.sort((a, b) => a - b)
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    return {
      column,
      count: values.length,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
    }
  }

  const statistics = columnTypes.numeric.map(calculateStats)

  return (
    <div className="flex flex-col gap-6">
      {/* Dataset Summary */}
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Database className="h-5 w-5 text-indigo-600" />
            Dataset Summary
          </CardTitle>
          <CardDescription className="text-gray-600">
            Overview of your dataset structure and column types
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{dataset.data.length}</div>
              <div className="text-sm text-blue-600">Total Rows</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-700">{dataset.columns.length}</div>
              <div className="text-sm text-green-600">Total Columns</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{columnTypes.numeric.length}</div>
              <div className="text-sm text-purple-600">Numeric Columns</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{columnTypes.categorical.length}</div>
              <div className="text-sm text-orange-600">Categorical Columns</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Column Types</h4>
            <div className="flex flex-wrap gap-2">
              {columnTypes.numeric.map((col) => (
                <Badge key={col} variant="secondary" className="bg-blue-100 text-blue-800">
                  {col} (numeric)
                </Badge>
              ))}
              {columnTypes.categorical.map((col) => (
                <Badge key={col} variant="secondary" className="bg-green-100 text-green-800">
                  {col} (categorical)
                </Badge>
              ))}
              {columnTypes.datetime.map((col) => (
                <Badge key={col} variant="secondary" className="bg-purple-100 text-purple-800">
                  {col} (datetime)
                </Badge>
              ))}
              {columnTypes.text.map((col) => (
                <Badge key={col} variant="secondary" className="bg-orange-100 text-orange-800">
                  {col} (text)
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Eye className="h-5 w-5 text-indigo-600" />
            Data Preview
          </CardTitle>
          <CardDescription className="text-gray-600">First 10 rows of your dataset</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ScrollArea className="h-96 w-full rounded-lg border border-gray-200">
            <Table className="table-auto">
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow className="border-b border-gray-200">
                  {dataset.columns.map((column) => (
                    <TableHead key={column} className="font-semibold text-left text-gray-900 p-4">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    {dataset.columns.map((column) => (
                      <TableCell key={column} className="font-mono text-sm text-gray-700 p-4">
                        {String(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Statistics */}
      {statistics.length > 0 && (
        <Card className="bg-white rounded-2xl shadow-md border-0">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Quick Statistics
            </CardTitle>
            <CardDescription className="text-gray-600">Basic statistics for numeric columns</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="overflow-x-auto">
              <Table className="table-auto">
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Column</TableHead>
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Count</TableHead>
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Mean</TableHead>
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Median</TableHead>
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Min</TableHead>
                    <TableHead className="font-semibold text-left text-gray-900 p-4">Max</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                  {statistics.map((stat) => (
                    <TableRow key={stat.column} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900 p-4">{stat.column}</TableCell>
                      <TableCell className="text-gray-700 p-4">{stat.count}</TableCell>
                      <TableCell className="text-gray-700 p-4">{stat.mean}</TableCell>
                      <TableCell className="text-gray-700 p-4">{stat.median}</TableCell>
                      <TableCell className="text-gray-700 p-4">{stat.min}</TableCell>
                      <TableCell className="text-gray-700 p-4">{stat.max}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription className="text-gray-600">Automated analysis of your dataset</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900 mb-2">Dataset Analysis</h4>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  Your dataset contains {dataset.data.length} records with {columnTypes.numeric.length} numeric
                  variables,
                  {columnTypes.categorical.length} categorical variables, and {columnTypes.text.length} text fields.
                  {columnTypes.datetime.length > 0 &&
                    ` Time series analysis is available with ${columnTypes.datetime.length} datetime columns.`}
                  {columnTypes.numeric.length > 2 && " Clustering analysis is recommended for pattern discovery."}
                  {columnTypes.text.length > 0 &&
                    " Text analysis tools are available for sentiment and topic modeling."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
