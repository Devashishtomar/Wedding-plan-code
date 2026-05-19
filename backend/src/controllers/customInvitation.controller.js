import { getPrisma } from '../loaders/database.js';
import crypto from 'crypto';
import { logActivity } from '../utils/activityLogger.utility.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const saveCustomInvitation = async (req, res) => {
    const prisma = getPrisma();
    const userId = req.user.id;
    const weddingId = req.weddingId; // Securely injected by middleware
    const { canvasData, eventId, visibility, invitationId } = req.body;

    try {
        if (!weddingId) return res.status(404).json({ success: false, message: "No active workspace" });

        // 1. Handle Background Upload (if they uploaded a file)
        let customBackground = null;
        if (req.file) {
            customBackground = `/uploads/invitations/${req.file.filename}`;
        }

        // 2. Find Existing Invitation
        let existingInvite = null;

        if (invitationId) {
            // If ID is provided, look for that specific design
            existingInvite = await prisma.invitation.findUnique({ where: { id: invitationId } });
            if (existingInvite && existingInvite.weddingId !== weddingId) {
                return res.status(403).json({ success: false, message: "Unauthorized access to invitation" });
            }
        } else {
            // Otherwise, check if one already exists for this Event + View combination
            existingInvite = await prisma.invitation.findFirst({
                where: {
                    weddingId,
                    eventId: eventId || null,
                    visibility: visibility || 'SHARED'
                }
            });
        }

        // 3. Upsert Invitation (Create if new, Update if exists)
        let invitation;
        if (existingInvite) {
            invitation = await prisma.invitation.update({
                where: { id: existingInvite.id },
                data: {
                    isCustom: true,
                    templateId: "CUSTOM",
                    canvasData: typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData,
                    updatedById: userId, // Track who edited the canvas
                    ...(customBackground && { customBackground })
                }
            });
        } else {
            invitation = await prisma.invitation.create({
                data: {
                    createdById: userId, // Use new creator relation
                    weddingId,
                    eventId: eventId || null,
                    visibility: visibility || 'SHARED',
                    token: generateToken(),
                    message: "Join us for our wedding",
                    templateId: "CUSTOM",
                    isCustom: true,
                    canvasData: typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData,
                    customBackground
                }
            });
        }

        await logActivity(
            weddingId,
            userId,
            existingInvite ? 'UPDATE' : 'CREATE',
            'INVITATION',
            { invitationId: invitation.id, isCustom: true },
            eventId || null,
            visibility || 'SHARED'
        );

        res.json({ success: true, invitation });

    } catch (error) {
        console.error("Custom Save Error:", error);
        res.status(500).json({ success: false, message: "Failed to save custom invitation" });
    }
};