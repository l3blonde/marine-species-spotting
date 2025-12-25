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
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 24px",
            }}
        >
            <div style={{ width: "100%", maxWidth: "900px" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                            marginBottom: "16px",
                            lineHeight: "1.2",
                        }}
                    >
                        Marine Species Recognition
                    </h1>
                    <p style={{ fontSize: "1.125rem", color: "#d1d5db", lineHeight: "1.75" }}>Identify marine life using AI</p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px", gap: "12px" }}>
                    <button
                        onClick={() => {
                            setUploadMode("single")
                            bulkPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
                            setBulkPreviewUrls([])
                            setSelectedFiles([])
                            setSelectedFile(null)
                            setPreviewUrl("")
                        }}
                        style={{
                            padding: "12px 32px",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            backgroundColor: uploadMode === "single" ? "#ffffff" : "transparent",
                            color: uploadMode === "single" ? "#000000" : "#ffffff",
                            border: uploadMode === "single" ? "none" : "2px solid #4b5563",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
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
                        style={{
                            padding: "12px 32px",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            backgroundColor: uploadMode === "bulk" ? "#ffffff" : "transparent",
                            color: uploadMode === "bulk" ? "#000000" : "#ffffff",
                            border: uploadMode === "bulk" ? "none" : "2px solid #4b5563",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Images size={20} />
                        Dive Log (Multiple)
                    </button>
                </div>

                <div
                    style={{
                        position: "relative",
                        border: "3px dashed #9ca3af",
                        borderRadius: "24px",
                        padding: "80px 40px",
                        marginBottom: "32px",
                        backgroundColor: isDragging ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
                        transition: "all 0.3s ease",
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple={uploadMode === "bulk"}
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                        id="file-upload"
                    />

                    <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "24px",
                            }}
                        >
                            {uploadMode === "bulk" && selectedFiles.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "16px",
                                        color: "#ffffff",
                                        width: "100%",
                                    }}
                                >
                                    <Images style={{ height: "40px", width: "40px" }} />
                                    <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>
                    {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""} selected
                  </span>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                                            gap: "12px",
                                            width: "100%",
                                            maxWidth: "600px",
                                            marginTop: "16px",
                                        }}
                                    >
                                        {bulkPreviewUrls.slice(0, 6).map((url, index) => (
                                            <img
                                                key={index}
                                                src={url || "/placeholder.svg"}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "2px solid #4b5563",
                                                }}
                                            />
                                        ))}
                                        {selectedFiles.length > 6 && (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "100px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    border: "2px solid #4b5563",
                                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                    fontSize: "1.5rem",
                                                    fontWeight: "600",
                                                    color: "#ffffff",
                                                }}
                                            >
                                                +{selectedFiles.length - 6}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : uploadMode === "single" && selectedFile && previewUrl ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "16px",
                                        color: "#ffffff",
                                    }}
                                >
                                    <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        style={{
                                            maxWidth: "300px",
                                            maxHeight: "300px",
                                            objectFit: "contain",
                                            borderRadius: "12px",
                                            border: "3px solid #4b5563",
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <Upload style={{ height: "64px", width: "64px", color: "#ffffff", opacity: 0.9 }} />
                                    <div style={{ textAlign: "center" }}>
                                        <p
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: "500",
                                                color: "#ffffff",
                                                marginBottom: "8px",
                                                lineHeight: "1.6",
                                            }}
                                        >
                                            Drop {uploadMode === "bulk" ? "images" : "image"} here
                                        </p>
                                        <p style={{ fontSize: "1rem", color: "#d1d5db", lineHeight: "1.6" }}>or click to browse</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                    <button
                        onClick={handleScan}
                        disabled={!canSubmit}
                        style={{
                            backgroundColor: canSubmit ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                            color: "#000000",
                            borderRadius: "14px",
                            padding: "16px 48px",
                            fontSize: "1.125rem",
                            fontWeight: "700",
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            boxShadow: canSubmit ? "0 10px 25px rgba(255, 255, 255, 0.2)" : "none",
                            cursor: canSubmit ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease",
                            opacity: canSubmit ? 1 : 0.5,
                        }}
                        onMouseEnter={(e) => {
                            if (canSubmit) {
                                e.currentTarget.style.transform = "scale(1.05)"
                                e.currentTarget.style.boxShadow = "0 15px 35px rgba(255, 255, 255, 0.3)"
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                            e.currentTarget.style.boxShadow = canSubmit ? "0 10px 25px rgba(255, 255, 255, 0.2)" : "none"
                        }}
                    >
                        {uploadMode === "bulk" ? "Analyze Dive Log" : "Scan Species"}
                    </button>
                </div>

                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <p style={{ fontSize: "1rem", color: "#d1d5db", lineHeight: "1.75", letterSpacing: "0.025em" }}>
                        Sharks • Sea turtles • Octopus • Jellyfish • +20 more
                    </p>
                </div>

                <div style={{ marginTop: "40px", maxWidth: "700px", margin: "0 auto" }}>
                    <button
                        onClick={() => setShowTips(!showTips)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            margin: "0 auto",
                            color: "#d1d5db",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            backgroundColor: "transparent",
                            border: "1px solid #4b5563",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                            e.currentTarget.style.color = "#ffffff"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.color = "#d1d5db"
                        }}
                    >
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>Tips for best results</span>
                        <ChevronDown
                            style={{
                                height: "20px",
                                width: "20px",
                                transform: showTips ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    </button>

                    {showTips && (
                        <div
                            style={{
                                marginTop: "24px",
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "2px solid #6b7280",
                            }}
                        >
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        fontSize: "1rem",
                                        color: "#e5e7eb",
                                        lineHeight: "1.75",
                                    }}
                                >
                                    <span style={{ color: "#ffffff", marginTop: "2px" }}>•</span>
                                    <span>Use clear, well-lit photos</span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        fontSize: "1rem",
                                        color: "#e5e7eb",
                                        lineHeight: "1.75",
                                    }}
                                >
                                    <span style={{ color: "#ffffff", marginTop: "2px" }}>•</span>
                                    <span>Ensure the marine species is the main subject</span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "12px",
                                        marginBottom: "16px",
                                        fontSize: "1rem",
                                        color: "#e5e7eb",
                                        lineHeight: "1.75",
                                    }}
                                >
                                    <span style={{ color: "#ffffff", marginTop: "2px" }}>•</span>
                                    <span>Avoid blurry or distant shots</span>
                                </li>
                                <li
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "12px",
                                        fontSize: "1rem",
                                        color: "#e5e7eb",
                                        lineHeight: "1.75",
                                    }}
                                >
                                    <span style={{ color: "#ffffff", marginTop: "2px" }}>•</span>
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
