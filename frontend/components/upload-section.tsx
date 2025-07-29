"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { uploadDataset, uploadDatasetByUrl } from "@/app/upload/upload.api"
import { parseCsvOrTsv, parseExcel, parseUrlCsv } from "@/lib/parser"
import { DatasetPreviewTable } from "./ui/dataset-preview-table"
import { useSessionDatasets } from "@/lib/data-provider"

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadSection() {
  const { toast } = useToast()
  const router = useRouter();
  const sessionDatasets = useSessionDatasets();

  const [file, setFile] = useState<File | null>(null)
  const [datasetUrl, setDatasetUrl] = useState<string>("")
  const [preview, setPreview] = useState<{ rows: any[] | null, columns: string[] | null }>({ rows: null, columns: null })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState<string>("")

  const [uploadType, setUploadType] = useState<string>("file")

  const handlePreview = (input: File | string) => {
    setUploadError(null)
    if (input instanceof File) {
      const fileName = input.name.toLowerCase();
      if (fileName.endsWith('.csv') || fileName.endsWith('.tsv')) {
        parseCsvOrTsv(input, (rows, columns) => setPreview({ rows, columns }), setUploadError)
      } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        parseExcel(input, (rows, columns) => setPreview({ rows, columns }), setUploadError)
      } else {
        setUploadError("Unsupported file type. Please upload a CSV, TSV, or Excel file.")
        setPreview({ rows: null, columns: null })
      }
    } else if (typeof input === "string") {
      parseUrlCsv(input, (rows, columns) => setPreview({ rows, columns }), setUploadError)
    } else {
      setUploadError("Invalid input for preview.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
        setPreview({ rows: null, columns: null });
        return;
      }
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const addDataset = async () => {
    setAddError(null)
    setLoading(true)
    try {
      let response
      let datasetTitle = title.trim() || (file ? file.name : "")
      if (file) {
        response = await uploadDataset(file, datasetTitle)
      } else if (datasetUrl) {
        response = await uploadDatasetByUrl(datasetUrl, datasetTitle)
      } else {
        throw new Error("No file or dataset URL provided.")
      }
      setFile(null)
      setDatasetUrl("")
      setPreview({ rows: null, columns: null })
      setTitle("")
      // Refresh session datasets so Navbar updates
      sessionDatasets?.refresh?.();
      toast({
        title: "Dataset uploaded!",
        description: "Your dataset was uploaded and is ready for analysis.",
        variant: "default",
      })
      if (response && response.id) {
        router.push(`datasets/${response.id}`);
      }
    } catch (err: any) {
      setAddError(err?.message || "Failed to upload dataset.")
      toast({
        title: "Upload failed",
        description: err?.message || "Failed to upload dataset.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setFile(null)
    setDatasetUrl("")
    setPreview({ rows: null, columns: null })
    setUploadError(null)
    setAddError(null)
    setUploadType(tab)
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 py-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upload New Dataset</h2>
            <div className="space-y-2">
              <label className="font-medium">Upload Method</label>
              <RadioGroup
                value={uploadType}
                onValueChange={handleTabChange}
                className="flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file">Upload File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="link" />
                  <Label htmlFor="link">Paste Link</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            {uploadType === "file" ? (
              <div className="flex flex-col space-y-2">
                <label htmlFor="fileInput" className="font-medium">
                  Choose File (CSV, TSV, or Excel files up to {MAX_FILE_SIZE_MB}MB)
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv,.tsv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="border px-3 py-2 rounded h-12"
                  key={file ? 'file-selected' : 'no-file'}
                />
                <button
                  className={`w-full bg-primary text-white rounded py-2 flex items-center justify-center space-x-2
                    ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => file && handlePreview(file)}
                  disabled={!file}
                >
                  <Upload className="h-4 w-4" />
                  <span>Preview Dataset</span>
                </button>
                {uploadError && (
                  <div className="text-red-600 text-sm text-center mt-2">{uploadError}</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <label htmlFor="urlInput" className="font-medium">
                  Upload Dataset From URL (CSV, TSV, or Excel files up to {MAX_FILE_SIZE_MB}MB)
                </label>
                <input
                  id="urlInput"
                  type="url"
                  placeholder="https://example.com/dataset.csv"
                  value={datasetUrl ?? ""}
                  onChange={e => setDatasetUrl(e.target.value || "")}
                  className="border px-3 py-2 rounded h-12"
                />
                <button
                  className={`w-full bg-primary text-white rounded py-2 flex items-center justify-center space-x-2
                    ${!datasetUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handlePreview(datasetUrl)}
                  disabled={!datasetUrl}
                >
                  <Upload className="h-4 w-4" />
                  <span>Preview Dataset</span>
                </button>
                {uploadError && (
                  <div className="text-red-600 text-sm text-center mt-2">{uploadError}</div>
                )}
              </div>
            )}
          </div>
        </div>
        {preview.rows && preview.columns && (
          <>
            <div className="mt-6 overflow-auto border rounded-md max-h-64">
              <DatasetPreviewTable preview={{ columns: preview.columns, sample_rows: preview.rows }} />
            </div>

            <div className="flex flex-row justify-between mt-4 gap-2 md:gap-4 items-center w-full">
              <div className="flex-1 flex items-center justify-start min-w-[220px] px-40">
                {addError && (
                  <span className="text-red-600 text-sm text-left ml-4">{addError}</span>
                )}
              </div>
              <div className="flex flex-row gap-2 w-full md:w-auto items-center justify-end">
                <input
                  type="text"
                  placeholder={file ? `Title (default: ${file.name})` : "Title (optional)"}
                  className="border px-3 py-2 rounded h-12 w-full md:w-80 lg:w-96 text-base font-normal focus:outline-primary"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <Button
                  onClick={addDataset}
                  className="w-auto bg-primary text-white rounded py-2 flex items-center justify-center space-x-2 h-12"
                  variant="outline"
                  disabled={!preview.columns || !preview.rows || loading}
                >
                  {loading ? "Uploading..." : "Add Dataset"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
