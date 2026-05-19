import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

const MODELS = [
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
];

/** 
 * Cooldown tracker for API keys. 
 * Stores the timestamp until which a key is on cooldown.
 * Map<apiKey, timestampMs>
 */
const keyCooldowns = new Map();

/** 
 * Session blacklist for fatal errors (e.g. 401 Unauthorized)
 */
const blacklistedKeys = new Set();

/** Small delay helper for back-off between retries */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Extract retry delay in ms from a 429 error response, defaulting to 20s */
const getRetryDelay = (error) => {
    try {
        const retryInfo = error.errorDetails?.find(d => d.retryDelay);
        if (retryInfo?.retryDelay) {
            const seconds = parseInt(retryInfo.retryDelay, 10);
            if (!isNaN(seconds)) return (seconds + 2) * 1000; // add 2s buffer
        }
    } catch (_) {}
    return 20000; // default 20s
};

/**
 * AI Service resilience layer.
 * Manages model fallback AND API key rotation/pooling.
 */
export const callGemini = async ({ systemPrompt, context, userMessage, history = [] }) => {
    const keys = env.geminiApiKeys;
    let lastError = null;

    if (!keys || keys.length === 0) {
        throw new Error("No Gemini API keys configured. Please set GEMINI_API_KEYS in .env");
    }

    // Outer loop: Models (we try our best models first)
    for (const modelName of MODELS) {
        
        // Inner loop: Keys (we try all available keys for this model before falling back)
        for (let kIndex = 0; kIndex < keys.length; kIndex++) {
            const apiKey = keys[kIndex];

            // 1. Skip blacklisted keys
            if (blacklistedKeys.has(apiKey)) continue;

            // 2. Skip keys on cooldown
            const cooldownUntil = keyCooldowns.get(apiKey) || 0;
            if (Date.now() < cooldownUntil) {
                const waitSeconds = Math.ceil((cooldownUntil - Date.now()) / 1000);
                console.warn(`[Gemini Resilience] Key ${kIndex + 1}/${keys.length} is on cooldown for ${waitSeconds}s. Skipping...`);
                continue;
            }

            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt,
                    generationConfig: {
                        responseMimeType: "application/json",
                    },
                });

                const contextMessage = `CONTEXT:\n${JSON.stringify(context, null, 2)}`;

                // Convert flat history to Gemini format
                let geminiHistory = history.map(msg => ({
                    role: msg.role === "USER" ? "user" : "model",
                    parts: [{ text: msg.content }]
                }));

                // CRITICAL: Gemini history must start with a 'user' message
                const firstUserIndex = geminiHistory.findIndex(msg => msg.role === 'user');
                if (firstUserIndex > 0) {
                    geminiHistory = geminiHistory.slice(firstUserIndex);
                } else if (firstUserIndex === -1 && geminiHistory.length > 0) {
                    geminiHistory = [];
                }

                const chat = model.startChat({
                    history: geminiHistory,
                });

                const fullMessage = `${contextMessage}\n\nUSER MESSAGE:\n${userMessage}`;
                const result = await chat.sendMessage(fullMessage);
                
                return result.response.text();

            } catch (error) {
                lastError = error;
                const errorMsg = error.message || "";
                const statusCode = error.status || 0;

                // Handle Fatal Errors (Auth/Permissions)
                const isFatal = 
                    statusCode === 401 || errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("invalid api key");
                
                const isPermissionDenied = 
                    statusCode === 403 || errorMsg.toLowerCase().includes("permission denied") || errorMsg.includes("denied access");

                if (isFatal) {
                    console.error(`[Gemini Resilience] Key ${kIndex + 1} is INVALID. Blacklisting for this session.`);
                    blacklistedKeys.add(apiKey);
                    continue; // try next key
                }

                if (isPermissionDenied) {
                    console.warn(`[Gemini Resilience] Key ${kIndex + 1} has project-level restrictions (403). Cooling down for 1 hour.`);
                    keyCooldowns.set(apiKey, Date.now() + 3600000); // 1 hour cooldown for restricted projects
                    continue; // try next key
                }

                // Handle Quota/Rate Limits (429)
                const isRateLimit = statusCode === 429 || errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many");
                if (isRateLimit) {
                    const delay = getRetryDelay(error);
                    console.warn(`[Gemini Resilience] Key ${kIndex + 1} hit quota limit (429). Cooldown: ${Math.round(delay/1000)}s.`);
                    keyCooldowns.set(apiKey, Date.now() + delay);
                    continue; // try next key
                }

                // Handle Server Errors (5xx)
                const isServerError = statusCode >= 500 || errorMsg.includes("503") || errorMsg.includes("Service Unavailable") || errorMsg.includes("high demand");
                if (isServerError) {
                    console.warn(`[Gemini Resilience] Model ${modelName} returned server error (${statusCode}) with key ${kIndex + 1}.`);
                    // Don't cool down key, just try next key for this model
                    continue;
                }

                // If it's a model-not-found error (404), break inner loop and try next model
                const isNotFound = statusCode === 404 || errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("NOT_FOUND");
                if (isNotFound) {
                    console.warn(`[Gemini Resilience] Model ${modelName} NOT FOUND. Falling back to next model...`);
                    break; 
                }

                // Other errors (e.g. Safety), rethrow as it's likely a content issue
                console.error(`[Gemini Resilience] Unexpected Error (${modelName}):`, errorMsg);
                throw error;
            }
        }
    }

    // Exhausted everything
    console.error("[Gemini Resilience] ALL keys and models exhausted.");
    const finalErrorMsg = lastError?.message || "All models and keys exhausted.";
    const isQuotaError = finalErrorMsg.includes("quota") || finalErrorMsg.includes("429");
    
    throw new Error(
        isQuotaError 
            ? "The AI assistant is temporarily under extremely high load. Please try again in 1 minute." 
            : `AI Service Error: ${finalErrorMsg}`
    );
};
