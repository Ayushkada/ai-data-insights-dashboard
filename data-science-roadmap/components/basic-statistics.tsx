"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Calculator, BarChart3, PieChart } from "lucide-react"

interface BasicStatisticsProps {
  data: Record<string, any>[]
}

export function BasicStatistics({ data }: BasicStatisticsProps) {
  // Calculate basic statistics for numeric columns
  const getNumericColumns = () => {
    if (data.length === 0) return []
    return Object.keys(data[0]).filter((key) => typeof data[0][key] === "number")
  }

  const calculateStats = (column: string) => {
    const values = data.map((row) => Number(row[column])).filter((val) => !isNaN(val))
    const sorted = values.sort((a, b) => a - b)
    const sum = values.reduce((acc, val) => acc + val, 0)
    const mean = sum / values.length
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)

    return {
      column,
      count: values.length,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      std: std.toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
    }
  }

  const numericColumns = getNumericColumns()
  const statistics = numericColumns.map(calculateStats)

  // Prepare chart data
  const chartData = data.slice(0, 10).map((row, index) => ({
    index: index + 1,
    ...Object.fromEntries(numericColumns.map((col) => [col, Number(row[col])])),
  }))

  return (
    <div className="space-y-6" id="basic-stats">
      {/* Summary Statistics Card */}
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Calculator className="h-5 w-5 text-indigo-600" />
            Summary Statistics
          </CardTitle>
          <CardDescription className="text-gray-600">
            Basic statistical measures for numeric columns in your dataset
          </CardDescription>
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
                  <TableHead className="font-semibold text-left text-gray-900 p-4">Std Dev</TableHead>
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
                    <TableCell className="text-gray-700 p-4">{stat.std}</TableCell>
                    <TableCell className="text-gray-700 p-4">{stat.min}</TableCell>
                    <TableCell className="text-gray-700 p-4">{stat.max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Card with Tabs */}
      {numericColumns.length > 0 && (
        <Card className="bg-white rounded-2xl shadow-md border-0">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Data Visualization
            </CardTitle>
            <CardDescription className="text-gray-600">
              Interactive charts showing your data patterns and trends
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Tabs defaultValue="bar" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="line" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Line Chart
                </TabsTrigger>
                <TabsTrigger value="distribution" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bar" className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Data Distribution</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="index" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      {numericColumns.slice(0, 3).map((column, index) => (
                        <Bar
                          key={column}
                          dataKey={column}
                          fill={`hsl(${220 + index * 30}, 70%, 50%)`}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="line" className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Trend Analysis</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="index" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      {numericColumns.slice(0, 3).map((column, index) => (
                        <Line
                          key={column}
                          type="monotone"
                          dataKey={column}
                          stroke={`hsl(${220 + index * 30}, 70%, 50%)`}
                          strokeWidth={3}
                          dot={{ fill: `hsl(${220 + index * 30}, 70%, 50%)`, strokeWidth: 2, r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Statistical Distribution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {statistics.slice(0, 4).map((stat, index) => (
                      <div key={stat.column} className="bg-white p-4 rounded-lg border border-gray-100">
                        <h5 className="font-medium text-gray-900 mb-2">{stat.column}</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mean:</span>
                            <span className="font-medium">{stat.mean}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Std Dev:</span>
                            <span className="font-medium">{stat.std}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Range:</span>
                            <span className="font-medium">
                              {stat.min} - {stat.max}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* AI Insights Card */}
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold text-gray-900">AI-Generated Insights</CardTitle>
          <CardDescription className="text-gray-600">
            Automated analysis of your data trends and patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900 mb-2">Key Findings</h4>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  Your dataset contains {data.length} records with {numericColumns.length} numeric variables.
                  {statistics.length > 0 && (
                    <>
                      {" "}
                      The variable "{statistics[0].column}" shows a mean of {statistics[0].mean} with a standard
                      deviation of {statistics[0].std}, indicating{" "}
                      {Number(statistics[0].std) / Number(statistics[0].mean) < 0.5 ? "low" : "moderate"} variability.
                    </>
                  )}{" "}
                  Consider exploring correlations between variables and checking for outliers in your analysis.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
