"use client"


interface DatasetHeaderProps {
  datasetId: string
}

export function DatasetHeader({ datasetId }: DatasetHeaderProps) {

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{ "Dataset"}</h1>
        </div>
      </div>
    </div>
  )
}
