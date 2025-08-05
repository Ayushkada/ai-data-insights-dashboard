"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Database, BarChart3, TrendingUp, Users, FileText, Eye, Download } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts"
import { getOverviewPage } from "@/lib/api/analysis.api"
import { useDashboardData } from "@/lib/data-provider"
import { useEffect, useState } from "react"
import type { DatasetAnalysis } from "@/types/analysis"

const columnTypeData = [
  { name: "Numeric", value: 8, color: "#6366f1" },
  { name: "Categorical", value: 5, color: "#06b6d4" },
  { name: "DateTime", value: 2, color: "#8b5cf6" },
]

const sampleData = [
  { id: 1, name: "John Doe", age: 28, city: "New York", salary: 75000, department: "Engineering" },
  { id: 2, name: "Jane Smith", age: 32, city: "San Francisco", salary: 85000, department: "Marketing" },
  { id: 3, name: "Mike Johnson", age: 45, city: "Chicago", salary: 95000, department: "Sales" },
  { id: 4, name: "Sarah Wilson", age: 29, city: "Boston", salary: 70000, department: "Design" },
  { id: 5, name: "David Brown", age: 38, city: "Seattle", salary: 90000, department: "Engineering" },
]

const sparklineData = [
  { value: 100 },
  { value: 120 },
  { value: 110 },
  { value: 140 },
  { value: 130 },
  { value: 160 },
  { value: 150 },
  { value: 180 },
  { value: 170 },
  { value: 200 },
]

export function OverviewTab() {
  const data = useDashboardData();
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  useEffect(() => {
    getOverviewPage().then((res) => {
      setAnalysis(res.analysis);
    });
  }, []);

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Dataset Overview</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover-glow bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="hover-glow bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold text-gradient-primary">15,420</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <Database className="h-8 w-8 text-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Features</p>
                <p className="text-3xl font-bold text-gradient-primary">15</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />8 numeric, 7 categorical
                </p>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.map((d) => ({ value: d.value * 0.8 }))}>
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <BarChart3 className="h-8 w-8 text-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completeness</p>
                <p className="text-3xl font-bold text-gradient-primary">94.2%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  High quality data
                </p>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.map((d) => ({ value: d.value * 1.2 }))}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Size</p>
                <p className="text-3xl font-bold text-gradient-primary">2.3 MB</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1" />
                  CSV format
                </p>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.map((d) => ({ value: d.value * 0.6 }))}>
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <FileText className="h-8 w-8 text-purple-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column Types */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Column Types
            </CardTitle>
            <CardDescription>Distribution of data types in your dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={columnTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {columnTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {columnTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Data Quality
            </CardTitle>
            <CardDescription>Missing values and completeness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Complete Records</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Unique Values</span>
                  <span className="font-medium">87.5%</span>
                </div>
                <Progress value={87.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Valid Formats</span>
                  <span className="font-medium">98.1%</span>
                </div>
                <Progress value={98.1} className="h-2" />
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 dark:text-green-400 font-medium">High quality</span> dataset ready for
                analysis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Quick Stats
            </CardTitle>
            <CardDescription>Key dataset characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</p>
                <p className="text-xs text-muted-foreground">Departments</p>
              </div>
              <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl">
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">28-45</p>
                <p className="text-xs text-muted-foreground">Age Range</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$82K</p>
                <p className="text-xs text-muted-foreground">Avg Salary</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">6</p>
                <p className="text-xs text-muted-foreground">Cities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Data Table */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Sample Data (First 5 Rows)
          </CardTitle>
          <CardDescription>Preview of your dataset structure and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Age</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">City</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Salary</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Department</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-2">{row.id}</td>
                    <td className="p-2 font-medium">{row.name}</td>
                    <td className="p-2">{row.age}</td>
                    <td className="p-2">{row.city}</td>
                    <td className="p-2">${row.salary.toLocaleString()}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">
                        {row.department}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
