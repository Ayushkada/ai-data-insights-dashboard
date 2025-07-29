"use client"

import { DatasetCard } from "@/components/dataset-card"
import React from "react"
import { DatasetMeta } from "@/app/upload/types"
import { getAllUploads } from "@/app/upload/upload.api"
import { DatasetPreviewDialog } from "./dataset-preview-dialog"

const mockDatasets: DatasetMeta[] = [
  {
    id: "1",
    filename: "sales_data.csv",
    title: "Sales Data",
    summary: "Monthly sales data for 2023.",
    columns: ["id", "date", "region", "sales", "profit"],
    num_rows: 1000,
    size: 20480,
    created_at: "2024-06-01T10:00:00Z",
    preview: {
      columns: ["id", "date", "region", "sales", "profit"],
      sample_rows: [
        { id: 1, date: "2023-01-01", region: "North", sales: 1000, profit: 200 },
        { id: 2, date: "2023-01-02", region: "South", sales: 1500, profit: 300 },
      ],
    },
    hash: "abc123"
  },
  {
    id: "2",
    filename: "users.xlsx",
    title: "User List",
    summary: "Registered users with demographics.",
    columns: ["user_id", "name", "email", "age", "country"],
    num_rows: 500,
    size: 10240,
    created_at: "2024-06-02T12:00:00Z",
    preview: {
      columns: ["user_id", "name", "email", "age", "country"],
      sample_rows: [
        { user_id: 1, name: "Alice", email: "alice@example.com", age: 30, country: "USA" },
        { user_id: 2, name: "Bob", email: "bob@example.com", age: 25, country: "Canada" },
      ],
    },
    hash: "def456"
  },
  {
    id: "3",
    filename: "inventory.tsv",
    title: "Inventory",
    summary: "Warehouse inventory levels.",
    columns: ["item_id", "item_name", "quantity", "location"],
    num_rows: 200,
    size: 5120,
    created_at: "2024-06-03T14:00:00Z",
    preview: {
      columns: ["item_id", "item_name", "quantity", "location"],
      sample_rows: [
        { item_id: "A1", item_name: "Widget", quantity: 50, location: "Aisle 1" },
        { item_id: "B2", item_name: "Gadget", quantity: 20, location: "Aisle 2" },
      ],
    },
    hash: "ghi789"
  }
];

export function DatasetGrid() {
  const [datasets, setDatasets] = React.useState<DatasetMeta[]>([])
  const [selected, setSelected] = React.useState<null | number>(null)
  const [page, setPage] = React.useState(1)
  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(datasets.length / PAGE_SIZE);
  
  React.useEffect(() => {
    getAllUploads().then((res) => {
      console.log('Fetched datasets:', res);
      setDatasets(res as DatasetMeta[])
    }).catch(err => {
      console.error('Error fetching datasets:', err);
    })
    // setDatasets(mockDatasets)
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
    <>
      {datasets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No datasets uploaded yet. Upload your first dataset to get started!</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">Existing Datasets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedDatasets.map((dataset, idx) => {
              const globalIdx = (page - 1) * PAGE_SIZE + idx;
              // Create a unique key that combines id with index as fallback
              const uniqueKey = dataset.id || `dataset-${globalIdx}`;
              return (
                <div key={uniqueKey} onClick={() => setSelected(globalIdx)} style={{ cursor: 'pointer' }}>
                  <DatasetCard dataset={dataset} />
                </div>
              );
            })}
          </div>
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
        </div>
      )}
    </>
  )
}
