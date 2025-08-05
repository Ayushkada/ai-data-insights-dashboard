"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { GitBranch, TrendingUp, Activity, Target, Zap } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

const modelPerformance = [
  { model: "Linear Regression", accuracy: 0.847, rmse: 8420, r2: 0.718, training_time: "0.12s" },
  { model: "Random Forest", accuracy: 0.923, rmse: 6180, r2: 0.856, training_time: "2.34s" },
  { model: "Gradient Boosting", accuracy: 0.931, rmse: 5890, r2: 0.871, training_time: "4.67s" },
  { model: "Neural Network", accuracy: 0.918, rmse: 6420, r2: 0.843, training_time: "12.45s" },
  { model: "Support Vector Machine", accuracy: 0.889, rmse: 7230, r2: 0.792, training_time: "8.91s" },
]

const learningCurve = [
  { epoch: 1, train_loss: 0.85, val_loss: 0.87, train_acc: 0.72, val_acc: 0.71 },
  { epoch: 5, train_loss: 0.62, val_loss: 0.65, train_acc: 0.81, val_acc: 0.79 },
  { epoch: 10, train_loss: 0.45, val_loss: 0.48, train_acc: 0.87, val_acc: 0.85 },
  { epoch: 15, train_loss: 0.38, val_loss: 0.42, train_acc: 0.91, val_acc: 0.88 },
  { epoch: 20, train_loss: 0.32, val_loss: 0.39, train_acc: 0.93, val_acc: 0.9 },
  { epoch: 25, train_loss: 0.29, val_loss: 0.37, train_acc: 0.94, val_acc: 0.91 },
]

const featureImportance = [
  { feature: "Age", importance: 0.342, rank: 1 },
  { feature: "Experience", importance: 0.289, rank: 2 },
  { feature: "Department", importance: 0.156, rank: 3 },
  { feature: "Education", importance: 0.098, rank: 4 },
  { feature: "City", importance: 0.067, rank: 5 },
  { feature: "Skills", importance: 0.048, rank: 6 },
]

export function ModelingTab() {
  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-primary">Machine Learning Models</h2>
          <p className="text-muted-foreground">Build and evaluate predictive models</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="salary-prediction">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salary-prediction">Salary Prediction</SelectItem>
              <SelectItem value="classification">Department Classification</SelectItem>
              <SelectItem value="clustering">Employee Clustering</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow">
            <Zap className="h-4 w-4 mr-2" />
            Train Model
          </Button>
        </div>
      </div>

      {/* Model Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Model</p>
                <p className="text-2xl font-bold text-gradient-primary">Gradient Boosting</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">93.1% accuracy</p>
              </div>
              <Target className="h-8 w-8 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">R² Score</p>
                <p className="text-3xl font-bold text-gradient-primary">0.871</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">87.1% variance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RMSE</p>
                <p className="text-3xl font-bold text-gradient-primary">$5.9K</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">prediction error</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Time</p>
                <p className="text-3xl font-bold text-gradient-primary">4.67s</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">computation time</p>
              </div>
              <GitBranch className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Comparison */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Model Performance Comparison
          </CardTitle>
          <CardDescription>Accuracy and error metrics across different algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {modelPerformance.map((model, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{model.model}</h3>
                    {index === 2 && (
                      <Badge className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">Best Model</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gradient-primary">{(model.accuracy * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">accuracy</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">R² Score</span>
                      <span className="font-medium">{model.r2.toFixed(3)}</span>
                    </div>
                    <Progress value={model.r2 * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">RMSE</span>
                      <span className="font-medium">${(model.rmse / 1000).toFixed(1)}K</span>
                    </div>
                    <Progress value={100 - (model.rmse / 10000) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Training Time</span>
                      <span className="font-medium">{model.training_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Curve */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Learning Curve
            </CardTitle>
            <CardDescription>Training and validation performance over epochs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                train_acc: {
                  label: "Training Accuracy",
                  color: "hsl(var(--chart-1))",
                },
                val_acc: {
                  label: "Validation Accuracy",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningCurve} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="epoch" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0.6, 1]}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="train_acc"
                    stroke="var(--color-train_acc)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="val_acc"
                    stroke="var(--color-val_acc)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Feature Importance
            </CardTitle>
            <CardDescription>Most influential features in the model</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                importance: {
                  label: "Importance",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featureImportance}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    domain={[0, 0.4]}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.feature}</p>
                            <p className="text-sm text-muted-foreground">
                              Importance: {(data.importance * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">Rank: #{data.rank}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="importance" fill="var(--color-importance)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
