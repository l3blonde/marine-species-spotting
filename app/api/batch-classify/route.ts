import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
    try {
        const authCheck = validateApiKey(request)
        if (!authCheck.valid) {
            return NextResponse.json({ success: false, error: authCheck.error }, { status: 401 })
        }

        const { images } = await request.json()

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ success: false, error: "No images provided" }, { status: 400 })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const allSpecies: any[] = []

        for (let i = 0; i < images.length; i++) {
            const base64Image = images[i]
            const base64Data = base64Image.split(",")[1]
            const mimeType = base64Image.split(";")[0].split(":")[1]

            const prompt = `Identify this marine species and provide detailed information in valid JSON format with these exact fields:
{
  "common_name": "string",
  "scientific_name": "string", 
  "about": "string (2-3 sentences)",
  "habitat": "string",
  "size": "string",
  "behavior": "string",
  "conservation_status": "string or null",
  "is_dangerous": "string describing specific danger (venom, bite, sting, etc) ONLY if truly dangerous to humans, otherwise null",
  "fun_facts": ["fact1", "fact2", "fact3"],
  "did_you_know": "string (interesting trivia)",
  "category": "fish" or "coral" or "crab" or "other",
  "rarity": "common" or "rare" or "new"
}`

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
            ])

            const responseText = result.response.text()
            const jsonMatch = responseText.match(/{[\s\S]*}/)

            if (jsonMatch) {
                const speciesInfo = JSON.parse(jsonMatch[0])
                speciesInfo.image = base64Image
                allSpecies.push(speciesInfo)
            }

            await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        const categorized = {
            new: allSpecies.filter((s) => s.rarity === "new"),
            rare: allSpecies.filter((s) => s.rarity === "rare"),
            dangerous: allSpecies.filter((s) => s.is_dangerous !== null && s.is_dangerous !== ""),
            common: ["fish", "coral", "crab", "other"].reduce(
                (acc, category) => {
                    acc[category === "coral" ? "corals" : category === "crab" ? "crabs" : category] = allSpecies.filter(
                        (s) => s.category === category && s.rarity === "common",
                    )
                    return acc
                },
                {} as Record<string, any[]>,
            ),
        }

        return NextResponse.json({
            success: true,
            categorized,
            totalAnalyzed: images.length,
        })
    } catch (error) {
        console.error("Error in batch classification:", error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
        )
    }
}
