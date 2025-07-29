"use client"

import { UploadSection } from "@/components/upload-section"
import { DatasetGrid } from "@/components/dataset-grid"
import { useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

async function getSessionDatasets() {
  const res = await fetch("/api/upload/session-datasets");
  if (!res.ok) throw new Error("Failed to fetch session datasets");
  return (await res.json()).datasets;
}

async function removeSessionDataset(id: string) {
  await fetch("/api/upload/remove-session-dataset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export default function UploadPage() {
  const [removing, setRemoving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRemoveAll = async () => {
    setRemoving(true);
    try {
      const datasets = await getSessionDatasets();
      await Promise.all(datasets.map((d: any) => removeSessionDataset(d.id)));
      setRefreshKey(k => k + 1);
    } catch (e) {
      // Optionally handle error
    }
    setRemoving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <UploadSection />
          <DatasetGrid key={refreshKey} />
          <div className="flex justify-end">
            <Button onClick={handleRemoveAll} disabled={removing} variant="destructive">
              {removing ? "Removing..." : "Remove All Session Datasets"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
