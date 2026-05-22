import * as PlannerService from '../services/planner.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';

export const fetchArrangements = async (req, res) => {
    try {
        const view = req.query.view || 'SHARED';
        const filter = getVisibilityFilter(req, view);

        // Apply strict sub-event partition scoping logic matching standard components
        if (req.query.eventId && req.query.eventId !== 'all') {
            filter.eventId = req.query.eventId;
        }

        const data = await PlannerService.getArrangementsList(filter);
        return res.status(200).json({ success: true, arrangements: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchArrangementDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PlannerService.getHydratedArrangement(id, req.weddingId);
        if (!data) {
            return res.status(404).json({ success: false, message: "Arrangement layout profile missing or unauthorized cross-query." });
        }
        return res.status(200).json({ success: true, arrangement: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createArrangement = async (req, res) => {
    try {
        const { name, type, description, eventId } = req.body;
        const view = req.query.view || 'SHARED';
        const contextFilter = getVisibilityFilter(req, view);

        const data = await PlannerService.createArrangementContainer({
            weddingId: req.weddingId,
            eventId: eventId || req.query.eventId || null,
            visibility: contextFilter.visibility,
            createdById: req.user.id,
            name,
            type,
            description
        });

        await logActivity(req.weddingId, req.user.id, 'CREATE', 'ARRANGEMENT', { id: data.id, name }, data.eventId, data.visibility);
        return res.status(201).json({ success: true, arrangement: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, shape, capacity, category } = req.body;
        const data = await PlannerService.addTableToArrangement(id, name, shape, capacity, category);

        // Deep activity logging map integration
        await logActivity(req.weddingId, req.user.id, 'CREATE', 'SEATING_TABLE', { id: data.id, name });
        return res.status(201).json({ success: true, table: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const data = await PlannerService.updateTableDetails(tableId, req.body);
        await logActivity(req.weddingId, req.user.id, 'UPDATE', 'SEATING_TABLE', { id: tableId, name: req.body.name });
        return res.status(200).json({ success: true, table: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const putSeat = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { seatIndex, guestId } = req.body;
        const data = await PlannerService.assignGuestToSeat(tableId, seatIndex, guestId);

        await logActivity(req.weddingId, req.user.id, 'UPDATE', 'SEAT_ASSIGNMENT', { tableId, seatIndex, guestId });
        return res.status(200).json({ success: true, assignment: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSeatAssignment = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { seatIndex } = req.body;
        await PlannerService.removeGuestFromSeat(tableId, seatIndex);

        await logActivity(req.weddingId, req.user.id, 'DELETE', 'SEAT_ASSIGNMENT', { tableId, seatIndex });
        return res.status(200).json({ success: true, message: "Seat unassigned successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const postRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, familyName, capacity } = req.body;
        const data = await PlannerService.addRoomToArrangement(id, roomNumber, familyName, capacity);

        await logActivity(req.weddingId, req.user.id, 'CREATE', 'HOTEL_ROOM', { id: data.id, roomNumber });
        return res.status(201).json({ success: true, room: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const data = await PlannerService.updateRoomDetails(roomId, req.body);
        await logActivity(req.weddingId, req.user.id, 'UPDATE', 'HOTEL_ROOM', { id: roomId, roomNumber: req.body.roomNumber });
        return res.status(200).json({ success: true, room: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const putRoomAllocation = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { guestId } = req.body;
        const data = await PlannerService.assignGuestToRoom(roomId, guestId);

        await logActivity(req.weddingId, req.user.id, 'UPDATE', 'ROOM_ASSIGNMENT', { roomId, guestId });
        return res.status(200).json({ success: true, assignment: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRoomAllocation = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { guestId } = req.body;
        await PlannerService.removeGuestFromRoom(roomId, guestId);

        await logActivity(req.weddingId, req.user.id, 'DELETE', 'ROOM_ASSIGNMENT', { roomId, guestId });
        return res.status(200).json({ success: true, message: "Guest unassigned from room space successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchConfirmedGuests = async (req, res) => {
    try {
        const view = req.query.view || 'SHARED';

        const rawEventId = req.query.eventId;
        const cleanEventId = (rawEventId === 'all' || !rawEventId) ? null : rawEventId;

        const sanitizedReq = { ...req, query: { ...req.query, eventId: cleanEventId } };
        const visibilityFilter = getVisibilityFilter(sanitizedReq, view);

        const data = await PlannerService.getConfirmedGuestsForContext(req.weddingId, cleanEventId, visibilityFilter);
        return res.status(200).json({ success: true, guests: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteArrangement = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PlannerService.purgeArrangementContainer(id, req.weddingId);
        await logActivity(req.weddingId, req.user.id, 'DELETE', 'ARRANGEMENT', { id }, data.eventId, data.visibility);
        return res.status(200).json({ success: true, message: "Arrangement framework container wiped successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const batchSaveSeats = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { seats } = req.body;

        if (!tableId) {
            return res.status(400).json({ success: false, message: "Target table parameter identifier is required." });
        }

        await PlannerService.syncTableSeatsBatch(tableId, seats || []);
        return res.status(200).json({ success: true, message: "Seating arrangements successfully synchronized." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createCompanion = async (req, res) => {
    try {
        const { id } = req.params; // Extracts arrangementId from parameters graph url
        const { name } = req.body; // Extracts companion name input typed from text box form

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "Companion field payload name cannot be blank." });
        }

        const data = await PlannerService.addArrangementCompanion(id, name.trim());

        // Return 201 created status matching frontend response parameter expectation tags
        return res.status(201).json({ success: true, companion: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCompanion = async (req, res) => {
    try {
        const { companionId } = req.params;

        if (!companionId) {
            return res.status(400).json({ success: false, message: "Companion item reference identifier is required." });
        }

        // Invoke the existing database service layer block safely
        await PlannerService.removeArrangementCompanion(companionId);

        return res.status(200).json({ success: true, message: "Arrangement layout companion cleared from the system." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;

        if (!tableId) {
            return res.status(400).json({ success: false, message: "Target table parameter identifier is required." });
        }

        await PlannerService.removeTableFromArrangement(tableId);

        // Dynamic operational activity log link
        await logActivity(req.weddingId, req.user.id, 'DELETE', 'SEATING_TABLE', { id: tableId });

        return res.status(200).json({ success: true, message: "Table blueprint dropped from database successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ success: false, message: "Target room parameter identifier is required." });
        }
        await PlannerService.removeRoomFromArrangement(roomId);
        await logActivity(req.weddingId, req.user.id, 'DELETE', 'HOTEL_ROOM', { id: roomId });
        return res.status(200).json({ success: true, message: "Hotel room entry purged successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const batchSaveRoomGuests = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { guests } = req.body;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Target roomId identifier parameter is required." });
        }

        await PlannerService.syncRoomOccupantsBatch(roomId, guests || []);
        return res.status(200).json({ success: true, message: "Room assignment framework synchronized securely." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};