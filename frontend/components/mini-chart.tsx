"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MiniSparklineProps {
  data: number[]
  trend: "up" | "down" | "neutral"
  className?: string
}

export function MiniSparkline({ data, trend, className = "" }: MiniSparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 60
      const y = 20 - ((value - min) / range) * 16
      return `${x},${y}`
    })
    .join(" ")

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-gray-500"

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="60" height="20" className="overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
          className="text-indigo-500 dark:text-indigo-400"
        />
      </svg>
      <TrendIcon className={`h-3 w-3 ${trendColor}`} />
    </div>
  )
}

interface MiniDonutProps {
  data: { label: string; value: number; color: string }[]
  size?: number
}

export function MiniDonut({ data, size = 40 }: MiniDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const radius = size / 2 - 4
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-200 dark:text-gray-700"
        />
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
          cumulativePercentage += percentage

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          )
        })}
      </svg>
    </div>
  )
}
