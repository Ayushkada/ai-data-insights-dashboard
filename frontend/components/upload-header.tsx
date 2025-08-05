"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function UploadHeader() {
  const [hasDataset, setHasDataset] = useState(false)

  useEffect(() => {
    fetch("/api/session-dataset-active")
      .then(res => res.json())
      .then(data => setHasDataset(data.has_dataset))
      .catch(() => setHasDataset(false))
  }, [])

  return (
    <header className="relative flex h-16 shrink-0 items-center border-b border-border/60 navbar-gradient px-6 backdrop-blur-sm">
      <div className="flex items-center min-w-[180px]">
        {hasDataset && (
          <Link href="/dashboard" className="flex items-center text-white hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        )}
      </div>
      <div className="flex items-center min-w-[60px] ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}