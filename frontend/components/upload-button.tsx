"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export function UploadButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/upload">
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Upload New Dataset
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload a new dataset for analysis</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
