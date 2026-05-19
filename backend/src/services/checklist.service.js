import { getPrisma } from '../loaders/database.js';

export const getTasks = async ({ visibilityFilter }) => {
    const prisma = getPrisma();

    return prisma.checklistTask.findMany({
        where: visibilityFilter,
        include: { subtasks: true, event: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
    });
};

export const createTask = async ({ userId, weddingId, eventId, data }) => { // FIXED: Added eventId parameter
    const prisma = getPrisma();

    return prisma.checklistTask.create({
        data: {
            weddingId,
            eventId: eventId || null,
            createdById: userId,
            visibility: data.visibility || 'SHARED',
            title: data.title,
            category: data.category,
            priority: data.priority || 'MEDIUM',
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
        include: { subtasks: true }
    });
};

export const updateTask = async ({ userId, weddingId, taskId, data }) => {
    const prisma = getPrisma();

    const task = await prisma.checklistTask.findFirst({
        where: { id: taskId, weddingId },
    });

    if (!task) {
        const err = new Error('Task not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistTask.update({
        where: { id: taskId },
        data: {
            title: data.title !== undefined ? data.title : undefined,
            category: data.category !== undefined ? data.category : undefined,
            dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
            priority: data.priority !== undefined ? data.priority : undefined,
            eventId: data.eventId !== undefined ? data.eventId : undefined,
            visibility: data.visibility !== undefined ? data.visibility : undefined,
            updatedById: userId, // Track row-level updates
        },
        include: { subtasks: true }
    });
};

export const toggleTask = async ({ userId, weddingId, taskId }) => {
    const prisma = getPrisma();

    const task = await prisma.checklistTask.findFirst({
        where: { id: taskId, weddingId },
    });

    if (!task) {
        const err = new Error('Task not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistTask.update({
        where: { id: taskId },
        data: {
            completed: !task.completed,
            updatedById: userId
        },
        include: { subtasks: true }
    });
};

export const addSubTask = async ({ weddingId, taskId, title }) => {
    const prisma = getPrisma();

    // Verify the parent task belongs to this workspace
    const task = await prisma.checklistTask.findFirst({
        where: { id: taskId, weddingId },
    });

    if (!task) {
        const err = new Error('Parent task not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.create({
        data: {
            taskId,
            title,
        },
    });
};

export const toggleSubTask = async ({ weddingId, subtaskId }) => {
    const prisma = getPrisma();

    const subtask = await prisma.checklistSubTask.findUnique({
        where: { id: subtaskId },
        include: { task: true },
    });

    if (!subtask || subtask.task.weddingId !== weddingId) {
        const err = new Error('Subtask not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.update({
        where: { id: subtaskId },
        data: { completed: !subtask.completed },
    });
};

export const deleteSubTask = async ({ weddingId, subtaskId }) => {
    const prisma = getPrisma();

    const subtask = await prisma.checklistSubTask.findUnique({
        where: { id: subtaskId },
        include: { task: true },
    });

    if (!subtask || subtask.task.weddingId !== weddingId) {
        const err = new Error('Subtask not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.delete({
        where: { id: subtaskId },
    });
};

export const deleteTask = async ({ weddingId, taskId }) => {
    const prisma = getPrisma();

    const task = await prisma.checklistTask.findFirst({
        where: { id: taskId, weddingId },
    });

    if (!task) {
        const err = new Error('Task not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistTask.delete({
        where: { id: taskId },
    });
};


export const updateSubTask = async ({ weddingId, subtaskId, title, completed }) => {
    const prisma = getPrisma();

    const subtask = await prisma.checklistSubTask.findUnique({
        where: { id: subtaskId },
        include: { task: true },
    });

    if (!subtask || subtask.task.weddingId !== weddingId) {
        const err = new Error('Subtask not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.update({
        where: { id: subtaskId },
        data: {
            title: title !== undefined ? title : undefined,
            completed: completed !== undefined ? completed : undefined,
        },
    });
};