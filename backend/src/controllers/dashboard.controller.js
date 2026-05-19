import { getDashboardSummary } from '../services/dashboard.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';

export const getDashboard = async (req, res) => {
    const viewType = req.query.view || 'SHARED';
    const eventId = req.query.eventId || null;
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const summary = await getDashboardSummary({
        weddingId: req.weddingId,
        eventId,
        user: req.user,
        visibilityFilter
    });

    if (!summary) {
        return res.json({
            success: true,
            hasWedding: false,
        });
    }

    res.json({
        success: true,
        hasWedding: true,
        data: summary,
    });
};