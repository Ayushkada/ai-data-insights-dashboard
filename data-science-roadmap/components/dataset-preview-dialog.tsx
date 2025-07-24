"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FilePreview } from "@/app/upload/types"
import { DatasetPreviewTable } from "./dataset-preview-table"
import { useToast } from "@/hooks/use-toast"
import { useDataContext } from "./data-provider"
import { selectDataset } from "@/app/upload/upload.api"
import { useRouter } from "next/navigation"

interface DatasetPreviewDialogProps {
  open: boolean
  onClose: () => void
  dataset: {
    id: string
    filename: string
    title: string
    summary: string
    preview: FilePreview | undefined
  }
}

export const DatasetPreviewDialog: React.FC<DatasetPreviewDialogProps> = ({
  open,
  onClose,
  dataset,
}) => {
  const { title, summary, preview, id, filename } = dataset
  const { toast } = useToast();
  const { refreshNavbar } = useDataContext();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const addDataset = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await selectDataset(filename);
      toast({
        title: "Dataset selected!",
        description: "Your dataset is now active in your session.",
        variant: "default",
      });
      refreshNavbar();
      onClose();
      if (response && response.id) {
        router.push(`/dashboard?dataset=${response.id}`);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to select dataset.");
      toast({
        title: "Select failed",
        description: err?.message || "Failed to select dataset.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="
      inline-block
      min-w-[30rem]
      max-w-[78rem]
      w-auto
      p-0
      align-middle
      "
        style={{
          padding: 0
        }}
      >
        <DialogHeader className="py-6 pb-2 px-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-1 text-base text-muted-foreground">
            {summary}
          </DialogDescription>
        </DialogHeader>
        <div className="pb-2 px-4">
          <div
            className="
          overflow-x-auto
          overflow-y-auto
          rounded
          border
          bg-muted
        "
            style={{
              maxHeight: 420,
            }}
          >
            <DatasetPreviewTable preview={preview ?? { columns: [], sample_rows: [] }} />
          </div>
        </div>
        <DialogFooter className="bg-background px-4 py-6 border-t flex-row gap-2 justify-end">
          {error && (
            <div className="text-red-600 text-sm text-center w-full mt-2">{error}</div>
          )}
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          {true && (
            <Button type="button" onClick={addDataset} disabled={loading}>
              {loading ? "Selecting..." : "Select"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>


  )
}
