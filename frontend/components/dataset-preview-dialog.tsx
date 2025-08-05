"use client"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { DatasetPreviewTable, FilePreview } from "./dataset-preview-table"
import { selectDataset } from "@/lib/api/upload.api"
import { SessionDatasetWarningDialog } from "./session-dataset-warning-dialog";
import { getSessionDatasetActive } from "@/lib/api/dataset.api"

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
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // Add state for warning dialog
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [pendingAdd, setPendingAdd] = useState(false);

    // Refactored addDataset
    const addDataset = async () => {
        setError(null);
        setLoading(true);
        try {
            const { has_dataset } = await getSessionDatasetActive();
            if (has_dataset) {
                setShowSessionWarning(true);
                setPendingAdd(true);
                setLoading(false);
                return;
            }
            await doAddDataset();
        } catch (err: any) {
            setError(err?.message ?? "Failed to select dataset.");
            setLoading(false);
        }
    };

    // Extracted logic
    const doAddDataset = async () => {
        try {
            const response = await selectDataset(filename)
            toast({
                title: "Dataset uploaded!",
                description: "Your dataset was uploaded and is ready for analysis.",
                variant: "default",
            })
            onClose();
            if (response) {
                router.push(`/dashboard`);
            }
        } catch (err: any) {
            if (err?.status === 409) {
                router.replace("/dashboard")
                return
            }
            setError(err?.message ?? "Failed to select dataset.");
            toast({
                title: "Select failed",
                description: err?.message ?? "Failed to select dataset.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SessionDatasetWarningDialog
                open={showSessionWarning}
                onConfirm={async () => {
                    setShowSessionWarning(false);
                    setPendingAdd(false);
                    setLoading(true);
                    await doAddDataset();
                }}
                onCancel={() => {
                    setShowSessionWarning(false);
                    setPendingAdd(false);
                }}
            />
            {/* Existing Dialog code */}
            <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                <DialogContent
                    className="w-full max-w-4xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl min-w-0 p-0 bg-background border border-border rounded-lg shadow-lg"
                    style={{ padding: 0 }}
                >
                    <DialogHeader className="py-6 pb-2 px-4">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="mt-1 text-base text-muted-foreground">
                            {summary}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pb-2 px-4">
                        <div
                            className="overflow-x-auto overflow-y-auto rounded border border-border bg-muted dark:bg-muted/60"
                            style={{ maxHeight: 420 }}
                        >
                            <DatasetPreviewTable preview={preview ?? { columns: [], sample_rows: [] }} />
                        </div>
                    </div>
                    <DialogFooter className="bg-background px-4 py-6 border-t border-border flex flex-col sm:flex-row gap-2 justify-end">
                        {error && (
                            <div className="text-destructive text-md text-center w-full mt-2">{error}</div>
                        )}
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-auto bg-white text-black rounded-md py-2 flex items-center justify-center space-x-2 h-12 hover-glow">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={addDataset}
                            disabled={loading}
                            className="w-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-md py-2 flex items-center justify-center space-x-2 h-12 hover-glow"
                        >
                            {loading ? "Selecting..." : "Select"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
