import { renderPublicInvitation } from "../services/invitationPublicRender.service.js";

export const renderPublicInvitationImage = async (req, res) => {
    try {
        const { invitationId } = req.params;

        const buffer = await renderPublicInvitation(invitationId);

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        return res.send(buffer);
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).send(err.message || "Render failed");
    }
};
