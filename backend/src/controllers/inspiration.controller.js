import {
    searchExternalInspirations,
    pinInspirationItem,
    getPinnedInspirationsList,
    unpinInspirationItem
} from '../services/inspiration.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';
import { getPrisma } from '../loaders/database.js';

export const discoverInspirations = async (req, res) => {
    try {
        const { page, perPage, category } = req.query;
        let searchQuery = req.query.query;
        const eventId = req.query.eventId;

        // Smart Discovery Engine: Fall back to Event Name context if clear text query is omitted
        if (!searchQuery || searchQuery.trim() === '') {
            const prisma = getPrisma();
            if (eventId && eventId !== 'all') {
                const activeEvent = await prisma.event.findUnique({
                    where: { id: eventId },
                    select: { name: true }
                });
                searchQuery = activeEvent ? `${activeEvent.name} wedding` : "wedding decor";
            } else {
                const activeWedding = await prisma.wedding.findUnique({
                    where: { id: req.weddingId },
                    select: { weddingType: true }
                });
                searchQuery = (activeWedding && activeWedding.weddingType)
                    ? `${activeWedding.weddingType} wedding theme`
                    : "luxury wedding decoration";
            }
        }

        // Intelligently append sub-category requirements clicked on frontend layout selectors
        if (category && category !== 'All') {
            searchQuery = `${searchQuery} ${category}`;
        }

        const data = await searchExternalInspirations(searchQuery, Number(page) || 1, Number(perPage) || 20);
        return res.status(200).json({ success: true, targetSearchTerm: searchQuery, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const pinItem = async (req, res) => {
    try {
        const { url, title, category, description, tags, style, eventId } = req.body;
        const view = req.query.view || 'SHARED';

        const contextFilter = getVisibilityFilter(req, view);

        const pin = await pinInspirationItem({
            weddingId: req.weddingId,
            eventId: eventId || req.query.eventId || null,
            visibility: contextFilter.visibility,
            createdById: req.user.id,
            url,
            title,
            category,
            description,
            tags,
            style
        });

        await logActivity(
            req.weddingId,
            req.user.id,
            'CREATE',
            'PINNED_INSPIRATION',
            { id: pin.id, title },
            pin.eventId,
            pin.visibility
        );

        return res.status(201).json({ success: true, pin });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getBoard = async (req, res) => {
    try {
        const view = req.query.view || 'SHARED';
        const visibilityFilter = getVisibilityFilter(req, view);

        const pins = await getPinnedInspirationsList(visibilityFilter);
        return res.status(200).json({ success: true, pins });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const unpinItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pin = await unpinInspirationItem(id, req.weddingId);

        await logActivity(
            req.weddingId,
            req.user.id,
            'DELETE',
            'PINNED_INSPIRATION',
            { id },
            pin.eventId,
            pin.visibility
        );

        return res.status(200).json({ success: true, message: "Item unpinned successfully from board." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};