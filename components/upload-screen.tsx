"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Upload, ChevronDown, Images } from "lucide-react"

interface UploadScreenProps {
    onImageUpload: (file: File) => void
    onBulkUpload: (files: File[]) => void
    uploadMode: "single" | "bulk"
    setUploadMode: (mode: "single" | "bulk") => void
    previewUrl: string
    setPreviewUrl: (url: string) => void
}

export function UploadScreen({
                                 onImageUpload,
                                 onBulkUpload,
                                 uploadMode,
                                 setUploadMode,
                                 previewUrl,
                                 setPreviewUrl,
                             }: UploadScreenProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [showTips, setShowTips] = useState(false)

    const [bulkPreviewUrls, setBulkPreviewUrls] = useState<string[]>([])

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
            bulkPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [previewUrl, bulkPreviewUrls])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

            if (uploadMode === "bulk") {
                setSelectedFiles(files)
                const urls = files.map((file) => URL.createObjectURL(file))
                setBulkPreviewUrls(urls)
            } else if (files.length > 0) {
                setSelectedFile(files[0])
                const url = URL.createObjectURL(files[0])
                setPreviewUrl(url)
            }
        },
        [uploadMode, setPreviewUrl],
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            if (uploadMode === "bulk") {
                const fileArray = Array.from(files)
                setSelectedFiles(fileArray)
                const urls = fileArray.map((file) => URL.createObjectURL(file))
                setBulkPreviewUrls(urls)
            } else {
                setSelectedFile(files[0])
                const url = URL.createObjectURL(files[0])
                setPreviewUrl(url)
            }
        }
    }

    const handleScan = () => {
        if (uploadMode === "single" && selectedFile) {
            onImageUpload(selectedFile)
        } else if (uploadMode === "bulk" && selectedFiles.length > 0) {
            onBulkUpload(selectedFiles)
        }
    }

    const canSubmit = uploadMode === "single" ? selectedFile : selectedFiles.length > 0

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
            <div className="w-full max-w-[900px]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Marine Species Recognition</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">Identify marine life using AI</p>
                </div>

                <div className="flex justify-center mb-8 gap-3">
                    <button
                        onClick={() => {
                            setUploadMode("single")
                            bulkPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
                            setBulkPreviewUrls([])
                            setSelectedFiles([])
                            setSelectedFile(null)
                            setPreviewUrl("")
                        }}
                        className={`px-8 py-3 rounded-xl text-base font-semibold transition-all ${
                            uploadMode === "single"
                                ? "bg-white text-black"
                                : "bg-transparent text-white border-2 border-gray-600 hover:border-gray-400"
                        }`}
                    >
                        Single Photo
                    </button>
                    <button
                        onClick={() => {
                            setUploadMode("bulk")
                            if (previewUrl) {
                                URL.revokeObjectURL(previewUrl)
                            }
                            setSelectedFile(null)
                            setPreviewUrl("")
                            setSelectedFiles([])
                            setBulkPreviewUrls([])
                        }}
                        className={`px-8 py-3 rounded-xl text-base font-semibold transition-all flex items-center gap-2 ${
                            uploadMode === "bulk"
                                ? "bg-white text-black"
                                : "bg-transparent text-white border-2 border-gray-600 hover:border-gray-400"
                        }`}
                    >
                        <Images size={20} />
                        Dive Log (Multiple)
                    </button>
                </div>

                <div
                    className={`relative border-3 border-dashed rounded-3xl p-20 mb-8 transition-all ${
                        isDragging ? "border-gray-400 bg-white/10" : "border-gray-400 bg-white/5"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple={uploadMode === "bulk"}
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />

                    <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center gap-6">
                            {uploadMode === "bulk" && selectedFiles.length > 0 ? (
                                <div className="flex flex-col items-center gap-4 text-white w-full">
                                    <Images className="h-10 w-10" />
                                    <span className="text-xl font-medium">
                    {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""} selected
                  </span>

                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 w-full max-w-[600px] mt-4">
                                        {bulkPreviewUrls.slice(0, 6).map((url, index) => (
                                            <img
                                                key={index}
                                                src={url || "/placeholder.svg"}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-[100px] object-cover rounded-lg border-2 border-gray-600"
                                            />
                                        ))}
                                        {selectedFiles.length > 6 && (
                                            <div className="w-full h-[100px] flex items-center justify-center rounded-lg border-2 border-gray-600 bg-white/10 text-2xl font-semibold text-white">
                                                +{selectedFiles.length - 6}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : uploadMode === "single" && selectedFile && previewUrl ? (
                                <div className="flex flex-col items-center gap-4 text-white">
                                    <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        className="max-w-[300px] max-h-[300px] object-contain rounded-xl border-3 border-gray-600"
                                    />
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-16 w-16 text-white opacity-90" />
                                    <div className="text-center">
                                        <p className="text-2xl font-medium text-white mb-2 leading-normal">
                                            Drop {uploadMode === "bulk" ? "images" : "image"} here
                                        </p>
                                        <p className="text-base text-gray-300 leading-normal">or click to browse</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>
                </div>

                <div className="flex justify-center mb-10">
                    <button
                        onClick={handleScan}
                        disabled={!canSubmit}
                        className={`rounded-[14px] px-12 py-4 text-lg font-bold border border-black/10 transition-all ${
                            canSubmit
                                ? "bg-white text-black shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_15px_35px_rgba(255,255,255,0.3)] cursor-pointer"
                                : "bg-white/30 text-black cursor-not-allowed opacity-50"
                        }`}
                    >
                        {uploadMode === "bulk" ? "Analyze Dive Log" : "Scan Species"}
                    </button>
                </div>

                <div className="text-center mb-12">
                    <p className="text-base text-gray-300 leading-relaxed tracking-wide">
                        Sharks • Sea turtles • Octopus • Jellyfish • +20 more
                    </p>
                </div>

                <div className="mt-10 max-w-[700px] mx-auto">
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-3 mx-auto text-gray-300 px-6 py-3 rounded-xl bg-transparent border border-gray-600 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                        <span className="text-base font-semibold">Tips for best results</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${showTips ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {showTips && (
                        <div className="mt-6 p-8 rounded-2xl bg-white/5 border-2 border-gray-500">
                            <ul className="list-none p-0 m-0">
                                <li className="flex items-start gap-3 mb-4 text-base text-gray-200 leading-relaxed">
                                    <span className="text-white mt-0.5">•</span>
                                    <span>Use clear, well-lit photos</span>
                                </li>
                                <li className="flex items-start gap-3 mb-4 text-base text-gray-200 leading-relaxed">
                                    <span className="text-white mt-0.5">•</span>
                                    <span>Ensure the marine species is the main subject</span>
                                </li>
                                <li className="flex items-start gap-3 mb-4 text-base text-gray-200 leading-relaxed">
                                    <span className="text-white mt-0.5">•</span>
                                    <span>Avoid blurry or distant shots</span>
                                </li>
                                <li className="flex items-start gap-3 text-base text-gray-200 leading-relaxed">
                                    <span className="text-white mt-0.5">•</span>
                                    <span>JPG and PNG formats work best</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
