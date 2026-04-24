import { getPrisma } from '../loaders/database.js';
import crypto from 'crypto';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const saveCustomInvitation = async (req, res) => {
    const prisma = getPrisma();
    const userId = req.user.id;
    const { canvasData } = req.body; // The JSON array from the frontend

    try {
        // 1. Get User's Wedding
        const wedding = await prisma.wedding.findFirst({ where: { userId } });
        if (!wedding) return res.status(404).json({ success: false, message: "Wedding not found" });

        // 2. Handle Background Upload (if they uploaded a file)
        let customBackground = null;
        if (req.file) {
            customBackground = `/uploads/invitations/${req.file.filename}`;
        }

        // 3. Upsert Invitation (Create if new, Update if exists)
        const existingInvite = await prisma.invitation.findUnique({ where: { weddingId: wedding.id } });

        let invitation;
        if (existingInvite) {
            invitation = await prisma.invitation.update({
                where: { id: existingInvite.id },
                data: {
                    isCustom: true,
                    templateId: "CUSTOM",
                    canvasData: typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData,
                    ...(customBackground && { customBackground }) // Only update if new image uploaded
                }
            });
        } else {
            invitation = await prisma.invitation.create({
                data: {
                    userId,
                    weddingId: wedding.id,
                    token: generateToken(),
                    message: "Join us for our wedding", // default required field
                    templateId: "CUSTOM",
                    isCustom: true,
                    canvasData: typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData,
                    customBackground
                }
            });
        }

        res.json({ success: true, invitation });

    } catch (error) {
        console.error("Custom Save Error:", error);
        res.status(500).json({ success: false, message: "Failed to save custom invitation" });
    }
};