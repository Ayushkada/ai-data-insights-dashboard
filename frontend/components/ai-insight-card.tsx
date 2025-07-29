import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface AIInsightCardProps {
  children: React.ReactNode
}

export function AIInsightCard({ children }: AIInsightCardProps) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong className="font-medium">AI Insight:</strong>
            <p className="mt-1">{children}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
