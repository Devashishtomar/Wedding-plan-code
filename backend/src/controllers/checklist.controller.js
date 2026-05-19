import {
    createTask,
    getTasks,
    toggleTask,
    addSubTask,
    updateTask,
    toggleSubTask,
    deleteSubTask,
    deleteTask,
} from '../services/checklist.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';

export const listChecklistTasks = async (req, res) => {
    const viewType = req.query.view || 'SHARED';
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const tasks = await getTasks({ visibilityFilter });

    res.json({ success: true, tasks });
};

export const createChecklistTask = async (req, res) => {
    const { title, category, priority, dueDate, visibility, eventId } = req.body;

    const task = await createTask({
        userId: req.user.id,
        weddingId: req.weddingId,
        eventId: eventId || null,
        data: { title, category, priority, dueDate, visibility: visibility || 'SHARED' },
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'TASK',
        { taskId: task.id, title: task.title },
        eventId || null,
        visibility || 'SHARED'
    );

    res.status(201).json({ success: true, task });
};

export const toggleChecklistTask = async (req, res) => {
    const task = await toggleTask({
        userId: req.user.id,
        weddingId: req.weddingId,
        taskId: req.params.taskId,
    });

    await logActivity(req.weddingId, req.user.id, 'UPDATE', 'TASK', { taskId: task.id, action: 'TOGGLED_STATUS' });

    res.json({ success: true, task });
};

export const updateChecklistTask = async (req, res) => {
    const task = await updateTask({
        userId: req.user.id,
        weddingId: req.weddingId,
        taskId: req.params.taskId,
        data: req.body,
    });

    await logActivity(req.weddingId, req.user.id, 'UPDATE', 'TASK', { taskId: task.id, updatedFields: Object.keys(req.body) });

    res.json({ success: true, task });
};

export const createSubTask = async (req, res) => {
    const subtask = await addSubTask({
        weddingId: req.weddingId,
        taskId: req.params.taskId,
        title: req.body.title,
    });

    await logActivity(req.weddingId, req.user.id, 'CREATE', 'SUBTASK', { taskId: req.params.taskId, subtaskId: subtask.id });

    res.status(201).json({ success: true, subtask });
};

export const toggleChecklistSubTask = async (req, res) => {
    const subtask = await toggleSubTask({
        weddingId: req.weddingId,
        subtaskId: req.params.subtaskId,
    });

    await logActivity(req.weddingId, req.user.id, 'UPDATE', 'SUBTASK', { subtaskId: subtask.id, action: 'TOGGLED_STATUS' });

    res.json({ success: true, subtask });
};

export const deleteChecklistSubTask = async (req, res) => {
    await deleteSubTask({
        weddingId: req.weddingId,
        subtaskId: req.params.subtaskId,
    });

    await logActivity(req.weddingId, req.user.id, 'DELETE', 'SUBTASK', { subtaskId: req.params.subtaskId });

    res.json({ success: true, message: 'Subtask deleted successfully' });
};

export const deleteChecklistTask = async (req, res) => {
    await deleteTask({
        weddingId: req.weddingId,
        taskId: req.params.taskId,
    });

    await logActivity(req.weddingId, req.user.id, 'DELETE', 'TASK', { taskId: req.params.taskId }, null, 'SHARED');

    res.json({ success: true, message: 'Task deleted successfully' });
};