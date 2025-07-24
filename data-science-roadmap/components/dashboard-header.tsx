"use client"

import { ArrowLeft, Calendar, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Dataset } from "./data-provider"
import { ThemeToggle } from "./ui/theme-toggle"

interface DashboardHeaderProps {
  dataset: Dataset
}

export function DashboardHeader({ dataset }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild className="text-sm text-gray-500 hover:text-gray-700 p-0">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{dataset.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Uploaded {new Date(dataset.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
              <Database className="h-3 w-3" />
              {dataset.data.length} rows × {dataset.columns.length} columns
            </Badge>

            {/* Dark mode toggle placeholder */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
