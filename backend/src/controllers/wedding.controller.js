import { getMyWedding, setupWeddingService, getWeddingMembers, updateWeddingMember, removeWeddingMember, acceptSuggestionService } from '../services/wedding.service.js';
import { generateWeddingSuggestion } from '../services/suggestion.service.js';
import { logActivity } from '../utils/activityLogger.utility.js';
import { getPrisma } from '../loaders/database.js';

export const getMine = async (req, res) => {
    if (!req.weddingId) return res.status(404).json({ success: false, message: 'No active wedding workspace' });

    const wedding = await getMyWedding(req.weddingId);
    res.json({ success: true, wedding, memberContext: req.memberContext });
};

export const setupWedding = async (req, res) => {
    if (!req.weddingId) return res.status(404).json({ success: false, message: 'No active wedding workspace' });

    const { date, location, budget, guestCount, weddingType, role } = req.body;

    if (!date || !location || typeof budget !== "number" || typeof guestCount !== "number" || !weddingType || !role) {
        return res.status(400).json({ success: false, message: "All wedding setup fields are required" });
    }

    const wedding = await setupWeddingService({
        weddingId: req.weddingId,
        userId: req.user.id,
        data: {
            date: new Date(date),
            location,
            budget,
            guestCount,
            weddingType,
            role
        },
    });

    await logActivity(req.weddingId, req.user.id, 'UPDATE', 'WEDDING', { action: 'SETUP_COMPLETED' }, null, 'SHARED');

    res.json({ success: true, message: "Wedding setup complete", wedding });
};


export const listMembers = async (req, res) => {
    if (!req.weddingId) {
        return res.status(403).json({ success: false, message: 'Access Denied: No active workspace found.' });
    }

    const members = await getWeddingMembers(req.weddingId);
    res.json({ success: true, members, memberContext: req.memberContext });
};

export const updateMember = async (req, res) => {
    const { memberId } = req.params;
    const { role, side, permissions } = req.body;

    if (!['BRIDE', 'GROOM', 'PENDING'].includes(req.memberContext.role)) {
        return res.status(403).json({ success: false, message: "Access Denied: Only the couple can manage team roles." });
    }

    const member = await updateWeddingMember({ weddingId: req.weddingId, memberId, role, side, permissions });

    await logActivity(
        req.weddingId,
        req.user.id,
        'UPDATE',
        'WEDDING_MEMBER',
        { memberId, updatedRole: role },
        null,
        'SHARED'
    );

    res.json({ success: true, member, memberContext: req.memberContext });
};

export const removeMember = async (req, res) => {
    const { memberId } = req.params;

    if (!['BRIDE', 'GROOM', 'PENDING'].includes(req.memberContext.role)) {
        return res.status(403).json({ success: false, message: "Access Denied: Only the couple can remove team members." });
    }

    if (req.memberContext.id === memberId) {
        return res.status(400).json({ success: false, message: "You cannot remove yourself from the workspace." });
    }

    await removeWeddingMember({ weddingId: req.weddingId, memberId });

    await logActivity(req.weddingId, req.user.id, 'DELETE', 'WEDDING_MEMBER', { memberId }, null, 'SHARED');

    res.json({ success: true, message: 'Team member removed successfully' });
};

export const getSuggestion = async (req, res) => {
    const wedding = await getMyWedding(req.weddingId);

    if (!wedding) {
        return res.status(404).json({ success: false, message: "Wedding not found" });
    }

    const suggestion = generateWeddingSuggestion({
        date: wedding.date,
        budget: wedding.budget,
        weddingType: wedding.weddingType,
        guestCount: wedding.guestCount,
    });

    res.json({
        success: true,
        suggestion,
    });
};

export const acceptSuggestion = async (req, res) => {
    const { suggestion } = req.body;

    if (!suggestion) {
        return res.status(400).json({ success: false, message: "Suggestion data is required" });
    }

    const result = await acceptSuggestionService({
        weddingId: req.weddingId,
        userId: req.user.id,
        suggestion,
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'WEDDING_SETUP',
        { action: 'ACCEPTED_SUGGESTIONS', itemsCreated: suggestion.checklist?.length || 0 },
        null,
        'SHARED'
    );

    res.json({
        success: true,
        message: "Plan accepted and saved!",
        result,
    });
};


export const updatePrivateSetup = async (req, res) => {
    const { date, budget } = req.body;

    await getPrisma().weddingMember.update({
        where: { id: req.memberContext.id },
        data: {
            privateTargetDate: new Date(date),
            privateTargetBudget: Number(budget)
        }
    });

    res.json({ success: true, message: "Private space updated" });
};