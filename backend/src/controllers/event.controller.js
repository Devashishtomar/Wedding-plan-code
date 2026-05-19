import * as eventService from '../services/event.service.js';
import { logActivity } from '../utils/activityLogger.utility.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';

export const listEvents = async (req, res) => {
    const viewType = req.query.view || 'SHARED';
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const events = await eventService.getEvents({ visibilityFilter });
    res.json({ success: true, events });
};

export const createEvent = async (req, res) => {
    const { name, date, location, type, budget, visibility } = req.body;

    const event = await eventService.addEvent({
        weddingId: req.weddingId,
        userId: req.user.id,
        data: {
            name,
            date,
            location,
            type,
            budget: Number(budget) || 0,
            visibility: visibility || 'SHARED'
        }
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'EVENT',
        { eventId: event.id, name: event.name },
        event.id,
        event.visibility
    );

    res.status(201).json({ success: true, event });
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const event = await eventService.editEvent({
        weddingId: req.weddingId,
        eventId: id,
        data: req.body
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'UPDATE',
        'EVENT',
        { eventId: id, updatedFields: Object.keys(req.body) },
        id,
        event.visibility
    );

    res.json({ success: true, event });
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getEventById(id, req.weddingId);

    await eventService.removeEvent(id, req.weddingId);

    await logActivity(
        req.weddingId,
        req.user.id,
        'DELETE',
        'EVENT',
        { eventId: id, name: event.name },
        null, // Event is gone
        event.visibility
    );

    res.json({ success: true, message: "Event removed" });
};