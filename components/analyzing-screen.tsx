interface AnalyzingScreenProps {
    isBulk?: boolean
    progress?: number
    total?: number
}

export function AnalyzingScreen({ isBulk = false, progress = 0, total = 0 }: AnalyzingScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
                <div className="relative inline-block mb-12">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-700"></div>
                    <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
                    <div className="absolute inset-0 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
                </div>
                <p className="text-3xl text-white font-semibold mb-3">
                    {isBulk ? `Analyzing dive log...` : "Identifying species..."}
                </p>
                <p className="text-gray-400 text-lg mt-4">
                    {isBulk && total > 0
                        ? progress > 0
                            ? `Processing image ${progress} of ${total}`
                            : `Processing ${total} images`
                        : "Analyzing with AI"}
                </p>
            </div>
        </div>
    )
}
