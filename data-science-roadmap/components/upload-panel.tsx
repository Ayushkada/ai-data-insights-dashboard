"use client"

import React, { useState } from "react"
import { Upload, Link2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { uploadDataset, uploadDatasetByUrl } from "@/app/upload/upload.api"
import { DatasetPreviewTable } from "./dataset-preview-table"
import { parseCsvOrTsv, parseExcel, parseUrlCsv } from "@/lib/parser"
import { useDataContext } from "./data-provider"
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadPanel() {
  const { toast } = useToast()
  const { refreshNavbar } = useDataContext();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null)
  const [datasetUrl, setDatasetUrl] = useState("")
  const [preview, setPreview] = useState<{ rows: any[] | null, columns: string[] | null }>({ rows: null, columns: null })
  const [activeTab, setActiveTab] = useState("csv")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePreview = (input: File | string) => {
    setError(null)
    if (input instanceof File) {
      const fileName = input.name.toLowerCase();
      if (fileName.endsWith('.csv') || fileName.endsWith('.tsv')) {
        parseCsvOrTsv(input, (rows, columns) => setPreview({ rows, columns }), setError)
      } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        parseExcel(input, (rows, columns) => setPreview({ rows, columns }), setError)
      } else {
        setError("Unsupported file type. Please upload a CSV, TSV, or Excel file.")
        setPreview({ rows: null, columns: null })
      }
    } else if (typeof input === "string") {
      parseUrlCsv(input, (rows, columns) => setPreview({ rows, columns }), setError)
    } else {
      setError("Invalid input for preview.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`)
        setFile(null)
        setPreview({ rows: null, columns: null })
        return
      }
      setFile(selectedFile)
      handlePreview(selectedFile)
    }
  }

  const handleUrlPreview = () => {
    if (!datasetUrl) {
      setError("Please enter a URL.")
      return
    }
    handlePreview(datasetUrl)
  }

  const addDataset = async () => {
    setError(null)
    setLoading(true)
    try {
      let response
      if (file) {
        response = await uploadDataset(file, file.name)
      } else if (datasetUrl) {
        response = await uploadDatasetByUrl(datasetUrl)
      } else {
        throw new Error("No file or dataset URL provided.")
      }
      setFile(null)
      setDatasetUrl("")
      setPreview({ rows: null, columns: null })
      toast({
        title: "Dataset uploaded!",
        description: "Your dataset was uploaded and is ready for analysis.",
        variant: "default",
      })
      refreshNavbar();
      if (response && response.id) {
        router.push(`/dashboard?dataset=${response.id}`);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload dataset.")
      toast({
        title: "Upload failed",
        description: err?.message || "Failed to upload dataset.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset state when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setFile(null)
    setDatasetUrl("")
    setPreview({ rows: null, columns: null })
    setError(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex items-center">
        <CardTitle> Upload Your Dataset </CardTitle>
        <CardDescription>Choose how you'd like to add your data for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Dataset URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-700">Click to upload or drag and drop</span>
                <p className="text-sm text-gray-500 mt-1">CSV, TSV, or Excel files up to {MAX_FILE_SIZE_MB}MB</p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.tsv,.xls,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            {file && (
              <div className="text-sm text-green-600 text-center">Selected: {file.name}</div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataset-url">Dataset URL</Label>
              <Input
                id="dataset-url"
                placeholder="https://example.com/dataset.csv"
                value={datasetUrl}
                onChange={(e) => setDatasetUrl(e.target.value)}
              />
              <Button onClick={handleUrlPreview} className="w-full" variant="outline">
                Preview URL Dataset
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="text-red-600 text-sm text-center mt-2">{error}</div>
        )}

        {preview.rows && preview.columns && (
          <div className="mt-6 overflow-auto border rounded-md max-h-64">
            <DatasetPreviewTable preview={{ columns: preview.columns, sample_rows: preview.rows }} />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={addDataset}
            className="w-full"
            variant="outline"
            disabled={!preview.columns || !preview.rows || loading}
          >
            {loading ? "Uploading..." : "Add Dataset"}
          </Button>

        </div>
      </CardContent>
    </Card>
  )
}
