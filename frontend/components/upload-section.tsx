"use client"

import * as React from "react"
import { Upload, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { parseCsvOrTsv, parseExcel, parseUrlCsv } from "@/lib/parser"
import { uploadDataset, uploadDatasetByUrl } from "@/lib/api/upload.api"
import { DatasetPreviewTable } from "./dataset-preview-table"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/utils"
import { SessionDatasetWarningDialog } from "./session-dataset-warning-dialog";
import { getSessionDatasetActive } from "@/lib/api/dataset.api"

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadSection() {
  // --- State ---
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [urlInput, setUrlInput] = React.useState("")
  const [fileUploadError, setFileUploadError] = React.useState<string | null>(null)
  const [urlUploadError, setUrlUploadError] = React.useState<string | null>(null)
  const [fileLoading, setFileLoading] = React.useState(false)
  const [urlLoading, setUrlLoading] = React.useState(false)
  const [fileTitle, setFileTitle] = React.useState<string>("")
  const [urlTitle, setUrlTitle] = React.useState<string>("")
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter();
  const [showSessionWarning, setShowSessionWarning] = React.useState(false);
  const [pendingAdd, setPendingAdd] = React.useState(false);

  // Unified preview state
  const [preview, setPreview] = React.useState<
    | { type: 'file'; object: { file: File; rows: any[]; columns: string[] } }
    | { type: 'url'; object: { url: string; rows: any[]; columns: string[] } }
    | null
  >(null)
  // Add errors
  const [addError, setAddError] = React.useState<string | null>(null)

  // ----- File Preview -----
  function handleFilePreview() {
    setFileUploadError(null)
    setAddError(null)
    if (!selectedFile) return
    const file = selectedFile
    const fileName = file.name.toLowerCase()
    const parseCb = (rows: any[], columns: string[]) => {
      setPreview({ type: 'file', object: { file, rows, columns } })
    }
    const errorCb = (err: any) => setFileUploadError(getErrorMessage(err))
    if (fileName.endsWith('.csv') || fileName.endsWith('.tsv')) {
      parseCsvOrTsv(file, parseCb, errorCb)
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      parseExcel(file, parseCb, errorCb)
    } else {
      setFileUploadError("Unsupported file type. Please upload a CSV, TSV, or Excel file.")
    }
  }

  // ----- URL Preview -----
  function handleUrlPreview() {
    setUrlUploadError(null)
    setAddError(null)
    if (!urlInput) return
    parseUrlCsv(
      urlInput,
      (rows, columns) => {
        setPreview({ type: 'url', object: { url: urlInput, rows, columns } })
      },
      (err) => setUrlUploadError(getErrorMessage(err))
    )
  }

  // ----- Add Dataset (Unified) -----
  async function handleAddDataset() {
    setAddError(null)
    if (!preview) return
    try {
      const { has_dataset } = await getSessionDatasetActive();
      if (has_dataset) {
        setShowSessionWarning(true);
        setPendingAdd(true);
        return;
      }
      await doAddDataset();
    } catch (err) {
      setAddError(getErrorMessage(err));
    }
  }

  async function doAddDataset() {
    if (!preview) return;
    if (preview.type === 'file') {
      setFileLoading(true)
      try {
        const datasetTitle = fileTitle.trim() || preview.object.file.name
        await uploadDataset(preview.object.file, datasetTitle)
        toast({
          title: "Dataset uploaded!",
          description: "Your dataset was uploaded and is ready for analysis.",
          variant: "default",
        })
        router.push(`dashboard`)
      } catch (err: any) {
        if (err?.status === 409) {
          router.replace("/dashboard")
          return
        }
        const msg = getErrorMessage(err)
        setAddError(msg)
        toast({
          title: "Upload failed",
          description: msg,
          variant: "destructive",
        })
      } finally {
        setFileLoading(false)
      }
    } else if (preview.type === 'url') {
      setUrlLoading(true)
      try {
        const datasetTitle = urlTitle.trim() || preview.object.url
        await uploadDatasetByUrl(preview.object.url, datasetTitle)
        toast({
          title: "Dataset uploaded!",
          description: "Your dataset was uploaded and is ready for analysis.",
          variant: "default",
        })
        router.push(`dashboard`)
      } catch (err: any) {
        const msg = getErrorMessage(err)
        setAddError(msg)
        toast({
          title: "Upload failed",
          description: msg,
          variant: "destructive",
        })
      } finally {
        setUrlLoading(false)
      }
    }
  }

  // ----- Clear File Input -----
  function handleClearFile() {
    setSelectedFile(null)
    setFileUploadError(null)
    // Preview persists until a new preview is done (as per requirements)
  }

  // Render
  return (
    <>
      <SessionDatasetWarningDialog
        open={showSessionWarning}
        onConfirm={async () => {
          setShowSessionWarning(false);
          setPendingAdd(false);
          await doAddDataset();
        }}
        onCancel={() => {
          setShowSessionWarning(false);
          setPendingAdd(false);
        }}
      />
      <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient-primary">Upload New Dataset</h1>
          <p className="text-muted-foreground">Choose your data source to begin analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* File Upload */}
          <Card className="professional-card w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Upload CSV, TSV, or Excel File
              </CardTitle>
              <CardDescription>Choose File (CSV, TSV, or Excel files up to {MAX_FILE_SIZE_MB}MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="relative w-full">
                  <Input
                    type="text"
                    readOnly
                    value={selectedFile ? selectedFile.name : ''}
                    placeholder="Choose File (CSV, TSV, or Excel)"
                    className={`h-12 w-full pl-32 pr-12 text-base font-normal focus:outline-primary rounded-md ${selectedFile ? '' : 'text-muted-foreground'}`}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-0 top-0 h-12 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-medium rounded-l-md shadow hover:from-indigo-700 hover:to-cyan-700 transition border-none focus:outline-none"
                    style={{ zIndex: 2 }}
                  >
                    Choose file
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none rounded-md"
                      aria-label="Clear file"
                      style={{ zIndex: 2 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.tsv,.xls,.xlsx"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > MAX_FILE_SIZE_BYTES) {
                          setFileUploadError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`)
                          setSelectedFile(null)
                          return
                        }
                        setSelectedFile(file)
                        setFileUploadError(null)
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleFilePreview}
                  disabled={!selectedFile}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow rounded-md"
                >
                  Preview Dataset
                </Button>
              </div>
              {fileUploadError && (
                <div className="text-red-600 text-sm text-center mt-2">{fileUploadError}</div>
              )}
            </CardContent>
          </Card>
          {/* URL Upload */}
          <Card className="professional-card w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Upload via URL
              </CardTitle>
              <CardDescription>Enter a direct link to your CSV, TSV, or Excel file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 w-full">
                <Input
                  placeholder="https://example.com/data.csv"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full h-12 text-base font-normal focus:outline-primary rounded-md"
                />
                <Button
                  onClick={handleUrlPreview}
                  disabled={!urlInput}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover-glow rounded-md"
                >
                  Preview Dataset
                </Button>
              </div>
              {urlUploadError && (
                <div className="text-red-600 text-sm text-center mt-2">{urlUploadError}</div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Preview/Add Card */}
        {preview && (
          <Card className="professional-card w-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DatasetPreviewTable
                preview={{
                  columns: preview.object.columns,
                  sample_rows: preview.object.rows,
                }}
              />
              <div className="flex flex-row flex-wrap justify-between mt-4 gap-2 md:gap-4 items-center w-full">
                <div className="flex-1 flex items-center justify-start min-w-[220px] px-4">
                  {addError && (
                    <span className="text-red-600 text-sm text-left ml-4">
                      {typeof addError === "string" ? addError : JSON.stringify(addError)}
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-2 w-full md:w-auto items-center justify-end">
                  <input
                    type="text"
                    placeholder={
                      preview.type === 'file'
                        ? preview.object.file
                          ? `Title (default: ${preview.object.file.name})`
                          : 'Title (optional)'
                        : preview.type === 'url'
                          ? preview.object.url
                            ? `Title (default: ${preview.object.url})`
                            : 'Title (optional)'
                          : 'Title (optional)'
                    }
                    className="border px-3 py-2 rounded h-12 w-full md:w-80 lg:w-96 text-base font-normal focus:outline-primary rounded-md"
                    value={preview.type === 'file' ? fileTitle : urlTitle}
                    onChange={e => {
                      if (preview.type === 'file') setFileTitle(e.target.value)
                      else if (preview.type === 'url') setUrlTitle(e.target.value)
                    }}
                  />
                  <Button
                    onClick={handleAddDataset}
                    className="w-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-md py-2 flex items-center justify-center space-x-2 h-12 hover-glow"
                    variant="default"
                    disabled={fileLoading || urlLoading}
                  >
                    {(fileLoading || urlLoading)
                      ? 'Uploading...'
                      : 'Add Dataset'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
