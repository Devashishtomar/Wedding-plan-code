import {
    getInvitations,
    createInvitation,
    updateInvitation,
    getInvitationByToken,
    listInvitationTemplates,
    getInvitationTemplateById,
    renderInvitationImage,
} from '../services/invitation.service.js';
import {
    FONT_OPTIONS,
    COLOR_PALETTE,
} from '../config/invitationDesign.js';
import { renderCustomInvitationToImage } from '../services/customInvitationRender.service.js';
import { getPrisma } from '../loaders/database.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';


export const getMyInvite = async (req, res) => {
    const viewType = req.query.view || 'SHARED';
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const invitations = await getInvitations({ visibilityFilter });

    res.json({
        success: true,
        invitations,
    });
};

export const createInvite = async (req, res) => {
    const { message, templateId, content, styles, globalFontFamily, eventId, visibility } = req.body;

    // Securely tie the creation to the workspace, event, and requested view
    const invitation = await createInvitation({
        weddingId: req.weddingId,
        eventId: eventId || null,
        visibility: visibility || 'SHARED',
        userId: req.user.id,
        message,
        templateId,
        content,
        styles,
        globalFontFamily,
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'INVITATION',
        { invitationId: invitation.id, templateId },
        eventId || null,
        visibility || 'SHARED'
    );

    res.status(201).json({
        success: true,
        ...invitation,
    });
};

export const updateInvite = async (req, res) => {
    const { message, templateId, content, styles, globalFontFamily } = req.body;

    if (templateId && templateId !== "CUSTOM") {
        const prisma = getPrisma();
        await prisma.invitation.updateMany({
            where: {
                id: req.params.id,
                weddingId: req.weddingId
            },
            data: {
                isCustom: false,
                canvasData: null,
                customBackground: null
            }
        });
    }

    const invitation = await updateInvitation({
        weddingId: req.weddingId, // Secure multi-tenant workspace check
        userId: req.user.id,      // Track who made the update
        invitationId: req.params.id,
        message,
        templateId,
        content,
        styles,
        globalFontFamily,
    });

    res.json({
        success: true,
        ...invitation,
    });
};

export const viewInvite = async (req, res) => {
    const invite = await getInvitationByToken(req.params.token);

    if (!invite) {
        return res.status(404).json({
            success: false,
            message: 'Invalid invitation',
        });
    }

    res.json({
        success: true,
        invitation: invite,
    });
};


export const listTemplates = async (req, res) => {
    const templates = await listInvitationTemplates();
    res.json({ success: true, templates });
};

export const getTemplate = async (req, res) => {
    const template = await getInvitationTemplateById(req.params.id);

    if (!template) {
        return res.status(404).json({
            success: false,
            message: 'Template not found',
        });
    }

    res.json({ success: true, template });
};

export const getDesignOptions = async (req, res) => {
    res.json({
        success: true,
        fonts: FONT_OPTIONS,
        colors: COLOR_PALETTE,
    });
};


export const renderInvitation = async (req, res) => {
    const { id } = req.params;
    const weddingId = req.weddingId;
    const isDownload = req.query.download === "1";

    try {
        const prisma = getPrisma();
        const invite = await prisma.invitation.findUnique({ where: { id } });

        let imageBuffer;

        if (invite && invite.isCustom) {
            imageBuffer = await renderCustomInvitationToImage(id, weddingId);
        } else {
            imageBuffer = await renderInvitationImage({ invitationId: id, weddingId });
        }

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cache-Control", "public, max-age=3600");

        if (isDownload) {
            res.setHeader("Content-Disposition", `attachment; filename="invitation-${id}.png"`);
        }

        return res.send(imageBuffer);
    } catch (err) {
        console.error("Render error:", err);
        const status = err.statusCode || 500;
        return res.status(status).send(err.message || "Render failed");
    }
};