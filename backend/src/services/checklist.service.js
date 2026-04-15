import { getPrisma } from '../loaders/database.js';


/**
 * Verify wedding ownership
 */
const verifyWedding = async (userId, weddingId) => {
    const prisma = getPrisma();
    const wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, userId },
    });

    if (!wedding) {
        const err = new Error('Wedding not found');
        err.statusCode = 404;
        throw err;
    }

    return wedding;
};

export const createTask = async ({ userId, weddingId, data }) => {
    const prisma = getPrisma();
    await verifyWedding(userId, weddingId);

    return prisma.checklistTask.create({
        data: {
            weddingId,
            title: data.title,
            category: data.category,
            priority: data.priority || 'MEDIUM',
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
    });
};

export const getTasks = async ({ userId, weddingId }) => {
    const prisma = getPrisma();
    await verifyWedding(userId, weddingId);

    return prisma.checklistTask.findMany({
        where: { weddingId },
        include: { subtasks: true },
        orderBy: { createdAt: 'asc' },
    });
};

export const toggleTask = async ({ userId, taskId }) => {
    const prisma = getPrisma();
    const task = await prisma.checklistTask.findUnique({
        where: { id: taskId },
        include: { wedding: true },
    });

    if (!task || task.wedding.userId !== userId) {
        const err = new Error('Task not found');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistTask.update({
        where: { id: taskId },
        data: { completed: !task.completed },
    });
};

export const addSubTask = async ({ userId, taskId, title }) => {
    const prisma = getPrisma();
    const task = await prisma.checklistTask.findUnique({
        where: { id: taskId },
        include: { wedding: true },
    });

    if (!task || task.wedding.userId !== userId) {
        const err = new Error('Task not found');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.create({
        data: { taskId, title },
    });
};

export const updateTask = async ({ userId, taskId, data }) => {
    const prisma = getPrisma();

    const task = await prisma.checklistTask.findUnique({
        where: { id: taskId },
        include: { wedding: true },
    });

    if (!task || task.wedding.userId !== userId) {
        const err = new Error('Task not found');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistTask.update({
        where: { id: taskId },
        data: {
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            priority: data.priority,
        },
    });
};

export const toggleSubTask = async ({ userId, subtaskId }) => {
    const prisma = getPrisma();

    const subtask = await prisma.checklistSubTask.findUnique({
        where: { id: subtaskId },
        include: { task: { include: { wedding: true } } },
    });

    if (!subtask || subtask.task.wedding.userId !== userId) {
        const err = new Error('Subtask not found');
        err.statusCode = 404;
        throw err;
    }

    return prisma.checklistSubTask.update({
        where: { id: subtaskId },
        data: { completed: !subtask.completed },
    });
};

export const deleteSubTask = async ({ userId, subtaskId }) => {
    const prisma = getPrisma();

    const subtask = await prisma.checklistSubTask.findUnique({
        where: { id: subtaskId },
        include: { task: { include: { wedding: true } } },
    });

    if (!subtask || subtask.task.wedding.userId !== userId) {
        const err = new Error('Subtask not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.checklistSubTask.delete({
        where: { id: subtaskId },
    });
};

