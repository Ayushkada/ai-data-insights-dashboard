"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Target, Search } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface OutliersTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function OutliersTab({ dataset, columnTypes }: OutliersTabProps) {
  const [selectedMethods, setSelectedMethods] = useState<Record<string, any>>({})
  const [outlierResults, setOutlierResults] = useState<Record<string, any>>({})

  // Show only if numeric columns exist
  if (columnTypes.numeric.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Numeric Data Available</h3>
            <p className="text-sm">
              AI has disabled outlier detection for this dataset. Numeric columns are required for outlier analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmitOutlierDetection = (method: string) => {
    const params = selectedMethods[method]
    if (!params) return

    // Mock outlier detection results
    const mockOutliers = dataset.data
      .slice(0, 5)
      .map((row, index) => ({
        rowIndex: index,
        values: Object.fromEntries(params.variables?.map((col: string) => [col, row[col]]) || []),
        score: Math.random() * 3 + 1,
        isOutlier: Math.random() > 0.7,
      }))
      .filter((item) => item.isOutlier)

    setOutlierResults((prev) => ({
      ...prev,
      [method]: {
        outliers: mockOutliers,
        totalOutliers: mockOutliers.length,
        params,
      },
    }))
  }

  const updateMethodParams = (method: string, updates: any) => {
    setSelectedMethods((prev) => ({
      ...prev,
      [method]: { ...prev[method], ...updates },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Accordion type="multiple" className="w-full space-y-4">
        {/* Z-Score Method */}
        <AccordionItem value="zscore" className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white">
          <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-red-100 rounded-lg">
                <Target className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Z-Score Method</div>
                <div className="text-sm text-gray-600">Detect outliers using standard deviation thresholds</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Z-Score Threshold</Label>
                <Input
                  type="number"
                  defaultValue="2"
                  step="0.1"
                  min="1"
                  max="5"
                  className="bg-white"
                  onChange={(e) => updateMethodParams("zscore", { threshold: Number.parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500">
                  Values beyond ±threshold standard deviations are considered outliers
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Variables to Analyze</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {columnTypes.numeric.map((variable) => (
                    <div key={variable} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <Checkbox
                        id={`zscore-${variable}`}
                        onCheckedChange={(checked) => {
                          const currentVars = selectedMethods.zscore?.variables || []
                          const newVars = checked
                            ? [...currentVars, variable]
                            : currentVars.filter((v: string) => v !== variable)
                          updateMethodParams("zscore", { variables: newVars })
                        }}
                      />
                      <Label htmlFor={`zscore-${variable}`} className="text-sm font-normal text-gray-700">
                        {variable}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleSubmitOutlierDetection("zscore")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              disabled={!selectedMethods.zscore?.variables?.length}
            >
              Detect Outliers (Z-Score)
            </Button>

            {outlierResults.zscore && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">Outlier Detection Results</h4>
                  <div className="text-sm text-gray-600 mb-4">
                    Found {outlierResults.zscore.totalOutliers} outliers using Z-Score method (threshold:{" "}
                    {selectedMethods.zscore?.threshold || 2})
                  </div>
                  {outlierResults.zscore.outliers.length > 0 ? (
                    <div className="space-y-2">
                      {outlierResults.zscore.outliers.map((outlier: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border border-red-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Row {outlier.rowIndex + 1}</span>
                              <div className="text-xs text-gray-600 mt-1">
                                {Object.entries(outlier.values).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-red-600 font-medium">Score: {outlier.score.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No outliers detected</div>
                  )}
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-red-800">
                    The Z-Score method identified {outlierResults.zscore.totalOutliers} potential outliers. These data
                    points have values that deviate significantly from the mean. Consider investigating these outliers
                    to determine if they represent data errors or genuine extreme values.
                  </p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* IQR Method */}
        <AccordionItem value="iqr" className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white">
          <AccordionTrigger className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Interquartile Range (IQR)</div>
                <div className="text-sm text-gray-600">Detect outliers using quartile-based thresholds</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">IQR Multiplier</Label>
                <Input
                  type="number"
                  defaultValue="1.5"
                  step="0.1"
                  min="1"
                  max="3"
                  className="bg-white"
                  onChange={(e) => updateMethodParams("iqr", { multiplier: Number.parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500">
                  Values beyond Q1 - multiplier×IQR or Q3 + multiplier×IQR are outliers
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Variables to Analyze</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {columnTypes.numeric.map((variable) => (
                    <div key={variable} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <Checkbox
                        id={`iqr-${variable}`}
                        onCheckedChange={(checked) => {
                          const currentVars = selectedMethods.iqr?.variables || []
                          const newVars = checked
                            ? [...currentVars, variable]
                            : currentVars.filter((v: string) => v !== variable)
                          updateMethodParams("iqr", { variables: newVars })
                        }}
                      />
                      <Label htmlFor={`iqr-${variable}`} className="text-sm font-normal text-gray-700">
                        {variable}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleSubmitOutlierDetection("iqr")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              disabled={!selectedMethods.iqr?.variables?.length}
            >
              Detect Outliers (IQR)
            </Button>

            {outlierResults.iqr && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">IQR Outlier Detection Results</h4>
                  <div className="text-sm text-gray-600 mb-4">
                    Found {outlierResults.iqr.totalOutliers} outliers using IQR method (multiplier:{" "}
                    {selectedMethods.iqr?.multiplier || 1.5})
                  </div>
                  {outlierResults.iqr.outliers.length > 0 ? (
                    <div className="space-y-2">
                      {outlierResults.iqr.outliers.map((outlier: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border border-orange-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Row {outlier.rowIndex + 1}</span>
                              <div className="text-xs text-gray-600 mt-1">
                                {Object.entries(outlier.values).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-orange-600 font-medium">
                                Score: {outlier.score.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No outliers detected</div>
                  )}
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-orange-800">
                    The IQR method found {outlierResults.iqr.totalOutliers} outliers based on quartile analysis. This
                    method is robust to extreme values and focuses on the middle 50% of your data distribution. These
                    outliers fall outside the typical range of your dataset.
                  </p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
