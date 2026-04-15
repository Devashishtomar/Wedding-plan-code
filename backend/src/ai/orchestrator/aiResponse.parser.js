import { AIActionType } from "../contracts/actions.enum.js";

export const parseAIResponse = (raw) => {
    let parsed;

    try {
        parsed = JSON.parse(raw);
    } catch {
        return {
            type: "MESSAGE",
            content:
                "I had trouble understanding that. Could you rephrase your question?",
        };
    }

    // Basic validation
    if (!parsed.type) {
        return {
            type: "MESSAGE",
            content:
                "I couldn’t generate a valid response. Please try again.",
        };
    }

    // MESSAGE
    if (parsed.type === "MESSAGE") {
        return {
            type: "MESSAGE",
            content: String(parsed.content || ""),
        };
    }

    // PROPOSE_ACTION
    if (parsed.type === "PROPOSE_ACTION") {
        if (
            !parsed.action ||
            !Object.values(AIActionType).includes(parsed.action)
        ) {
            return {
                type: "MESSAGE",
                content:
                    "I can’t perform that action. Let me know if you’d like help with something else.",
            };
        }

        return {
            type: "PROPOSE_ACTION",
            action: parsed.action,
            payload: parsed.payload || {},
            message: parsed.message || "Would you like me to do that?",
        };
    }

    return {
        type: "MESSAGE",
        content:
            "I couldn’t process that request. Please try again.",
    };
};
