import { getDashboardSummary } from '../services/dashboard.service.js';

export const getDashboard = async (req, res) => {
    const summary = await getDashboardSummary(req.user.id);

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
