import * as AiInvitationService from '../services/aiInvitation.service.js';
import { getPrisma } from '../loaders/database.js';
import { logActivity } from '../utils/activityLogger.utility.js';

export const getQuotaLimits = async (req, res) => {
    try {
        const prisma = getPrisma();
        const weddingId = req.weddingId;

        const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);

        const usageCount = await prisma.activityLog.count({
            where: {
                weddingId,
                action: 'GENERATE_AI',
                entity: 'INVITATION',
                createdAt: { gte: fiveHoursAgo }
            }
        });

        return res.status(200).json({
            success: true,
            used: usageCount,
            total: 2,
            remaining: Math.max(0, 2 - usageCount)
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postGenerateInvitationTemplate = async (req, res) => {
    try {
        const prisma = getPrisma();
        const weddingId = req.weddingId;
        const userId = req.user.id;
        const { prompt, visibility, eventId, eventType, includeContent, content, canvasSize } = req.body;

        const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
        const generationLogsCount = await prisma.activityLog.count({
            where: {
                weddingId,
                action: 'GENERATE_AI',
                entity: 'INVITATION',
                createdAt: { gte: fiveHoursAgo }
            }
        });

        if (generationLogsCount >= 2) {
            return res.status(429).json({
                success: false,
                message: "Generation limit reached. Your workspace is restricted to 2 AI designs every 5 hours."
            });
        }

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: "A visual text prompt statement is required." });
        }

        const configurationPayload = {
            weddingId,
            userId,
            prompt: prompt.trim(),
            visibility: visibility || 'SHARED',
            eventId: eventId && eventId !== 'all' ? eventId : null,
            eventType: eventType || 'Wedding',
            includeContent: includeContent ?? true,
            content: content || {},
            canvasSize: canvasSize || { width: 800, height: 1200 }
        };

        const canvasData = await AiInvitationService.generateCustomCanvasTemplate(configurationPayload);

        // Commit transaction tracking records directly into your stable historical log pipelines
        await logActivity(
            weddingId,
            userId,
            'GENERATE_AI',
            'INVITATION',
            { prompt: prompt.trim() },
            eventId && eventId !== 'all' ? eventId : null,
            visibility || 'SHARED'
        );

        return res.status(200).json({
            success: true,
            canvasData
        });
    } catch (error) {
        console.error("AI Generation Engine Error Block Log:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An issue occurred executing generation vectors over cloud channels."
        });
    }
};