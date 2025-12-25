"use client"

import { useState, useEffect } from "react"
import { UploadScreen } from "@/components/upload-screen"
import { AnalyzingScreen } from "@/components/analyzing-screen"
import { ResultScreen } from "@/components/result-screen"
import { DiveLogResults } from "@/components/dive-log-results"

interface SpeciesInfo {
    common_name: string
    scientific_name: string
    about: string
    habitat: string
    size: string
    behavior: string
    conservation_status?: string
    fun_facts?: string[]
    did_you_know?: string
    is_dangerous?: string | null
}

interface CategorizedSpecies {
    new: SpeciesInfo[]
    rare: SpeciesInfo[]
    dangerous: SpeciesInfo[]
    common: {
        fish: SpeciesInfo[]
        corals: SpeciesInfo[]
        crabs: SpeciesInfo[]
        other: SpeciesInfo[]
    }
}

export default function MarineSpeciesRecognition() {
    const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single")
    const [currentScreen, setCurrentScreen] = useState<"upload" | "analyzing" | "result">("upload")

    const [selectedImage, setSelectedImage] = useState<string | null>(null) // base64 for API/result display
    const [previewUrl, setPreviewUrl] = useState<string>("") // Blob URL for fast preview

    const [speciesData, setSpeciesData] = useState<SpeciesInfo | null>(null)
    const [confidence, setConfidence] = useState<number>(0)

    const [diveLogData, setDiveLogData] = useState<CategorizedSpecies | null>(null)
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [totalFiles, setTotalFiles] = useState(0)

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const handleImageUpload = async (file: File) => {
        const imageDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                resolve(result)
            }
            reader.readAsDataURL(file)
        })

        setSelectedImage(imageDataUrl)
        setCurrentScreen("analyzing")

        try {
            const formData = new FormData()
            formData.append("image", file)

            const response = await fetch("/api/classify", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                setSpeciesData(data.speciesInfo)
                setConfidence(data.confidence)
                setCurrentScreen("result")
            } else {
                console.error("API Error:", data.error)
                const errorMsg =
                    data.error.includes("quota") || data.error.includes("Too Many Requests")
                        ? "API quota exceeded. Please wait a few minutes and try again, or check your Gemini API plan."
                        : `Failed to identify species: ${data.error}`
                alert(errorMsg)
                setCurrentScreen("upload")
            }
        } catch (error) {
            console.error("Error classifying species:", error)
            const errorMsg =
                error instanceof Error && error.message.includes("quota")
                    ? "API quota exceeded. Please wait and try again later."
                    : "An error occurred. Please try again."
            alert(errorMsg)
            setCurrentScreen("upload")
        }
    }

    const handleBulkUpload = async (files: File[]) => {
        setTotalFiles(files.length)
        setAnalysisProgress(0)
        setCurrentScreen("analyzing")

        try {
            const imagePromises = files.map(
                (file) =>
                    new Promise<string>((resolve) => {
                        const reader = new FileReader()
                        reader.onloadend = () => resolve(reader.result as string)
                        reader.readAsDataURL(file)
                    }),
            )

            const base64Images = await Promise.all(imagePromises)

            const response = await fetch("/api/batch-classify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images: base64Images }),
            })

            if (!response.ok) {
                const text = await response.text()
                console.error("API error response:", text)
                alert(`API returned status ${response.status}. Please restart the dev server (Ctrl+C then npm run dev).`)
                setCurrentScreen("upload")
                return
            }

            const data = await response.json()

            if (data.success) {
                setDiveLogData(data.categorized)
                setCurrentScreen("result")
            } else {
                alert(`Failed to analyze dive log: ${data.error}`)
                setCurrentScreen("upload")
            }
        } catch (error) {
            console.error("Error processing dive log:", error)
            alert("An error occurred while processing your dive log. Please try again.")
            setCurrentScreen("upload")
        }
    }

    const handleReset = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        setCurrentScreen("upload")
        setSelectedImage(null)
        setPreviewUrl("")
        setSpeciesData(null)
        setConfidence(0)
        setDiveLogData(null)
        setAnalysisProgress(0)
        setTotalFiles(0)
    }

    return (
        <div className="min-h-screen bg-black">
            {currentScreen === "upload" && (
                <UploadScreen
                    onImageUpload={handleImageUpload}
                    onBulkUpload={handleBulkUpload}
                    uploadMode={uploadMode}
                    setUploadMode={setUploadMode}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                />
            )}
            {currentScreen === "analyzing" && (
                <AnalyzingScreen isBulk={uploadMode === "bulk"} progress={analysisProgress} total={totalFiles} />
            )}
            {currentScreen === "result" && uploadMode === "single" && speciesData && selectedImage && (
                <ResultScreen image={selectedImage} speciesData={speciesData} confidence={confidence} onReset={handleReset} />
            )}
            {currentScreen === "result" && uploadMode === "bulk" && diveLogData && (
                <DiveLogResults data={diveLogData} onReset={handleReset} />
            )}
        </div>
    )
}
