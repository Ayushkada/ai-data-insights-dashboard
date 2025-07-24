"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TestTube, Calculator, BarChart3 } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface StatisticalTestsTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function StatisticalTestsTab({ dataset, columnTypes }: StatisticalTestsTabProps) {
  const [selectedTests, setSelectedTests] = useState<Record<string, any>>({})
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  // Only show if dataset has >1 categorical/numeric columns
  if (columnTypes.numeric.length < 2 && columnTypes.categorical.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Insufficient Data for Statistical Tests</h3>
            <p className="text-sm">
              AI has disabled statistical testing for this dataset. At least 2 numeric columns or 1 categorical column
              is required.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmitTest = (testType: string) => {
    const params = selectedTests[testType]
    if (!params) return

    // Mock statistical test results
    const mockResults = {
      ttest: {
        statistic: -2.345,
        pValue: 0.023,
        conclusion: params.pValue < 0.05 ? "Reject null hypothesis" : "Fail to reject null hypothesis",
        interpretation: `There is ${params.pValue < 0.05 ? "a significant" : "no significant"} difference between the groups.`,
      },
      anova: {
        fStatistic: 4.567,
        pValue: 0.012,
        conclusion: params.pValue < 0.05 ? "Reject null hypothesis" : "Fail to reject null hypothesis",
        interpretation: `There ${params.pValue < 0.05 ? "are significant" : "are no significant"} differences between the groups.`,
      },
      chisquare: {
        chiSquare: 12.345,
        pValue: 0.006,
        conclusion: params.pValue < 0.05 ? "Reject null hypothesis" : "Fail to reject null hypothesis",
        interpretation: `There ${params.pValue < 0.05 ? "is a significant" : "is no significant"} association between the variables.`,
      },
    }

    setTestResults((prev) => ({
      ...prev,
      [testType]: mockResults[testType as keyof typeof mockResults],
    }))
  }

  const updateTestParams = (testType: string, updates: any) => {
    setSelectedTests((prev) => ({
      ...prev,
      [testType]: { ...prev[testType], ...updates },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Accordion type="multiple" className="w-full space-y-4">
        {/* T-Test */}
        {columnTypes.numeric.length > 1 && (
          <AccordionItem
            value="t-test"
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
          >
            <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">T-Test</div>
                  <div className="text-sm text-gray-600">
                    Compare means between two groups or against a reference value
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Variable 1</Label>
                  <Select onValueChange={(value) => updateTestParams("ttest", { variable1: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select first variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.numeric.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Variable 2</Label>
                  <Select onValueChange={(value) => updateTestParams("ttest", { variable2: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select second variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.numeric.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Significance Level</Label>
                  <Select
                    defaultValue="0.05"
                    onValueChange={(value) => updateTestParams("ttest", { alpha: Number.parseFloat(value) })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01</SelectItem>
                      <SelectItem value="0.05">0.05</SelectItem>
                      <SelectItem value="0.10">0.10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleSubmitTest("ttest")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                disabled={!selectedTests.ttest?.variable1 || !selectedTests.ttest?.variable2}
              >
                Run T-Test
              </Button>

              {testResults.ttest && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Test Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">T-Statistic:</span>
                        <div className="font-mono font-medium">{testResults.ttest.statistic}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">P-Value:</span>
                        <div className="font-mono font-medium">{testResults.ttest.pValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conclusion:</span>
                        <div className="font-medium">{testResults.ttest.conclusion}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">AI Interpretation</h4>
                    <p className="text-sm text-blue-800">{testResults.ttest.interpretation}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ANOVA */}
        {columnTypes.numeric.length > 0 && columnTypes.categorical.length > 0 && (
          <AccordionItem
            value="anova"
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
          >
            <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calculator className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">ANOVA</div>
                  <div className="text-sm text-gray-600">Compare means across multiple groups</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Dependent Variable</Label>
                  <Select onValueChange={(value) => updateTestParams("anova", { dependent: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select dependent variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.numeric.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Grouping Variable</Label>
                  <Select onValueChange={(value) => updateTestParams("anova", { grouping: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select grouping variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.categorical.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Significance Level</Label>
                  <Select
                    defaultValue="0.05"
                    onValueChange={(value) => updateTestParams("anova", { alpha: Number.parseFloat(value) })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01</SelectItem>
                      <SelectItem value="0.05">0.05</SelectItem>
                      <SelectItem value="0.10">0.10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleSubmitTest("anova")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                disabled={!selectedTests.anova?.dependent || !selectedTests.anova?.grouping}
              >
                Run ANOVA
              </Button>

              {testResults.anova && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">ANOVA Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">F-Statistic:</span>
                        <div className="font-mono font-medium">{testResults.anova.fStatistic}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">P-Value:</span>
                        <div className="font-mono font-medium">{testResults.anova.pValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conclusion:</span>
                        <div className="font-medium">{testResults.anova.conclusion}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">AI Interpretation</h4>
                    <p className="text-sm text-green-800">{testResults.anova.interpretation}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Chi-Square */}
        {columnTypes.categorical.length > 1 && (
          <AccordionItem
            value="chi-square"
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white"
          >
            <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Chi-Square Test</div>
                  <div className="text-sm text-gray-600">Test independence between categorical variables</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Variable 1</Label>
                  <Select onValueChange={(value) => updateTestParams("chisquare", { variable1: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select first variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.categorical.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Variable 2</Label>
                  <Select onValueChange={(value) => updateTestParams("chisquare", { variable2: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select second variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.categorical.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Significance Level</Label>
                  <Select
                    defaultValue="0.05"
                    onValueChange={(value) => updateTestParams("chisquare", { alpha: Number.parseFloat(value) })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01</SelectItem>
                      <SelectItem value="0.05">0.05</SelectItem>
                      <SelectItem value="0.10">0.10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => handleSubmitTest("chisquare")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                disabled={!selectedTests.chisquare?.variable1 || !selectedTests.chisquare?.variable2}
              >
                Run Chi-Square Test
              </Button>

              {testResults.chisquare && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Chi-Square Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Chi-Square:</span>
                        <div className="font-mono font-medium">{testResults.chisquare.chiSquare}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">P-Value:</span>
                        <div className="font-mono font-medium">{testResults.chisquare.pValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conclusion:</span>
                        <div className="font-medium">{testResults.chisquare.conclusion}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">AI Interpretation</h4>
                    <p className="text-sm text-purple-800">{testResults.chisquare.interpretation}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
