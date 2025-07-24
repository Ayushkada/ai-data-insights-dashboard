"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getSessionDatasets } from "@/app/common/navbar.api"

interface DatasetTab {
  id: string
  title: string
}

export function Navbar() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<DatasetTab[]>([])
  const pathname = usePathname();

  useEffect(() => {
    getSessionDatasets().then(setDatasets)
  }, [])

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold">
              Data Dashboard
            </div>
            {datasets.length > 0 && (
              <div className="hidden md:flex items-center space-x-4">
                {datasets.map((dataset) => (
                  <Link
                    key={dataset.id}
                    href={`/dashboard?dataset=${dataset.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {dataset.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {pathname !== "/upload" && (
              <Button variant="outline" size="sm" onClick={() => router.push("/upload")}> 
                <Upload className="h-4 w-4 mr-2"/>
                Upload New Dataset
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
