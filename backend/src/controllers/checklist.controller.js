import {
    createTask,
    getTasks,
    toggleTask,
    addSubTask,
    updateTask,
    toggleSubTask,
    deleteSubTask,
} from '../services/checklist.service.js';


export const createChecklistTask = async (req, res) => {
    const task = await createTask({
        userId: req.user.id,
        weddingId: req.body.weddingId,
        data: req.body,
    });

    res.status(201).json({ success: true, task });
};

export const listChecklistTasks = async (req, res) => {
    const tasks = await getTasks({
        userId: req.user.id,
        weddingId: req.params.weddingId,
    });

    res.json({ success: true, tasks });
};

export const toggleChecklistTask = async (req, res) => {
    const task = await toggleTask({
        userId: req.user.id,
        taskId: req.params.taskId,
    });

    res.json({ success: true, task });
};

export const createSubTask = async (req, res) => {
    const subtask = await addSubTask({
        userId: req.user.id,
        taskId: req.params.taskId,
        title: req.body.title,
    });

    res.status(201).json({ success: true, subtask });
};

export const updateChecklistTask = async (req, res) => {
    const task = await updateTask({
        userId: req.user.id,
        taskId: req.params.taskId,
        data: req.body,
    });

    res.json({ success: true, task });
};

export const toggleChecklistSubTask = async (req, res) => {
    const subtask = await toggleSubTask({
        userId: req.user.id,
        subtaskId: req.params.subtaskId,
    });

    res.json({ success: true, subtask });
};

export const deleteChecklistSubTask = async (req, res) => {
    await deleteSubTask({
        userId: req.user.id,
        subtaskId: req.params.subtaskId,
    });

    res.json({ success: true });
};
