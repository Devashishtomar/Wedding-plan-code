import { AIOrchestratorService } from "../ai/orchestrator/aiOrchestrator.service.js";
import { getVisibilityFilter } from "../utils/queryContext.utility.js";

/**
 * POST /api/ai/message
 */
export const handleAIMessage = async (req, res) => {
    const { message, eventId, view, currency } = req.body;

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            success: false,
            message: "Message is required",
        });
    }

    const orchestrator = new AIOrchestratorService();

    try {
        if (eventId !== undefined) req.query.eventId = eventId;

        const visibilityFilter = getVisibilityFilter(req, view || 'SHARED');

        const response = await orchestrator.handleMessage({
            userId: req.user.id,
            weddingId: req.weddingId,
            message,
            appBaseUrl: req.app.locals.appBaseUrl,
            visibilityFilter,
            eventId: eventId || null,
            view: view || 'SHARED',
            currency: currency || 'USD'
        });

        res.json({
            success: true,
            response,
        });
    } catch (error) {
        console.error("AI Assistant Error:", error);
        res.status(500).json({
            success: false,
            message: "AI Assistant encountered an error",
            error: error.message
        });
    }
};
