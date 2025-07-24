"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TestTube, AlertTriangle, TrendingUp, Zap, ChevronDown } from "lucide-react"

export function AnalysisAccordion() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null)
  const [analysisParams, setAnalysisParams] = useState({
    hypothesisTest: {
      variable1: "",
      variable2: "",
      testType: "",
      confidenceLevel: "0.95",
    },
    outlierDetection: {
      method: "",
      threshold: "2",
      variables: [] as string[],
    },
    correlation: {
      method: "pearson",
      variables: [] as string[],
    },
  })

  const handleAnalysisSelect = (analysis: string) => {
    if (selectedAnalysis === analysis) {
      setSelectedAnalysis(null)
    } else {
      setSelectedAnalysis(analysis)
    }
  }

  const handleSubmitAnalysis = () => {
    console.log("Submitting analysis:", selectedAnalysis, analysisParams)
    // In a real app, this would trigger the backend analysis
  }

  return (
    <Card className="bg-white rounded-2xl shadow-md border-0">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Zap className="h-5 w-5 text-indigo-600" />
          Advanced Analysis Tools
        </CardTitle>
        <CardDescription className="text-gray-600">
          Select and configure advanced statistical analysis methods
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem
            value="hypothesis"
            id="hypothesis"
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <AccordionTrigger
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-all duration-200 [&[data-state=open]>svg]:rotate-180"
              onClick={() => handleAnalysisSelect("hypothesis")}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Hypothesis Testing</div>
                  <div className="text-sm text-gray-500">Statistical significance testing between variables</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variable1" className="text-sm font-medium text-gray-700">
                    Variable 1
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        hypothesisTest: { ...prev.hypothesisTest, variable1: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select first variable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="units_sold">Units Sold</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variable2" className="text-sm font-medium text-gray-700">
                    Variable 2
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        hypothesisTest: { ...prev.hypothesisTest, variable2: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select second variable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="units_sold">Units Sold</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-type" className="text-sm font-medium text-gray-700">
                    Test Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        hypothesisTest: { ...prev.hypothesisTest, testType: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t-test">T-Test</SelectItem>
                      <SelectItem value="chi-square">Chi-Square</SelectItem>
                      <SelectItem value="anova">ANOVA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence" className="text-sm font-medium text-gray-700">
                    Confidence Level
                  </Label>
                  <Select
                    defaultValue="0.95"
                    onValueChange={(value) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        hypothesisTest: { ...prev.hypothesisTest, confidenceLevel: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.90">90%</SelectItem>
                      <SelectItem value="0.95">95%</SelectItem>
                      <SelectItem value="0.99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="outliers" id="outliers" className="border border-gray-200 rounded-xl overflow-hidden">
            <AccordionTrigger
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-all duration-200 [&[data-state=open]>svg]:rotate-180"
              onClick={() => handleAnalysisSelect("outliers")}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Outlier Detection</div>
                  <div className="text-sm text-gray-500">Identify anomalous data points in your dataset</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="outlier-method" className="text-sm font-medium text-gray-700">
                    Detection Method
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        outlierDetection: { ...prev.outlierDetection, method: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zscore">Z-Score</SelectItem>
                      <SelectItem value="iqr">Interquartile Range</SelectItem>
                      <SelectItem value="isolation">Isolation Forest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-sm font-medium text-gray-700">
                    Threshold
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    defaultValue="2"
                    step="0.1"
                    className="bg-white"
                    onChange={(e) =>
                      setAnalysisParams((prev) => ({
                        ...prev,
                        outlierDetection: { ...prev.outlierDetection, threshold: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Variables to Analyze</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["revenue", "units_sold", "age", "income"].map((variable) => (
                    <div key={variable} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                      <Checkbox id={variable} />
                      <Label htmlFor={variable} className="text-sm font-normal text-gray-700">
                        {variable}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="correlation" className="border border-gray-200 rounded-xl overflow-hidden">
            <AccordionTrigger
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-all duration-200 [&[data-state=open]>svg]:rotate-180"
              onClick={() => handleAnalysisSelect("correlation")}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Correlation Analysis</div>
                  <div className="text-sm text-gray-500">Measure relationships between variables</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <Label htmlFor="correlation-method" className="text-sm font-medium text-gray-700">
                  Correlation Method
                </Label>
                <Select
                  defaultValue="pearson"
                  onValueChange={(value) =>
                    setAnalysisParams((prev) => ({
                      ...prev,
                      correlation: { ...prev.correlation, method: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pearson">Pearson</SelectItem>
                    <SelectItem value="spearman">Spearman</SelectItem>
                    <SelectItem value="kendall">Kendall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Variables to Include</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["revenue", "units_sold", "age", "income"].map((variable) => (
                    <div key={variable} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                      <Checkbox id={`corr-${variable}`} />
                      <Label htmlFor={`corr-${variable}`} className="text-sm font-normal text-gray-700">
                        {variable}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {selectedAnalysis && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleSubmitAnalysis}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 py-3 text-base font-medium rounded-xl shadow-sm"
              size="lg"
            >
              Submit {selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)} Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
