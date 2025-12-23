export function validateApiKey(request: Request): { valid: boolean; error?: string } {
    const apiKey = request.headers.get("x-api-key")
    const allowedKey = process.env.API_KEY

    // Allow requests without API key if API_KEY is not set (for internal use)
    if (!allowedKey) {
        return { valid: true }
    }

    if (!apiKey) {
        return { valid: false, error: "Missing API key. Include x-api-key header." }
    }

    if (apiKey !== allowedKey) {
        return { valid: false, error: "Invalid API key" }
    }

    return { valid: true }
}

export function generateApiKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let key = "msr_" // marine species recognition prefix
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
}
