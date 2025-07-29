"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface TabBarProps {
  datasetId: string
}

const tabs = [
  { name: "Overview", href: "" },
  { name: "Skew & Kurtosis", href: "skew-kurtosis" },
  { name: "Correlation", href: "correlation" },
  { name: "Statistical Tests", href: "tests" },
  { name: "Distributions", href: "distributions" },
  { name: "Outliers", href: "outliers" },
  { name: "Time Series", href: "timeseries" },
  { name: "Clustering", href: "clustering" },
  { name: "Text / NLP", href: "text" },
  { name: "AutoML", href: "automl" },
]

export function TabBar({ datasetId }: TabBarProps) {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background" aria-label="Dataset analysis tabs">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const href = `/datasets/${datasetId}/${tab.href}`
            const isActive = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={tab.name}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                )}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
