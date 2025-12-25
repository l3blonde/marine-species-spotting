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
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-12 leading-tight">Species Identified!</h1>

                <div className={`grid gap-12 mb-12 ${isDesktop ? "grid-cols-[450px_1fr]" : "grid-cols-1"}`}>
                    <div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                            <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6 bg-[#1a1a1a]">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={speciesData.common_name}
                                    className="w-full h-full object-contain block"
                                />
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{speciesData.common_name}</h2>

                            <p className="text-lg italic text-gray-400 mb-4 leading-normal">{speciesData.scientific_name}</p>

                            <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full">
                                <span className="text-gray-200 text-sm font-medium">Confidence: {confidence}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <InfoSection title="About" content={speciesData.about} />
                        <InfoSection title="Habitat" content={speciesData.habitat} />
                        <InfoSection title="Size" content={speciesData.size} />
                        <InfoSection title="Behavior" content={speciesData.behavior} />

                        {speciesData.conservation_status && (
                            <InfoSection title="Conservation Status" content={speciesData.conservation_status} />
                        )}

                        {speciesData.fun_facts && speciesData.fun_facts.length > 0 && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-semibold text-white mb-4 leading-snug">Fun Facts</h3>
                                <ul className="list-none p-0 m-0">
                                    {speciesData.fun_facts.map((fact, index) => (
                                        <li key={index} className="text-gray-300 text-[15px] leading-relaxed mb-3 pl-5 relative">
                                            <span className="absolute left-0 text-white font-bold">•</span>
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {speciesData.did_you_know && <InfoSection title="Did You Know?" content={speciesData.did_you_know} />}

                        {speciesData.is_dangerous && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
                                <h3 className="text-xl font-semibold text-red-300 mb-3 leading-snug">⚠️ Safety Information</h3>
                                <p className="text-red-200 leading-relaxed text-[15px]">{speciesData.is_dangerous}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-12">
                    <button
                        onClick={onReset}
                        className="bg-white text-black font-semibold text-lg px-12 py-4 rounded-[14px] border-none cursor-pointer shadow-[0_4px_12px_rgba(255,255,255,0.2)] transition-all hover:bg-gray-100 hover:scale-105 leading-normal"
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3 leading-snug">{title}</h3>
            <p className="text-gray-300 leading-relaxed text-[15px]">{content}</p>
        </div>
    )
}
