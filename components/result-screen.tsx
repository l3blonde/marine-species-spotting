"use client"

import { useState, useEffect } from "react"

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

interface ResultScreenProps {
    image: string
    speciesData: SpeciesInfo
    confidence: number
    onReset: () => void
}

export function ResultScreen({ image, speciesData, confidence, onReset }: ResultScreenProps) {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    return (
        <div style={{ minHeight: "100vh", padding: "48px 24px" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <h1
                    style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                        marginBottom: "48px",
                        lineHeight: "1.3",
                    }}
                >
                    Species Identified!
                </h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isDesktop ? "450px 1fr" : "1fr",
                        gap: "48px",
                        marginBottom: "48px",
                    }}
                >
                    {/* Left Column: Image & Basic Info */}
                    <div>
                        <div
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "16px",
                                padding: "24px",
                                marginBottom: "24px",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "400px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    marginBottom: "24px",
                                    backgroundColor: "#1a1a1a",
                                }}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={speciesData.common_name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />
                            </div>

                            <h2
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    color: "white",
                                    marginBottom: "8px",
                                    lineHeight: "1.3",
                                }}
                            >
                                {speciesData.common_name}
                            </h2>

                            <p
                                style={{
                                    fontSize: "18px",
                                    fontStyle: "italic",
                                    color: "#a0a0a0",
                                    marginBottom: "16px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {speciesData.scientific_name}
                            </p>

                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "8px 16px",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "20px",
                                }}
                            >
                                <span style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: "500" }}>Confidence: {confidence}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Species Information */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <InfoSection title="About" content={speciesData.about} />
                        <InfoSection title="Habitat" content={speciesData.habitat} />
                        <InfoSection title="Size" content={speciesData.size} />
                        <InfoSection title="Behavior" content={speciesData.behavior} />

                        {speciesData.conservation_status && (
                            <InfoSection title="Conservation Status" content={speciesData.conservation_status} />
                        )}

                        {speciesData.fun_facts && speciesData.fun_facts.length > 0 && (
                            <div
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "16px",
                                    padding: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        color: "white",
                                        marginBottom: "16px",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    Fun Facts
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {speciesData.fun_facts.map((fact, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                color: "#d0d0d0",
                                                fontSize: "15px",
                                                lineHeight: "1.7",
                                                marginBottom: "12px",
                                                paddingLeft: "20px",
                                                position: "relative",
                                            }}
                                        >
                      <span
                          style={{
                              position: "absolute",
                              left: 0,
                              color: "white",
                              fontWeight: "bold",
                          }}
                      >
                        •
                      </span>
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {speciesData.did_you_know && <InfoSection title="Did You Know?" content={speciesData.did_you_know} />}

                        {speciesData.is_dangerous && (
                            <div
                                style={{
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    border: "2px solid rgba(239, 68, 68, 0.3)",
                                    borderRadius: "16px",
                                    padding: "24px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        color: "#fca5a5",
                                        marginBottom: "12px",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    ⚠️ Safety Information
                                </h3>
                                <p style={{ color: "#fecaca", lineHeight: "1.7", fontSize: "15px" }}>{speciesData.is_dangerous}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
                    <button
                        onClick={onReset}
                        style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                            fontWeight: "600",
                            fontSize: "18px",
                            padding: "16px 48px",
                            borderRadius: "14px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)",
                            transition: "all 0.2s",
                            lineHeight: "1.5",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f0f0"
                            e.currentTarget.style.transform = "scale(1.05)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff"
                            e.currentTarget.style.transform = "scale(1)"
                        }}
                    >
                        Scan Another Marine Species
                    </button>
                </div>
            </div>
        </div>
    )
}

function InfoSection({ title, content }: { title: string; content: string }) {
    return (
        <div
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
            }}
        >
            <h3
                style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "white",
                    marginBottom: "12px",
                    lineHeight: "1.4",
                }}
            >
                {title}
            </h3>
            <p style={{ color: "#d0d0d0", lineHeight: "1.7", fontSize: "15px" }}>{content}</p>
        </div>
    )
}
