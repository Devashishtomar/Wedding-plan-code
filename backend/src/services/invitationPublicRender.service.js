import path from "path";
import fs from "fs";
import { getPrisma } from '../loaders/database.js';
import { resolveInvitation } from "./invitationResolver.service.js";
import { renderInvitationToImage } from "./invitationRender.service.js";
import { renderCustomInvitationToImage } from "./customInvitationRender.service.js"; 

export async function renderPublicInvitation(invitationId) {
    const prisma = getPrisma();

    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        include: {
            wedding: true,
        },
    });

    if (!invitation) {
        const err = new Error("Invitation not found");
        err.statusCode = 404;
        throw err;
    }

    if (invitation.isCustom) {
        return renderCustomInvitationToImage(invitation.id, invitation.wedding.userId);
    }

    // reuse existing resolver (SAFE)
    const invitationResponse = await resolveInvitation(invitation);

    // reuse existing renderer (SAFE)
    return renderInvitationToImage(invitationResponse);
}