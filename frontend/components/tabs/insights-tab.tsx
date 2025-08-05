"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Users, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const keyInsights = [
  {
    title: "Salary Growth Correlation",
    description:
      "Strong positive correlation (r=0.78) between employee age and salary indicates fair compensation progression.",
    impact: "High",
    category: "Compensation",
    confidence: 94,
    icon: TrendingUp,
    color: "emerald",
  },
  {
    title: "Department Salary Disparity",
    description: "Engineering department shows 23% higher average salary compared to other departments.",
    impact: "Medium",
    category: "Equity",
    confidence: 87,
    icon: Users,
    color: "orange",
  },
  {
    title: "Experience Premium",
    description: "Each additional year of experience correlates with $2,340 average salary increase.",
    impact: "High",
    category: "Career Growth",
    confidence: 91,
    icon: TrendingUp,
    color: "blue",
  },
  {
    title: "Geographic Pay Gap",
    description: "San Francisco employees earn 31% more than other locations, exceeding cost of living differences.",
    impact: "Medium",
    category: "Location",
    confidence: 89,
    icon: AlertTriangle,
    color: "red",
  },
]

const recommendations = [
  {
    title: "Implement Salary Bands",
    description:
      "Create transparent salary bands by role and experience level to ensure fair compensation across all departments.",
    priority: "High",
    effort: "Medium",
    impact: "High",
    timeline: "3-6 months",
  },
  {
    title: "Location-Based Adjustments",
    description: "Review and adjust location-based salary multipliers to align with actual cost of living differences.",
    priority: "Medium",
    effort: "Low",
    impact: "Medium",
    timeline: "1-2 months",
  },
  {
    title: "Career Progression Framework",
    description: "Develop clear career progression paths with defined salary increases for each advancement level.",
    priority: "High",
    effort: "High",
    impact: "High",
    timeline: "6-12 months",
  },
  {
    title: "Regular Compensation Reviews",
    description: "Establish quarterly compensation reviews to identify and address pay equity issues proactively.",
    priority: "Medium",
    effort: "Medium",
    impact: "Medium",
    timeline: "2-3 months",
  },
]

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case "high":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
    case "medium":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20"
    case "low":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    case "medium":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    case "low":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

const getInsightColor = (color: string) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    orange: "text-orange-600 dark:text-orange-400",
    blue: "text-blue-600 dark:text-blue-400",
    red: "text-red-600 dark:text-red-400",
  }
  return colors[color as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
}

export function InsightsTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">AI-Powered Insights</h2>
          <p className="text-muted-foreground">Discover patterns and actionable recommendations from your data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hover-glow bg-transparent">
            <Brain className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow">
            Export Insights
          </Button>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Key Insights</p>
                <p className="text-3xl font-bold text-gradient-primary">12</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">patterns discovered</p>
              </div>
              <Brain className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Impact</p>
                <p className="text-3xl font-bold text-gradient-primary">4</p>
                <p className="text-xs text-red-600 dark:text-red-400">critical findings</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommendations</p>
                <p className="text-3xl font-bold text-gradient-primary">8</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">actionable items</p>
              </div>
              <Lightbulb className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                <p className="text-3xl font-bold text-gradient-primary">91%</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">average accuracy</p>
              </div>
              <CheckCircle className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Key Insights
          </CardTitle>
          <CardDescription>AI-discovered patterns and correlations in your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {keyInsights.map((insight, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.color)} bg-opacity-10`}>
                      <insight.icon className={`h-5 w-5 ${getInsightColor(insight.color)}`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityColor(insight.impact)}>{insight.impact} Impact</Badge>
                    <Badge variant="outline">{insight.category}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={insight.confidence} className="w-20 h-2" />
                      <span className="text-sm font-medium">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Actionable Recommendations
          </CardTitle>
          <CardDescription>Data-driven suggestions to improve your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{rec.title}</h3>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Effort Required</span>
                    <Badge variant="outline">{rec.effort}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Expected Impact</span>
                    <Badge className={getImpactColor(rec.impact)}>{rec.impact}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Timeline</span>
                    <span className="text-sm font-medium">{rec.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Next Steps
          </CardTitle>
          <CardDescription>Prioritized action plan based on insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-red-900 dark:text-red-100">Immediate Action Required</p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Address salary disparities in Engineering department
                </p>
              </div>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">This Week</Badge>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 dark:text-orange-100">Short Term</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Implement location-based salary adjustments
                </p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                Next Month
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">Medium Term</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Develop comprehensive career progression framework
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Next Quarter</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
