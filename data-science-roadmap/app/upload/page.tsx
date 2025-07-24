"use client"

import { UploadPanel } from "@/components/upload-panel"
import { DatasetCards } from "@/components/dataset-cards"
import { useEffect, useState } from "react"
import { removeSessionDataset } from "@/app/upload/upload.api"
import { getSessionDatasets } from "@/app/common/navbar.api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useDataContext } from "@/components/data-provider"

export default function UploadPage() {
  const { toast } = useToast();
  const [removing, setRemoving] = useState(false);
  const [sessionDatasetIds, setSessionDatasetIds] = useState<string[]>([]);
  const { refreshNavbar } = useDataContext();

  // Fetch session datasets on mount
  useEffect(() => {
    getSessionDatasets().then((datasets) => {
      setSessionDatasetIds(datasets.map((d: any) => d.id));
    });
  }, [removing]);

  // Remove all datasets from session
  const removeAllSessionDatasets = async () => {
    setRemoving(true);
    try {
      for (const id of sessionDatasetIds) {
        await removeSessionDataset(id);
      }
      toast({ title: "All session datasets removed" });
      setSessionDatasetIds([]);
    } catch (err: any) {
      toast({ title: "Failed to remove all session datasets", description: err.message, variant: "destructive" });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
            Upload your datasets and explore comprehensive statistical analysis, hypothesis testing, and data
            insights with our AI-powered platform.
          </p>
        </div>

        <UploadPanel />
        <div className="space-y-4">
          {/* TEMP: Remove all session datasets button */}
          <Button variant="destructive" disabled={removing || sessionDatasetIds.length === 0} onClick={() => {
            removeAllSessionDatasets();
            refreshNavbar();
          }
          }>
            {removing ? "Removing..." : "Remove all session datasets (TEMP)"}
          </Button>
          <h2 className="text-2xl font-semibold text-secondary-foreground text-center">or select a dataset</h2>
          <DatasetCards />
        </div>
      </div>
    </div>
  )
}
