"use client"

import { useState } from "react"
import { generateApiKey } from "@/lib/api-auth"

export default function ApiDocsPage() {
    const [generatedKey, setGeneratedKey] = useState<string>("")

    const handleGenerateKey = () => {
        const newKey = generateApiKey()
        setGeneratedKey(newKey)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedKey)
            alert("API key copied to clipboard!")
        } catch (error) {
            console.error("Failed to copy:", error)
            alert("Failed to copy to clipboard. Please copy manually.")
        }
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: "48px 24px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "16px" }}>Marine Species Recognition API</h1>
                <p style={{ fontSize: "1.125rem", color: "#999", marginBottom: "48px", lineHeight: "1.6" }}>
                    Use our AI-powered API to identify marine species in your applications
                </p>

                <div
                    style={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "32px",
                        marginBottom: "32px",
                    }}
                >
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px" }}>Generate API Key</h2>
                    <p style={{ color: "#999", marginBottom: "24px", lineHeight: "1.6" }}>
                        Generate a unique API key to use with your Next.js dive app
                    </p>
                    <button
                        onClick={handleGenerateKey}
                        style={{
                            backgroundColor: "#fff",
                            color: "#000",
                            padding: "12px 32px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            marginBottom: "16px",
                        }}
                    >
                        Generate New Key
                    </button>

                    {generatedKey && (
                        <div>
                            <div
                                style={{
                                    backgroundColor: "#000",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    fontFamily: "monospace",
                                    fontSize: "0.875rem",
                                    marginBottom: "12px",
                                    wordBreak: "break-all",
                                }}
                            >
                                {generatedKey}
                            </div>
                            <button
                                onClick={handleCopy}
                                style={{
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    padding: "8px 24px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                }}
                            >
                                Copy to Clipboard
                            </button>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "32px",
                        marginBottom: "32px",
                    }}
                >
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "24px" }}>API Endpoints</h2>

                    <div style={{ marginBottom: "32px" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px", color: "#0ff" }}>
                            POST /api/classify
                        </h3>
                        <p style={{ color: "#999", marginBottom: "16px", lineHeight: "1.6" }}>Identify a single marine species</p>
                        <div
                            style={{
                                backgroundColor: "#000",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                padding: "16px",
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                overflowX: "auto",
                            }}
                        >
              <pre style={{ margin: 0 }}>
                {`fetch('https://your-app.vercel.app/api/classify', {
  method: 'POST',
  headers: {
    'x-api-key': 'your_api_key_here'
  },
  body: formData // FormData with 'image' field
})`}
              </pre>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px", color: "#0ff" }}>
                            POST /api/batch-classify
                        </h3>
                        <p style={{ color: "#999", marginBottom: "16px", lineHeight: "1.6" }}>
                            Analyze multiple images for dive log
                        </p>
                        <div
                            style={{
                                backgroundColor: "#000",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                padding: "16px",
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                overflowX: "auto",
                            }}
                        >
              <pre style={{ margin: 0 }}>
                {`fetch('https://your-app.vercel.app/api/batch-classify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here'
  },
  body: JSON.stringify({
    images: [base64Image1, base64Image2, ...]
  })
})`}
              </pre>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "32px",
                    }}
                >
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px" }}>Deployment Instructions</h2>
                    <ol style={{ color: "#999", lineHeight: "1.8", paddingLeft: "20px" }}>
                        <li>Push your code to GitHub</li>
                        <li>Go to vercel.com and create a new project</li>
                        <li>Import your GitHub repository</li>
                        <li>
                            Add environment variables:
                            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                                <li>GEMINI_API_KEY: Your Gemini API key</li>
                                <li>API_KEY: The generated key above (optional - for external access control)</li>
                            </ul>
                        </li>
                        <li>Click Deploy</li>
                        <li>Use the deployed URL in your dive app</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
