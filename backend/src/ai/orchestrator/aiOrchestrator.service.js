import { buildAIContext } from "./aiContext.builder.js";
import {
    detectConfirmation,
    ConfirmationResult,
} from "./confirmationDetector.js";
import {
    getPendingAction,
    setPendingAction,
    clearPendingAction,
} from "./pendingAction.store.js";
import { executeAIAction } from "./aiAction.executor.js";
import { SYSTEM_PROMPT } from "../prompts/system.prompt.js";
import { callOpenAI } from "../providers/openai.provider.js";
import { parseAIResponse } from "./aiResponse.parser.js";


/**
 * AI Orchestrator Service
 * Coordinates conversation, confirmation, and execution.
 */
export class AIOrchestratorService {
    /**
     * Handle a single user message
     */
    async handleMessage({ userId, message, appBaseUrl }) {
        // -----------------------------
        // Step 1: Load pending action (if any)
        // -----------------------------
        const pendingAction = getPendingAction(userId);

        // -----------------------------
        // Step 2: Detect confirmation state
        // -----------------------------
        const confirmationResult = detectConfirmation({
            userMessage: message,
            hasPendingAction: Boolean(pendingAction),
        });

        // -----------------------------
        // Step 3: Handle pending action outcomes
        // -----------------------------
        if (pendingAction) {
            // ✅ CONFIRM
            if (confirmationResult === ConfirmationResult.CONFIRM) {
                // Clear first to prevent double execution
                clearPendingAction(userId);

                try {
                    const result = await executeAIAction({
                        userId,
                        action: pendingAction.action,
                        payload: pendingAction.payload,
                        appBaseUrl,
                    });

                    return {
                        type: "MESSAGE",
                        content:
                            "Done! I’ve successfully made that update for you.",
                        result,
                    };
                } catch (error) {
                    return {
                        type: "MESSAGE",
                        content:
                            " I tried to make that change, but something went wrong. Please try again or do it manually.",
                        error: error.message,
                    };
                }
            }

            // ❌ DECLINE
            if (confirmationResult === ConfirmationResult.DECLINE) {
                clearPendingAction(userId);

                return {
                    type: "MESSAGE",
                    content:
                        "No problem — I won’t make that change. Let me know if you need help with something else.",
                };
            }

            // 🔄 TOPIC SHIFT
            if (confirmationResult === ConfirmationResult.TOPIC_SHIFT) {
                clearPendingAction(userId);
                // Continue normally below
            }
            // IGNORE → fall through
        }

        if (
            pendingAction &&
            confirmationResult === ConfirmationResult.IGNORE
        ) {
            return {
                type: "MESSAGE",
                content:
                    "Please confirm if you’d like me to proceed with the previous suggestion, or let me know if you want to do something else.",
            };
        }

        // -----------------------------
        // Step 4: Build AI context
        // -----------------------------
        const context = await buildAIContext(userId);

        // Reflect pending state in context
        context.meta.hasPendingAction = Boolean(
            getPendingAction(userId)
        );

        // -----------------------------
        // Step 5: Call OpenAI
        // -----------------------------
        const rawAIResponse = await callOpenAI({
            systemPrompt: SYSTEM_PROMPT,
            context,
            userMessage: message,
        });

        // -----------------------------
        // Step 6: Parse AI response safely
        // -----------------------------
        const aiResponse = parseAIResponse(rawAIResponse);

        // -----------------------------
        // Step 7: Handle AI proposal
        // -----------------------------
        if (aiResponse.type === "PROPOSE_ACTION") {
            const pending = setPendingAction({
                userId,
                action: aiResponse.action,
                payload: aiResponse.payload,
                message: aiResponse.message,
            });

            return {
                type: "PROPOSE_ACTION",
                action: aiResponse.action,
                payload: aiResponse.payload,
                message: aiResponse.message,
                pendingActionId: pending.id,
            };
        }

        // -----------------------------
        // Step 8: Return AI message
        // -----------------------------
        return aiResponse;
    }

    /**
     * Store a proposed action safely
     * Called AFTER AI suggests an action
     */
    proposeAction({ userId, action, payload, message }) {
        const pending = setPendingAction({
            userId,
            action,
            payload,
            message,
        });

        return {
            type: "PROPOSE_ACTION",
            action,
            payload,
            message,
            pendingActionId: pending.id,
        };
    }
}
