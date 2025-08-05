import { UploadSection } from "@/components/upload-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DatasetGrid } from "@/components/dataset-grid"
import { UploadHeader } from "@/components/upload-header"

export default function Upload() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <UploadHeader />
                <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50/50 via-white to-indigo-50/30 dark:from-gray-950/50 dark:via-gray-900 dark:to-indigo-950/30">
                    <UploadSection />
                    <DatasetGrid />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}