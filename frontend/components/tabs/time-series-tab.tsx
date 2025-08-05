"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, TrendingUp, Activity, Calendar } from "lucide-react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

const timeSeriesData = [
  { month: "Jan 2023", value: 45000, trend: 44800, forecast: null, employees: 1200 },
  { month: "Feb 2023", value: 47200, trend: 46100, forecast: null, employees: 1250 },
  { month: "Mar 2023", value: 48500, trend: 47400, forecast: null, employees: 1280 },
  { month: "Apr 2023", value: 46800, trend: 48700, forecast: null, employees: 1290 },
  { month: "May 2023", value: 50200, trend: 50000, forecast: null, employees: 1320 },
  { month: "Jun 2023", value: 52100, trend: 51300, forecast: null, employees: 1350 },
  { month: "Jul 2023", value: 53800, trend: 52600, forecast: null, employees: 1380 },
  { month: "Aug 2023", value: 51900, trend: 53900, forecast: null, employees: 1400 },
  { month: "Sep 2023", value: 55600, trend: 55200, forecast: null, employees: 1420 },
  { month: "Oct 2023", value: 57200, trend: 56500, forecast: null, employees: 1450 },
  { month: "Nov 2023", value: 58900, trend: 57800, forecast: null, employees: 1480 },
  { month: "Dec 2023", value: 60500, trend: 59100, forecast: null, employees: 1500 },
  { month: "Jan 2024", value: null, trend: null, forecast: 61800, employees: null },
  { month: "Feb 2024", value: null, trend: null, forecast: 63200, employees: null },
  { month: "Mar 2024", value: null, trend: null, forecast: 64600, employees: null },
  { month: "Apr 2024", value: null, trend: null, forecast: 66000, employees: null },
]

const seasonalityData = [
  { quarter: "Q1", avgValue: 47233, variance: 1850 },
  { quarter: "Q2", avgValue: 49700, variance: 2100 },
  { quarter: "Q3", avgValue: 53767, variance: 1950 },
  { quarter: "Q4", avgValue: 58867, variance: 1200 },
]

const forecastMetrics = [
  { metric: "MAPE", value: "3.2%", description: "Mean Absolute Percentage Error" },
  { metric: "RMSE", value: "1,847", description: "Root Mean Square Error" },
  { metric: "MAE", value: "1,234", description: "Mean Absolute Error" },
  { metric: "R²", value: "0.94", description: "Coefficient of Determination" },
]

export function TimeSeriesTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Time Series Analysis</h2>
          <p className="text-muted-foreground">Analyze temporal patterns and forecast future trends</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="salary-trends">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salary-trends">Salary Trends</SelectItem>
              <SelectItem value="employee-count">Employee Count</SelectItem>
              <SelectItem value="department-growth">Department Growth</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow">
            Generate Forecast
          </Button>
        </div>
      </div>

      {/* Time Series Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                <p className="text-3xl font-bold text-gradient-primary">$60.5K</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">+2.7% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Forecast (Apr 2024)</p>
                <p className="text-3xl font-bold text-gradient-primary">$66.0K</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">+9.1% projected growth</p>
              </div>
              <Activity className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trend Direction</p>
                <p className="text-3xl font-bold text-gradient-primary">↗</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Strong upward trend</p>
              </div>
              <LineChart className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Seasonality</p>
                <p className="text-3xl font-bold text-gradient-primary">Q4</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Peak season</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Average Salary Trends & Forecast
          </CardTitle>
          <CardDescription>Historical data with trend line and future predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Actual",
                color: "hsl(var(--chart-1))",
              },
              trend: {
                label: "Trend",
                color: "hsl(var(--chart-2))",
              },
              forecast: {
                label: "Forecast",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: ${entry.value?.toLocaleString()}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="var(--color-trend)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-forecast)"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Actual Values
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">Trend Line</Badge>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Forecast</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonality Analysis */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Seasonal Patterns
            </CardTitle>
            <CardDescription>Quarterly trends and seasonal variations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgValue: {
                  label: "Average Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="quarter" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">Average: ${data.avgValue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Variance: ±${data.variance.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgValue"
                    stroke="var(--color-avgValue)"
                    fill="var(--color-avgValue)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Forecast Accuracy */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Forecast Accuracy
            </CardTitle>
            <CardDescription>Model performance and error metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {forecastMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.metric}</span>
                    <span className="text-2xl font-bold text-gradient-primary">{metric.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  {index < forecastMetrics.length - 1 && (
                    <div className="border-b border-gray-200 dark:border-gray-700 mt-4" />
                  )}
                </div>
              ))}

              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Model Performance</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Excellent forecast accuracy with low error rates across all metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
