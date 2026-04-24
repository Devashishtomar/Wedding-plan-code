import {
    getMyInvitation,
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
import { getPrisma } from '../loaders/database.js'; // Ensure this is imported


export const getMyInvite = async (req, res) => {
    const invitation = await getMyInvitation({
        userId: req.user.id,
    });

    res.json({
        success: true,
        ...invitation,
    });
};

export const createInvite = async (req, res) => {
    const { message, templateId, content, styles, globalFontFamily } = req.body;

    const invitation = await createInvitation({
        userId: req.user.id,
        message,
        templateId,
        content,
        styles,
        globalFontFamily,
    });

    res.status(201).json({
        success: true,
        ...invitation,
    });

};

export const updateInvite = async (req, res) => {
    const { message, templateId, content, styles, globalFontFamily } = req.body;

    if (templateId && templateId !== "CUSTOM") {
        const prisma = getPrisma();
        await prisma.invitation.update({
            where: { id: req.params.id },
            data: {
                isCustom: false,
                canvasData: null,
                customBackground: null
            }
        });
    }

    const invitation = await updateInvitation({
        userId: req.user.id,
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
    const userId = req.user.id;
    const isDownload = req.query.download === "1";

    try {
        const prisma = getPrisma();
        const invite = await prisma.invitation.findUnique({ where: { id } });

        let imageBuffer;

        if (invite && invite.isCustom) {
            imageBuffer = await renderCustomInvitationToImage(id, userId);
        } else {
            imageBuffer = await renderInvitationImage({ invitationId: id, userId });
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