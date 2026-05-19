import { callGemini } from "./gemini.provider.js";
import { callGroq } from "./groq.provider.js";
import { env } from "../../config/env.js";

/** 
 * Master Provider Factory.
 * Manages load balancing and failover across DIFFERENT AI companies.
 */
export const callAI = async (params) => {
    const hasGroq = env.groqApiKeys && env.groqApiKeys.length > 0;
    const hasGemini = env.geminiApiKeys && env.geminiApiKeys.length > 0;

    // Strategy: GROQ IS PRIMARY (due to speed and high free-tier RPM)
    // GEMINI IS FALLBACK
    
    if (hasGroq) {
        try {
            console.log("[AI Factory] Calling Groq (Primary)...");
            return await callGroq(params);
        } catch (error) {
            console.warn("[AI Factory] Groq failed, falling back to Gemini:", error.message);
        }
    }

    if (hasGemini) {
        try {
            console.log("[AI Factory] Calling Gemini (Secondary)...");
            return await callGemini(params);
        } catch (error) {
            console.error("[AI Factory] Gemini also failed:", error.message);
            throw error;
        }
    }

    throw new Error("No AI providers (Groq or Gemini) are configured or available.");
};
