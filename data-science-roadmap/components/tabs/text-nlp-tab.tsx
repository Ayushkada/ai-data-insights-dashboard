"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import type { Dataset } from "@/components/data-provider"

interface TextNLPTabProps {
  dataset: Dataset
  columnTypes: {
    numeric: string[]
    categorical: string[]
    datetime: string[]
    text: string[]
  }
}

export function TextNLPTab({ dataset, columnTypes }: TextNLPTabProps) {
  // Show Sentiment, Topic Modeling, and NER only if a text column exists
  if (columnTypes.text.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Text Data Available</h3>
            <p className="text-sm">
              AI has disabled text/NLP analysis for this dataset. Text columns are required for natural language
              processing.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-white rounded-2xl shadow-md border-0">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-indigo-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Text/NLP Analysis</h3>
            <p className="text-sm">
              Sentiment analysis, topic modeling, and NER tools will be available here. Detected{" "}
              {columnTypes.text.length} text columns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
