"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"
import { getAllUploads } from "@/app/upload/upload.api"
import { DatasetMeta } from "@/app/upload/types"
import { DatasetPreviewDialog } from "./dataset-preview-dialog"


export function DatasetCards() {
  const [datasets, setDatasets] = React.useState<DatasetMeta[]>([])
  const [selected, setSelected] = React.useState<null | number>(null)
  const [page, setPage] = React.useState(1)
  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(datasets.length / PAGE_SIZE);

  React.useEffect(() => {
    getAllUploads().then((res) => setDatasets(res))
  }, [])

  const handleCardClick = (idx: number) => {
    setSelected(idx)
  }

  const handleClose = () => setSelected(null)

  // Pagination logic
  const pagedDatasets = datasets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedDatasets.map((dataset, idx) => {
          // idx here is the index in the paged array, so for selection, use the global index:
          const globalIdx = (page - 1) * PAGE_SIZE + idx;
          return (
            <Card
              key={dataset.filename}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300"
              onClick={() => handleCardClick(globalIdx)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 min-w-0">
                  <Database className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <CardTitle className="text-lg truncate overflow-hidden">{dataset.title || dataset.filename}</CardTitle>
                </div>
                <div className="flex justify-between items-center mt-1 mb-2">
                  <Badge variant="secondary" className="text-xs inline-flex w-auto">
                    {dataset.num_rows ?? 0} rows
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{dataset.summary}</CardDescription>
                {(() => {
                  const MAX_BADGES = 3;
                  let visibleColumns = dataset.columns || [];
                  let moreCount = 0;
                  if (visibleColumns.length > MAX_BADGES) {
                    visibleColumns = visibleColumns.slice(0, MAX_BADGES - 1);
                    moreCount = (dataset.columns?.length ?? 0) - (MAX_BADGES - 1);
                  }
                  return (
                    <div className="mt-4 flex gap-1">
                      {visibleColumns.map((column) => (
                        <Badge key={column} variant="outline" className="text-xs">
                          {column}
                        </Badge>
                      ))}
                      {moreCount > 0 && (
                        <Badge variant="outline" className="text-xs font-bold">
                          +{moreCount} more
                        </Badge>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {selected !== null && datasets[selected] && (
        <DatasetPreviewDialog
          open={selected !== null}
          onClose={handleClose}
          dataset={{
            id: datasets[selected].id || "",
            filename: datasets[selected].filename || "",
            title: datasets[selected].title || "",
            summary: datasets[selected].summary || "",
            preview: datasets[selected].preview,
          }}
        />
      )}
    </>
  )
}
