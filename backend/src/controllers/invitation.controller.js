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

    const imageBuffer = await renderInvitationImage({
        invitationId: id,
        userId,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    res.setHeader(
        "Content-Disposition",
        isDownload
            ? 'attachment; filename="wedding-invitation.png"'
            : "inline"
    );
    res.setHeader("Cache-Control", "no-store");

    res.send(imageBuffer);
};
