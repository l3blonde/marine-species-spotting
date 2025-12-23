import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { validateApiKey } from "@/lib/api-auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
    try {
        const authCheck = validateApiKey(request)
        if (!authCheck.valid) {
            return NextResponse.json({ success: false, error: authCheck.error }, { status: 401 })
        }

        console.log("Starting classification request")

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set!")
            return NextResponse.json(
                {
                    success: false,
                    error: "API key not configured",
                },
                { status: 500 },
            )
        }

        const formData = await request.formData()
        const imageFile = formData.get("image") as File

        if (!imageFile) {
            console.error("No image file provided")
            return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 })
        }

        console.log("Processing image:", imageFile.name, imageFile.type)

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString("base64")

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `You are a marine biology expert. Analyze this image and identify the marine species.

Return ONLY a valid JSON object (no markdown, no code blocks) with this EXACT structure:

{
  "common_name": "Common name of the species",
  "scientific_name": "Scientific name (Genus species)",
  "about": "A 2-3 sentence overview describing this species",
  "habitat": "Where they live - ocean zones, regions, depth range",
  "size": "Typical size/length and weight range",
  "behavior": "Behavioral characteristics, diet, and habits",
  "conservation_status": "IUCN Red List status and any threats",
  "fun_facts": [
    "Interesting fact 1",
    "Interesting fact 2", 
    "Interesting fact 3"
  ],
  "did_you_know": "A fascinating or surprising fact about this species",
  "is_dangerous": "Safety information - explain danger level or state 'Generally harmless to humans'",
  "confidence": 95
}

IMPORTANT:
- Return ONLY the JSON object, no markdown formatting
- If not a marine species, set common_name to "Unknown Marine Species"
- Provide accurate, educational information
- Include 3-5 fun facts
- Confidence should be realistic (75-98) based on image quality
- All fields must have values, use "Not available" if information is unknown`

        console.log("Sending request to Gemini AI...")

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type,
                },
            },
        ])

        const response = result.response
        let responseText = response.text().trim()

        console.log("Raw Gemini response:", responseText.substring(0, 200) + "...")

        responseText = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim()

        console.log("Cleaned response:", responseText.substring(0, 200) + "...")

        let speciesData
        try {
            speciesData = JSON.parse(responseText)
        } catch (parseError) {
            console.error("JSON parse error:", parseError)
            console.error("Failed to parse:", responseText)
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to parse AI response",
                },
                { status: 500 },
            )
        }

        console.log("Successfully parsed species data:", speciesData.common_name)

        return NextResponse.json({
            success: true,
            speciesInfo: speciesData,
            confidence: speciesData.confidence || 90,
            identifiedSpecies: speciesData.common_name,
        })
    } catch (error) {
        console.error("Error classifying species:", error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to classify image",
            },
            { status: 500 },
        )
    }
}
