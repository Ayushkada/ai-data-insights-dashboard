"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Activity, Target } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const ageDistribution = [
  { range: "20-25", count: 1250, percentage: 8.1 },
  { range: "26-30", count: 3420, percentage: 22.2 },
  { range: "31-35", count: 4680, percentage: 30.4 },
  { range: "36-40", count: 3210, percentage: 20.8 },
  { range: "41-45", count: 1890, percentage: 12.3 },
  { range: "46-50", count: 970, percentage: 6.3 },
]

const salaryDistribution = [
  { range: "$40K-$50K", count: 890, percentage: 5.8 },
  { range: "$50K-$60K", count: 2340, percentage: 15.2 },
  { range: "$60K-$70K", count: 3450, percentage: 22.4 },
  { range: "$70K-$80K", count: 4120, percentage: 26.7 },
  { range: "$80K-$90K", count: 2890, percentage: 18.7 },
  { range: "$90K-$100K", count: 1730, percentage: 11.2 },
]

export function UnivariateTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Univariate Analysis</h2>
          <p className="text-muted-foreground">Explore individual variables and their distributions</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="age">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="city">City</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="hover-glow bg-transparent">
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mean Age</p>
                <p className="text-3xl font-bold text-gradient-primary">34.2</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">years</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Median Age</p>
                <p className="text-3xl font-bold text-gradient-primary">33.0</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">years</p>
              </div>
              <Target className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Std Deviation</p>
                <p className="text-3xl font-bold text-gradient-primary">8.7</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">years</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Range</p>
                <p className="text-3xl font-bold text-gradient-primary">22-58</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">years</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Age Distribution
            </CardTitle>
            <CardDescription>Frequency distribution of employee ages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="range" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Salary Distribution
            </CardTitle>
            <CardDescription>Distribution of employee salaries</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="range"
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Statistical Summary</CardTitle>
            <CardDescription>Descriptive statistics for selected variable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Count</span>
                    <span className="font-medium">15,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mean</span>
                    <span className="font-medium">34.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Median</span>
                    <span className="font-medium">33.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mode</span>
                    <span className="font-medium">32.0</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Std Dev</span>
                    <span className="font-medium">8.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    <span className="font-medium">75.69</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Skewness</span>
                    <span className="font-medium">0.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kurtosis</span>
                    <span className="font-medium">-0.45</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Percentiles</CardTitle>
            <CardDescription>Quartile and percentile breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Min (0%)</span>
                  <Badge variant="outline">22</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Q1 (25%)</span>
                  <Badge variant="outline">28</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Q2 (50%)</span>
                  <Badge variant="secondary">33</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Q3 (75%)</span>
                  <Badge variant="outline">40</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Max (100%)</span>
                  <Badge variant="outline">58</Badge>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">IQR</span>
                  <span className="font-medium">12 years</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
