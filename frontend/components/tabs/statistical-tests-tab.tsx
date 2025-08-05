"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, TrendingUp, Activity, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const testResults = [
  {
    test: "Shapiro-Wilk Test",
    description: "Tests for normality of age distribution",
    statistic: 0.987,
    pValue: 0.023,
    significant: true,
    conclusion: "Data is not normally distributed",
  },
  {
    test: "Levene's Test",
    description: "Tests for equality of variances across departments",
    statistic: 2.45,
    pValue: 0.089,
    significant: false,
    conclusion: "Variances are equal across groups",
  },
  {
    test: "ANOVA F-Test",
    description: "Tests for differences in salary across departments",
    statistic: 15.67,
    pValue: 0.001,
    significant: true,
    conclusion: "Significant differences exist between departments",
  },
  {
    test: "Chi-Square Test",
    description: "Tests for independence between city and department",
    statistic: 23.45,
    pValue: 0.003,
    significant: true,
    conclusion: "City and department are not independent",
  },
]

const hypothesisTests = [
  {
    hypothesis: "H₀: μ_salary = $75,000",
    alternative: "H₁: μ_salary ≠ $75,000",
    test: "One-sample t-test",
    result: "Reject H₀",
    pValue: 0.012,
    significant: true,
  },
  {
    hypothesis: "H₀: σ²_age = 64",
    alternative: "H₁: σ²_age ≠ 64",
    test: "Chi-square variance test",
    result: "Fail to reject H₀",
    pValue: 0.156,
    significant: false,
  },
]

export function StatisticalTestsTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Statistical Tests</h2>
          <p className="text-muted-foreground">Hypothesis testing and statistical inference</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="normality">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select test category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normality">Normality Tests</SelectItem>
              <SelectItem value="variance">Variance Tests</SelectItem>
              <SelectItem value="mean">Mean Comparison</SelectItem>
              <SelectItem value="independence">Independence Tests</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="hover-glow bg-transparent">
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tests Run</p>
                <p className="text-3xl font-bold text-gradient-primary">12</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">statistical tests</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Significant</p>
                <p className="text-3xl font-bold text-gradient-primary">7</p>
                <p className="text-xs text-red-600 dark:text-red-400">p {"<"} 0.05</p>
              </div>
              <CheckCircle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Non-Significant</p>
                <p className="text-3xl font-bold text-gradient-primary">5</p>
                <p className="text-xs text-green-600 dark:text-green-400">p ≥ 0.05</p>
              </div>
              <XCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alpha Level</p>
                <p className="text-3xl font-bold text-gradient-primary">0.05</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">significance level</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Statistical Test Results
          </CardTitle>
          <CardDescription>Comprehensive statistical analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {testResults.map((test, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{test.test}</h3>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </div>
                  <Badge variant={test.significant ? "destructive" : "secondary"} className="ml-4">
                    {test.significant ? "Significant" : "Not Significant"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Test Statistic</p>
                    <p className="text-2xl font-bold">{test.statistic}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">P-value</p>
                    <p
                      className={`text-2xl font-bold ${test.significant ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                    >
                      {test.pValue.toFixed(3)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Significance Level</p>
                    <div className="flex items-center gap-2">
                      <Progress value={test.pValue * 100} className="flex-1 h-2" />
                      <span className="text-sm">α = 0.05</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Conclusion:</p>
                  <p className="text-sm text-muted-foreground">{test.conclusion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hypothesis Testing */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Hypothesis Testing
          </CardTitle>
          <CardDescription>Formal hypothesis tests with conclusions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {hypothesisTests.map((test, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Null Hypothesis</p>
                      <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">{test.hypothesis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Alternative Hypothesis</p>
                      <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">{test.alternative}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Test Used</span>
                      <Badge variant="outline">{test.test}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">P-value</span>
                      <span
                        className={`font-bold ${test.significant ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                      >
                        {test.pValue.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Decision</span>
                      <Badge variant={test.significant ? "destructive" : "secondary"}>{test.result}</Badge>
                    </div>
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
