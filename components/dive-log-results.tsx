"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react"

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
    image?: string
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

interface DiveLogResultsProps {
    data: CategorizedSpecies
    onReset: () => void
}

export function DiveLogResults({ data, onReset }: DiveLogResultsProps) {
    const [activeTab, setActiveTab] = useState<"fish" | "corals" | "crabs" | "other">("fish")
    const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInfo | null>(null)

    const totalSpecies =
        data.new.length +
        data.rare.length +
        data.dangerous.length +
        Object.values(data.common).reduce((sum, arr) => sum + arr.length, 0)

    const Carousel = ({ items, title }: { items: SpeciesInfo[]; title: string }) => {
        const [currentIndex, setCurrentIndex] = useState(0)

        if (items.length === 0) return null

        return (
            <div style={{ marginBottom: "48px" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", marginBottom: "24px" }}>{title}</h3>
                <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                    <div
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "20px",
                            padding: "32px",
                            border: "2px solid #4b5563",
                        }}
                    >
                        <h4 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
                            {items[currentIndex].common_name}
                        </h4>
                        <p style={{ fontSize: "1rem", color: "#9ca3af", marginBottom: "16px", fontStyle: "italic" }}>
                            {items[currentIndex].scientific_name}
                        </p>
                        <p style={{ fontSize: "1rem", color: "#d1d5db", lineHeight: "1.6" }}>{items[currentIndex].about}</p>
                    </div>

                    {items.length > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
                            <button
                                onClick={() => setCurrentIndex((currentIndex - 1 + items.length) % items.length)}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "50%",
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "none",
                                }}
                            >
                                <ChevronLeft size={24} color="#000000" />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "50%",
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "none",
                                }}
                            >
                                <ChevronRight size={24} color="#000000" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const SpeciesDetailModal = ({ species, onClose }: { species: SpeciesInfo; onClose: () => void }) => {
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
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.95)",
                    zIndex: 1000,
                    overflowY: "auto",
                    padding: "24px",
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        paddingTop: "24px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            top: "24px",
                            right: "24px",
                            backgroundColor: "#ffffff",
                            borderRadius: "50%",
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            cursor: "pointer",
                            zIndex: 1001,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <X size={24} color="#000000" />
                    </button>

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
                        Species Details
                    </h1>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isDesktop ? "450px 1fr" : "1fr",
                            gap: "48px",
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
                                }}
                            >
                                {species.image && (
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
                                            src={species.image || "/placeholder.svg"}
                                            alt={species.common_name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                display: "block",
                                            }}
                                        />
                                    </div>
                                )}

                                <h2
                                    style={{
                                        fontSize: "28px",
                                        fontWeight: "bold",
                                        color: "white",
                                        marginBottom: "8px",
                                        lineHeight: "1.3",
                                    }}
                                >
                                    {species.common_name}
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
                                    {species.scientific_name}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Species Information */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <InfoSection title="About" content={species.about} />
                            <InfoSection title="Habitat" content={species.habitat} />
                            <InfoSection title="Size" content={species.size} />
                            <InfoSection title="Behavior" content={species.behavior} />

                            {species.conservation_status && (
                                <InfoSection title="Conservation Status" content={species.conservation_status} />
                            )}

                            {species.fun_facts && species.fun_facts.length > 0 && (
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
                                        {species.fun_facts.map((fact, index) => (
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

                            {species.did_you_know && <InfoSection title="Did You Know?" content={species.did_you_know} />}

                            {species.is_dangerous && (
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
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <AlertTriangle size={24} />
                                        Safety Information
                                    </h3>
                                    <p style={{ color: "#fecaca", lineHeight: "1.7", fontSize: "15px" }}>{species.is_dangerous}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const InfoSection = ({ title, content }: { title: string; content: string }) => {
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

    return (
        <div style={{ minHeight: "100vh", padding: "80px 24px", color: "#ffffff" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Hero Section - Dive Stats */}
                <div style={{ textAlign: "center", marginBottom: "64px" }}>
                    <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "32px" }}>Dive Log Summary</h1>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>
                        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "24px 32px", borderRadius: "16px" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{totalSpecies}</div>
                            <div style={{ fontSize: "1rem", color: "#9ca3af" }}>Total Species</div>
                        </div>
                        <div style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", padding: "24px 32px", borderRadius: "16px" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{data.new.length}</div>
                            <div style={{ fontSize: "1rem", color: "#9ca3af" }}>New Discoveries</div>
                        </div>
                        <div style={{ backgroundColor: "rgba(234, 179, 8, 0.2)", padding: "24px 32px", borderRadius: "16px" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{data.rare.length}</div>
                            <div style={{ fontSize: "1rem", color: "#9ca3af" }}>Rare Species</div>
                        </div>
                        <div style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", padding: "24px 32px", borderRadius: "16px" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{data.dangerous.length}</div>
                            <div style={{ fontSize: "1rem", color: "#9ca3af" }}>Dangerous Species</div>
                        </div>
                    </div>
                </div>

                {/* New Species Carousel */}
                <Carousel items={data.new} title="🎉 New Species Discovered" />

                {/* Rare Species Carousel */}
                <Carousel items={data.rare} title="💎 Rare Species Spotted" />

                {/* Dangerous Species */}
                {data.dangerous.length > 0 && (
                    <div style={{ marginBottom: "48px" }}>
                        <h3
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#ef4444",
                                marginBottom: "24px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <AlertTriangle size={28} />
                            Dangerous Species Alert
                        </h3>
                        <div style={{ display: "grid", gap: "16px" }}>
                            {data.dangerous.map((species, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedSpecies(species)}
                                    style={{
                                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                                        border: "2px solid #ef4444",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"
                                    }}
                                >
                                    <h4 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
                                        {species.common_name}
                                    </h4>
                                    <p style={{ fontSize: "1rem", color: "#fca5a5", fontWeight: "600", marginBottom: "12px" }}>
                                        ⚠️ {species.is_dangerous}
                                    </p>
                                    <p style={{ fontSize: "0.95rem", color: "#d1d5db", lineHeight: "1.6" }}>{species.about}</p>
                                    <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginTop: "12px" }}>Click for more details</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Species - Tabbed View */}
                <div style={{ marginBottom: "48px" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", marginBottom: "24px" }}>
                        Common Species Seen
                    </h3>

                    <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                        {(["fish", "corals", "crabs", "other"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    backgroundColor: activeTab === tab ? "#ffffff" : "transparent",
                                    color: activeTab === tab ? "#000000" : "#ffffff",
                                    border: activeTab === tab ? "none" : "2px solid #4b5563",
                                    cursor: "pointer",
                                    textTransform: "capitalize",
                                }}
                            >
                                {tab} ({data.common[tab].length})
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {data.common[activeTab].map((species, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedSpecies(species)}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderRadius: "16px",
                                    padding: "24px",
                                    border: "2px solid #4b5563",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                                    e.currentTarget.style.borderColor = "#ffffff"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                                    e.currentTarget.style.borderColor = "#4b5563"
                                }}
                            >
                                <h4 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#ffffff", marginBottom: "6px" }}>
                                    {species.common_name}
                                </h4>
                                <p style={{ fontSize: "0.875rem", color: "#9ca3af", fontStyle: "italic", marginBottom: "12px" }}>
                                    {species.scientific_name}
                                </p>
                                <p style={{ fontSize: "0.9rem", color: "#d1d5db", lineHeight: "1.5" }}>
                                    {species.about.substring(0, 100)}...
                                </p>
                                <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginTop: "12px" }}>Click for details</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reset Button */}
                <div style={{ textAlign: "center", marginTop: "64px" }}>
                    <button
                        onClick={onReset}
                        style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                            borderRadius: "14px",
                            padding: "16px 48px",
                            fontSize: "1.125rem",
                            fontWeight: "700",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)",
                        }}
                    >
                        Log Another Dive
                    </button>
                </div>
            </div>

            {/* Species Detail Modal */}
            {selectedSpecies && <SpeciesDetailModal species={selectedSpecies} onClose={() => setSelectedSpecies(null)} />}
        </div>
    )
}
