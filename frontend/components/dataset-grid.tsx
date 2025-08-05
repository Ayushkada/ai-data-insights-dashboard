"use client"

import React from "react"
import { DatasetMeta } from "@/types/upload"
import { getAllUploads } from "@/lib/api/upload.api"
import { DatasetPreviewDialog } from "./dataset-preview-dialog"
import { DatasetCard } from "./dataset-card"

export function DatasetGrid() {
  const [datasets, setDatasets] = React.useState<DatasetMeta[]>([])
  const [selected, setSelected] = React.useState<null | number>(null)
  const [page, setPage] = React.useState(1)
  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(datasets.length / PAGE_SIZE);

  React.useEffect(() => {
    getAllUploads()
      .then((res: DatasetMeta[]) => {
        console.log('Fetched datasets:', res);
        if (res && res.length > 0) {
          setDatasets(res)
        }
      })
      .catch((err: unknown) => {
        console.error('Error fetching datasets:', err);
      })
  }, [])

  const handleCardClick = (globalIdx: number) => {
    setSelected(globalIdx)
  }

  const handleClose = () => setSelected(null)

  // Pagination logic
  const pagedDatasets = datasets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {datasets.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Existing Datasets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {pagedDatasets.map((dataset, idx) => {
              const globalIdx = (page - 1) * PAGE_SIZE + idx;
              const uniqueKey = dataset.id || `dataset-${globalIdx}`;
              return (
                <div
                  key={uniqueKey}
                  onClick={() => setSelected(globalIdx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open preview for dataset ${dataset.title || dataset.filename}`}
                  className="outline-none focus:ring-2 focus:ring-primary/40 rounded-lg"
                  style={{ cursor: 'pointer' }}
                >
                  <DatasetCard dataset={dataset} />
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                className="px-4 py-2 rounded border border-border bg-background text-foreground text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                onClick={handlePrev}
                disabled={page === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                className="px-4 py-2 rounded border border-border bg-background text-foreground text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                onClick={handleNext}
                disabled={page === totalPages}
                aria-label="Next page"
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
        </div>
      )}
    </div>
  )
}
