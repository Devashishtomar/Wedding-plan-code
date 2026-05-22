import { getPrisma } from '../loaders/database.js';


export const getArrangementsList = async (visibilityFilter) => {
    const prisma = getPrisma();
    return await prisma.arrangement.findMany({
        where: visibilityFilter,
        include: {
            event: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });
};

export const getHydratedArrangement = async (id, weddingId) => {
    const prisma = getPrisma();
    return await prisma.arrangement.findFirst({
        where: { id, weddingId },
        include: {
            localGuests: true,
            tables: {
                include: {
                    assignments: {
                        include: {
                            guest: true,
                            arrangementGuest: true
                        }
                    }
                }
            },
            rooms: {
                include: {
                    assignments: {
                        include: {
                            guest: true,
                            arrangementGuest: true
                        }
                    }
                }
            }
        }
    });
};

export const createArrangementContainer = async ({ weddingId, eventId, visibility, createdById, name, type, description }) => {
    const prisma = getPrisma();
    const cleanEventId = (eventId === 'all' || !eventId) ? null : eventId;

    return await prisma.arrangement.create({
        data: {
            weddingId,
            eventId: cleanEventId,
            visibility,
            createdById,
            name,
            type,
            description
        }
    });
};

export const addTableToArrangement = async (arrangementId, name, shape, capacity, category) => {
    const prisma = getPrisma();
    return await prisma.seatingTable.create({
        data: { arrangementId, name, shape, capacity: Number(capacity), category }
    });
};

export const updateTableDetails = async (tableId, data) => {
    const prisma = getPrisma();
    return await prisma.seatingTable.update({
        where: { id: tableId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.shape && { shape: data.shape }),
            ...(data.capacity && { capacity: Number(data.capacity) }),
            ...(data.category !== undefined && { category: data.category })
        }
    });
};

// ─── AFTER (SURGICAL REPLACEMENT REWRITE) ───
export const assignGuestToSeat = async (tableId, seatIndex, guestId, isCompanion = false) => {
    const prisma = getPrisma();

    return await prisma.$transaction(async (tx) => {
        // Safe clear sweep step completely avoids record-not-found errors on expanded table slots
        await tx.seatAssignment.deleteMany({
            where: {
                tableId,
                seatIndex: Number(seatIndex)
            }
        });

        if (!guestId) return null; // Interprets empty client slot targets as a clean wipe mutation request

        // Route assignment keys into the correct schema target fields
        return await tx.seatAssignment.create({
            data: {
                tableId,
                seatIndex: Number(seatIndex),
                ...(isCompanion ? { arrangementGuestId: guestId } : { guestId })
            }
        });
    });
};

export const addArrangementCompanion = async (arrangementId, name) => {
    const prisma = getPrisma();
    return await prisma.arrangementGuest.create({
        data: { arrangementId, name }
    });
};

export const removeArrangementCompanion = async (id) => {
    const prisma = getPrisma();
    return await prisma.arrangementGuest.delete({
        where: { id }
    });
};

export const addRoomToArrangement = async (arrangementId, roomNumber, familyName, capacity) => {
    const prisma = getPrisma();
    return await prisma.hotelRoom.create({
        data: { arrangementId, roomNumber, familyName, capacity: Number(capacity) }
    });
};

export const updateRoomDetails = async (roomId, data) => {
    const prisma = getPrisma();
    return await prisma.hotelRoom.update({
        where: { id: roomId },
        data: {
            ...(data.roomNumber && { roomNumber: data.roomNumber }),
            ...(data.familyName !== undefined && { familyName: data.familyName }),
            ...(data.capacity && { capacity: Number(data.capacity) })
        }
    });
};

export const assignGuestToRoom = async (roomId, guestId) => {
    const prisma = getPrisma();

    // Check occupancy levels before registering new members
    const room = await prisma.hotelRoom.findUnique({
        where: { id: roomId },
        include: { assignments: true }
    });

    if (!room) throw new Error("Target hotel room allocation card does not exist.");
    if (room.assignments.length >= room.capacity) {
        throw new Error("Target allocation room maximum capacity constraint has been reached.");
    }

    return await prisma.roomAssignment.create({
        data: { roomId, guestId }
    });
};

