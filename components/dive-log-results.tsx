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
    image?: string // Added image field
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
            <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
                <div className="relative max-w-[600px] mx-auto">
                    <div className="bg-white/5 rounded-3xl p-8 border-2 border-gray-600">
                        <h4 className="text-2xl font-semibold text-white mb-2">{items[currentIndex].common_name}</h4>
                        <p className="text-base text-gray-400 mb-4 italic">{items[currentIndex].scientific_name}</p>
                        <p className="text-base text-gray-300 leading-normal">{items[currentIndex].about}</p>
                    </div>

                    {items.length > 1 && (
                        <div className="flex justify-center gap-4 mt-5">
                            <button
                                onClick={() => setCurrentIndex((currentIndex - 1 + items.length) % items.length)}
                                className="bg-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border-none hover:bg-gray-100 transition-all"
                            >
                                <ChevronLeft size={24} color="#000000" />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
                                className="bg-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border-none hover:bg-gray-100 transition-all"
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
            <div className="fixed inset-0 bg-black/95 z-[1000] overflow-y-auto p-6" onClick={onClose}>
                <div className="max-w-[1400px] mx-auto pt-6" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={onClose}
                        className="fixed top-6 right-6 bg-white rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer z-[1001] shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:bg-gray-100 transition-all"
                    >
                        <X size={24} color="#000000" />
                    </button>

                    <h1 className="text-4xl font-bold text-white text-center mb-12 leading-tight">Species Details</h1>

                    <div className={`grid gap-12 ${isDesktop ? "grid-cols-[450px_1fr]" : "grid-cols-1"}`}>
                        {/* Left Column: Image & Basic Info */}
                        <div>
                            <div className="bg-white/5 border border-gray-600 rounded-3xl p-8">
                                {species.image && (
                                    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-6 bg-gray-900">
                                        <img
                                            src={species.image || "/placeholder.svg"}
                                            alt={species.common_name}
                                            className="w-full h-full object-contain block"
                                        />
                                    </div>
                                )}

                                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{species.common_name}</h2>

                                <p className="text-xl italic text-gray-500 mb-6 leading-normal">{species.scientific_name}</p>
                            </div>
                        </div>

                        {/* Right Column: Species Information */}
                        <div className="flex flex-col gap-5">
                            <InfoSection title="About" content={species.about} />
                            <InfoSection title="Habitat" content={species.habitat} />
                            <InfoSection title="Size" content={species.size} />
                            <InfoSection title="Behavior" content={species.behavior} />

                            {species.conservation_status && (
                                <InfoSection title="Conservation Status" content={species.conservation_status} />
                            )}

                            {species.fun_facts && species.fun_facts.length > 0 && (
                                <div className="bg-white/5 border border-gray-600 rounded-3xl p-8">
                                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">Fun Facts</h3>
                                    <ul className="list-none p-0 m-0">
                                        {species.fun_facts.map((fact, index) => (
                                            <li key={index} className="text-gray-300 text-base leading-normal mb-3 pl-6 relative">
                                                <span className="absolute left-0 text-white font-bold">•</span>
                                                {fact}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {species.did_you_know && <InfoSection title="Did You Know?" content={species.did_you_know} />}

                            {species.is_dangerous && (
                                <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8">
                                    <h3 className="text-2xl font-semibold text-red-500 mb-3 flex items-center gap-3">
                                        <AlertTriangle size={24} />
                                        Safety Information
                                    </h3>
                                    <p className="text-red-300 text-base leading-normal">{species.is_dangerous}</p>
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
            <div className="bg-white/5 border border-gray-600 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
                <p className="text-gray-300 text-base leading-normal">{content}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-20 px-6 text-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-8">Dive Log Summary</h1>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="bg-white/10 px-8 py-6 rounded-2xl">
                            <div className="text-4xl font-bold">{totalSpecies}</div>
                            <div className="text-base text-gray-400">Total Species</div>
                        </div>
                        <div className="bg-green-500/20 px-8 py-6 rounded-2xl">
                            <div className="text-4xl font-bold">{data.new.length}</div>
                            <div className="text-base text-gray-400">New Discoveries</div>
                        </div>
                        <div className="bg-yellow-500/20 px-8 py-6 rounded-2xl">
                            <div className="text-4xl font-bold">{data.rare.length}</div>
                            <div className="text-base text-gray-400">Rare Species</div>
                        </div>
                        <div className="bg-red-500/20 px-8 py-6 rounded-2xl">
                            <div className="text-4xl font-bold">{data.dangerous.length}</div>
                            <div className="text-base text-gray-400">Dangerous Species</div>
                        </div>
                    </div>
                </div>

                <Carousel items={data.new} title="🎉 New Species Discovered" />
                <Carousel items={data.rare} title="💎 Rare Species Spotted" />

                {data.dangerous.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-3">
                            <AlertTriangle size={28} />
                            Dangerous Species Alert
                        </h3>
                        <div className="grid gap-4">
                            {data.dangerous.map((species, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedSpecies(species)}
                                    className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 cursor-pointer transition-all hover:bg-red-500/20"
                                >
                                    <h4 className="text-xl font-semibold text-white mb-2">{species.common_name}</h4>
                                    <p className="text-base text-red-300 font-semibold mb-3">⚠️ {species.is_dangerous}</p>
                                    <p className="text-[15px] text-gray-300 leading-normal">{species.about}</p>
                                    <p className="text-sm text-gray-400 mt-3">Click for more details</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6">Common Species Seen</h3>

                    <div className="flex gap-3 mb-6 flex-wrap">
                        {(["fish", "corals", "crabs", "other"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl text-base font-semibold capitalize transition-all ${
                                    activeTab === tab
                                        ? "bg-white text-black"
                                        : "bg-transparent text-white border-2 border-gray-600 hover:border-gray-400"
                                }`}
                            >
                                {tab} ({data.common[tab].length})
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                        {data.common[activeTab].map((species, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedSpecies(species)}
                                className="bg-white/5 rounded-2xl p-6 border-2 border-gray-600 cursor-pointer transition-all hover:bg-white/10 hover:border-white"
                            >
                                <h4 className="text-lg font-semibold text-white mb-1.5">{species.common_name}</h4>
                                <p className="text-sm text-gray-400 italic mb-3">{species.scientific_name}</p>
                                <p className="text-[14px] text-gray-300 leading-normal">{species.about.substring(0, 100)}...</p>
                                <p className="text-sm text-gray-400 mt-3">Click for details</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <button
                        onClick={onReset}
                        className="bg-white text-black rounded-[14px] px-12 py-4 text-lg font-bold border-none cursor-pointer shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:bg-gray-100 hover:scale-105 transition-all"
                    >
                        Log Another Dive
                    </button>
                </div>
            </div>

            {selectedSpecies && <SpeciesDetailModal species={selectedSpecies} onClose={() => setSelectedSpecies(null)} />}
        </div>
    )
}
