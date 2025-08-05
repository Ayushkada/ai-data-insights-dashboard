"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Target, Activity } from "lucide-react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

const clusterData = [
  { age: 25, salary: 45000, cluster: 0, size: 8 },
  { age: 28, salary: 52000, cluster: 0, size: 8 },
  { age: 32, salary: 68000, cluster: 1, size: 12 },
  { age: 29, salary: 55000, cluster: 0, size: 8 },
  { age: 35, salary: 75000, cluster: 1, size: 12 },
  { age: 42, salary: 85000, cluster: 2, size: 15 },
  { age: 38, salary: 72000, cluster: 1, size: 12 },
  { age: 31, salary: 61000, cluster: 1, size: 12 },
  { age: 45, salary: 95000, cluster: 2, size: 15 },
  { age: 27, salary: 48000, cluster: 0, size: 8 },
  { age: 33, salary: 65000, cluster: 1, size: 12 },
  { age: 40, salary: 78000, cluster: 2, size: 15 },
  { age: 26, salary: 46000, cluster: 0, size: 8 },
  { age: 37, salary: 71000, cluster: 1, size: 12 },
  { age: 44, salary: 88000, cluster: 2, size: 15 },
]

const clusterSummary = [
  {
    cluster: "Cluster 0",
    name: "Junior Employees",
    count: 4250,
    avgAge: 26.8,
    avgSalary: 48500,
    color: "#6366f1",
  },
  {
    cluster: "Cluster 1",
    name: "Mid-Level Employees",
    count: 6890,
    avgAge: 33.2,
    avgSalary: 67200,
    color: "#06b6d4",
  },
  {
    cluster: "Cluster 2",
    name: "Senior Employees",
    count: 4280,
    avgAge: 42.1,
    avgSalary: 86800,
    color: "#10b981",
  },
]

const clusterMetrics = [
  { metric: "Silhouette Score", value: 0.73, description: "Good cluster separation" },
  { metric: "Calinski-Harabasz Index", value: 1247.3, description: "Well-defined clusters" },
  { metric: "Davies-Bouldin Index", value: 0.42, description: "Low intra-cluster similarity" },
  { metric: "Inertia", value: 2.8e6, description: "Within-cluster sum of squares" },
]

const getClusterColor = (cluster: number) => {
  const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
  return colors[cluster] || "#6b7280"
}

export function ClusteringTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Clustering Analysis</h2>
          <p className="text-muted-foreground">Discover hidden patterns and group similar data points</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="kmeans">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kmeans">K-Means</SelectItem>
              <SelectItem value="hierarchical">Hierarchical</SelectItem>
              <SelectItem value="dbscan">DBSCAN</SelectItem>
              <SelectItem value="gaussian">Gaussian Mixture</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow">
            Run Clustering
          </Button>
        </div>
      </div>

      {/* Clustering Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clusters Found</p>
                <p className="text-3xl font-bold text-gradient-primary">3</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">optimal number</p>
              </div>
              <Target className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Silhouette Score</p>
                <p className="text-3xl font-bold text-gradient-primary">0.73</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">good separation</p>
              </div>
              <Activity className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold text-gradient-primary">15.4K</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">data points</p>
              </div>
              <Users className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Algorithm</p>
                <p className="text-3xl font-bold text-gradient-primary">K-Means</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">clustering method</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cluster Visualization */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Cluster Visualization
          </CardTitle>
          <CardDescription>Age vs Salary clustering with K-Means algorithm</CardDescription>
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
                      const clusterInfo = clusterSummary[data.cluster]
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium" style={{ color: clusterInfo.color }}>
                            {clusterInfo.name}
                          </p>
                          <p className="text-sm text-muted-foreground">Age: {data.age} years</p>
                          <p className="text-sm text-muted-foreground">Salary: ${data.salary.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter name="Employees" data={clusterData} fill="#6366f1">
                  {clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getClusterColor(entry.cluster)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {clusterSummary.map((cluster, index) => (
              <Badge key={index} className="text-white" style={{ backgroundColor: cluster.color }}>
                {cluster.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cluster Summary */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Cluster Summary
            </CardTitle>
            <CardDescription>Characteristics of each identified cluster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clusterSummary.map((cluster, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cluster.color }} />
                    <h3 className="font-semibold text-lg">{cluster.name}</h3>
                    <Badge variant="outline">{cluster.count.toLocaleString()} employees</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold" style={{ color: cluster.color }}>
                        {cluster.avgAge.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">Average Age</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold" style={{ color: cluster.color }}>
                        ${(cluster.avgSalary / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Average Salary</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clustering Metrics */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Clustering Metrics
            </CardTitle>
            <CardDescription>Quality assessment of clustering results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clusterMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.metric}</span>
                    <span className="text-2xl font-bold text-gradient-primary">
                      {typeof metric.value === "number" && metric.value > 100
                        ? metric.value.toLocaleString()
                        : metric.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  {index < clusterMetrics.length - 1 && (
                    <div className="border-b border-gray-200 dark:border-gray-700 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
