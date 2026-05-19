import Groq from "groq-sdk";
import { env } from "../../config/env.js";

const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.3-8b-instant",
];

const keyCooldowns = new Map();
const blacklistedKeys = new Set();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callGroq = async ({ systemPrompt, context, userMessage, history = [] }) => {
    const keys = env.groqApiKeys;
    let lastError = null;

    if (!keys || keys.length === 0) {
        throw new Error("No Groq API keys configured.");
    }

    for (const modelName of MODELS) {
        for (let kIndex = 0; kIndex < keys.length; kIndex++) {
            const apiKey = keys[kIndex];

            if (blacklistedKeys.has(apiKey)) continue;

            const cooldownUntil = keyCooldowns.get(apiKey) || 0;
            if (Date.now() < cooldownUntil) continue;

            try {
                const groq = new Groq({ apiKey });

                // Construct Groq messages
                const messages = [
                    { role: "system", content: systemPrompt },
                    ...history.map(msg => ({ 
                        role: msg.role === "USER" ? "user" : "assistant", 
                        content: msg.content 
                    })),
                    { role: "user", content: `CONTEXT:\n${JSON.stringify(context, null, 2)}\n\nUSER MESSAGE:\n${userMessage}` }
                ];

                const completion = await groq.chat.completions.create({
                    messages,
                    model: modelName,
                    response_format: { type: "json_object" },
                });

                return completion.choices[0].message.content;

            } catch (error) {
                lastError = error;
                const statusCode = error.status || 0;

                if (statusCode === 401) {
                    console.error(`[Groq Resilience] Key ${kIndex + 1} INVALID. Blacklisting.`);
                    blacklistedKeys.add(apiKey);
                    continue;
                }

                if (statusCode === 429) {
                    // Groq usually has very specific rate limits; we'll cool down for 30s
                    console.warn(`[Groq Resilience] Key ${kIndex + 1} hit rate limit (429).`);
                    keyCooldowns.set(apiKey, Date.now() + 30000);
                    continue;
                }

                if (statusCode >= 500) {
                    console.warn(`[Groq Resilience] Model ${modelName} server error (${statusCode}) with key ${kIndex + 1}.`);
                    continue;
                }

                console.error(`[Groq Resilience] Unexpected Error (${modelName}):`, error.message);
                throw error;
            }
        }
    }

    throw new Error(`Groq Exhausted: ${lastError?.message}`);
};