// ─── AFTER ───
export const getConfirmedGuestsForContext = async (weddingId, eventId, visibilityFilter) => {
    const prisma = getPrisma();

    // Enforce strict event context scoping alignment matching the user's layout partition rule
    const targetEventId = (eventId === 'all' || !eventId) ? null : eventId;

    return await prisma.guest.findMany({
        where: {
            weddingId,
            eventId: targetEventId, // Strict match: maps uuid to uuid, and null to null cleanly
            rsvp: {
                in: ["ACCEPTED", "CONFIRMED", "YES", "yes", "confirmed", "accepted"] // Bulletproof lookup case array
            },
            visibility: visibilityFilter.visibility
        },
        orderBy: {
            name: 'asc'
        }
    });
};

/**
 * Completely drops a unique seat assignment slot row when a guest is unseated.
 */
export const removeGuestFromSeat = async (tableId, seatIndex) => {
    const prisma = getPrisma();
    return await prisma.seatAssignment.delete({
        where: { tableId_seatIndex: { tableId, seatIndex: Number(seatIndex) } },
        include: { table: true }
    });
};

/**
 * Removes a guest allocation link from a target room container row.
 */
export const removeGuestFromRoom = async (roomId, guestId) => {
    const prisma = getPrisma();

    // Find unique assignment ID since room assignment utilizes multi-occupancy arrays
    const record = await prisma.roomAssignment.findFirst({
        where: { roomId, guestId },
        include: { room: true }
    });

    if (!record) {
        throw new Error("Target assignment tracking row missing from room allocation mapping matrix.");
    }

    return await prisma.roomAssignment.delete({
        where: { id: record.id }
    });
};

export const purgeArrangementContainer = async (id, weddingId) => {
    const prisma = getPrisma();
    const target = await prisma.arrangement.findFirst({ where: { id, weddingId } });
    if (!target) throw new Error("Arrangement not found or context mismatch.");
    return await prisma.arrangement.delete({ where: { id } });
};


export const syncTableSeatsBatch = async (tableId, seatsArray) => {
    const prisma = getPrisma();

    return await prisma.$transaction(async (tx) => {
        // 1. Clear out all existing assignments for this specific table to avoid index collision crashes
        await tx.seatAssignment.deleteMany({
            where: { tableId }
        });

        // 2. Filter out empty slots to capture only active occupants
        const activeOccupants = seatsArray.filter(s => s.guestId || s.arrangementGuestId);

        // 3. Batch insert new structural row maps safely
        if (activeOccupants.length > 0) {
            await tx.seatAssignment.createMany({
                data: activeOccupants.map(s => ({
                    tableId,
                    seatIndex: Number(s.seatIndex),
                    guestId: s.guestId || null,
                    arrangementGuestId: s.arrangementGuestId || null
                }))
            });
        }
    });
};

export const removeTableFromArrangement = async (tableId) => {
    const prisma = getPrisma();
    return await prisma.seatingTable.delete({
        where: { id: tableId }
    });
};


export const removeRoomFromArrangement = async (roomId) => {
    const prisma = getPrisma();
    return await prisma.hotelRoom.delete({
        where: { id: roomId }
    });
};

export const syncRoomOccupantsBatch = async (roomId, occupantsArray) => {
    const prisma = getPrisma();

    return await prisma.$transaction(async (tx) => {
        // 1. Flush historical occupant entries inside the room allocation mapping matrix
        await tx.roomAssignment.deleteMany({
            where: { roomId }
        });

        // 2. Batch write occupants mapping keys into target rows cleanly
        if (occupantsArray.length > 0) {
            await tx.roomAssignment.createMany({
                data: occupantsArray.map(occ => ({
                    roomId,
                    guestId: occ.isCompanion ? null : occ.id,
                    arrangementGuestId: occ.isCompanion ? occ.id : null
                }))
            });
        }
    });
};