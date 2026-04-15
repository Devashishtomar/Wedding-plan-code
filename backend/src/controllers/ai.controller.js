import { AIOrchestratorService } from "../ai/orchestrator/aiOrchestrator.service.js";

/**
 * POST /api/ai/message
 */
export const handleAIMessage = async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            success: false,
            message: "Message is required",
        });
    }

    const orchestrator = new AIOrchestratorService();

    const response = await orchestrator.handleMessage({
        userId: req.user.id,
        message,
        appBaseUrl: req.app.locals.appBaseUrl,
    });

    res.json({
        success: true,
        response,
    });
};
