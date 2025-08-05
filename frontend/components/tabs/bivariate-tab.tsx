"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScatterChartIcon as Scatter3D, TrendingUp, Activity, BarChart3 } from "lucide-react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

const scatterData = [
  { age: 25, salary: 45000, department: "Engineering" },
  { age: 28, salary: 52000, department: "Marketing" },
  { age: 32, salary: 68000, department: "Engineering" },
  { age: 29, salary: 55000, department: "Design" },
  { age: 35, salary: 75000, department: "Sales" },
  { age: 42, salary: 85000, department: "Engineering" },
  { age: 38, salary: 72000, department: "Marketing" },
  { age: 31, salary: 61000, department: "Design" },
  { age: 45, salary: 95000, department: "Sales" },
  { age: 27, salary: 48000, department: "Marketing" },
  { age: 33, salary: 65000, department: "Engineering" },
  { age: 40, salary: 78000, department: "Sales" },
  { age: 26, salary: 46000, department: "Design" },
  { age: 37, salary: 71000, department: "Engineering" },
  { age: 44, salary: 88000, department: "Sales" },
]

const correlationData = [
  { var1: "Age", var2: "Salary", correlation: 0.78, strength: "Strong" },
  { var1: "Age", var2: "Experience", correlation: 0.85, strength: "Very Strong" },
  { var1: "Salary", var2: "Experience", correlation: 0.72, strength: "Strong" },
  { var1: "Age", var2: "Department", correlation: 0.23, strength: "Weak" },
  { var1: "Salary", var2: "City", correlation: 0.31, strength: "Weak" },
]

const getCorrelationColor = (correlation: number) => {
  const abs = Math.abs(correlation)
  if (abs >= 0.7) return "text-red-600 dark:text-red-400"
  if (abs >= 0.5) return "text-orange-600 dark:text-orange-400"
  if (abs >= 0.3) return "text-yellow-600 dark:text-yellow-400"
  return "text-green-600 dark:text-green-400"
}

const getDepartmentColor = (department: string) => {
  const colors = {
    Engineering: "#6366f1",
    Marketing: "#06b6d4",
    Design: "#8b5cf6",
    Sales: "#10b981",
  }
  return colors[department as keyof typeof colors] || "#6b7280"
}

export function BivariateTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Bivariate Analysis</h2>
          <p className="text-muted-foreground">Explore relationships between two variables</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="age-salary">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select variable pair" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age-salary">Age vs Salary</SelectItem>
              <SelectItem value="age-experience">Age vs Experience</SelectItem>
              <SelectItem value="salary-experience">Salary vs Experience</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="hover-glow bg-transparent">
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Correlation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Correlation</p>
                <p className="text-3xl font-bold text-gradient-primary">0.78</p>
                <p className="text-xs text-red-600 dark:text-red-400">Strong positive</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">R-squared</p>
                <p className="text-3xl font-bold text-gradient-primary">0.61</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">61% variance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">P-value</p>
                <p className="text-3xl font-bold text-gradient-primary">{"<0.001"}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Significant</p>
              </div>
              <Scatter3D className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample Size</p>
                <p className="text-3xl font-bold text-gradient-primary">15.4K</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">data points</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scatter Plot */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scatter3D className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Age vs Salary Scatter Plot
          </CardTitle>
          <CardDescription>Relationship between employee age and salary by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              salary: {
                label: "Salary",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  dataKey="age"
                  name="Age"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="salary"
                  name="Salary"
                  domain={["dataMin - 5000", "dataMax + 5000"]}
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.department}</p>
                          <p className="text-sm text-muted-foreground">Age: {data.age} years</p>
                          <p className="text-sm text-muted-foreground">Salary: ${data.salary.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter name="Employees" data={scatterData} fill="#6366f1">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getDepartmentColor(entry.department)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Engineering
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">Marketing</Badge>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Design</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Sales
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Matrix */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Correlation Analysis
          </CardTitle>
          <CardDescription>Correlation coefficients between variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlationData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">
                    {item.var1} × {item.var2}
                  </div>
                  <Badge variant="outline" className={getCorrelationColor(item.correlation)}>
                    {item.strength}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getCorrelationColor(item.correlation)}`}>
                    {item.correlation > 0 ? "+" : ""}
                    {item.correlation.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
