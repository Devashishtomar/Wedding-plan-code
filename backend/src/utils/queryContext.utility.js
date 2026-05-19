export const getVisibilityFilter = (req, viewType = 'SHARED') => {
    const weddingId = req.weddingId;
    const memberContext = req.memberContext;
    const eventId = req.query.eventId || null;

    if (!weddingId) {
        throw new Error("Missing wedding context in request");
    }

    const userSide = (memberContext.role === 'BRIDE' || memberContext.role === 'GROOM')
        ? memberContext.role
        : memberContext.side;

    const filter = { weddingId };

    if (eventId && eventId !== 'all') {
        filter.eventId = eventId;
    }

    if (viewType === 'PRIVATE' || viewType === 'INDIVIDUAL') {
        if (memberContext.role !== 'BRIDE' && memberContext.role !== 'GROOM') {
            if (!memberContext.canViewPrivate && !memberContext.canEditPrivate) {
                throw new Error("Access denied: You do not have permission to view this side's private space.");
            }
        }

        if (userSide === 'BRIDE') {
            filter.visibility = 'BRIDE_PRIVATE';
            return filter;
        }
        if (userSide === 'GROOM') {
            filter.visibility = 'GROOM_PRIVATE';
            return filter;
        }

        throw new Error("Cannot access private view: User is not assigned to a side.");
    }

    filter.visibility = 'SHARED';
    return filter;
};