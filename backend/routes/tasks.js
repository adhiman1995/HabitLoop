import express from 'express';
import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_12345';

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

router.use(verifyToken);

// GET /api/tasks - List all tasks
router.get('/', async (req, res) => {
    try {
        // Populate activity details to show linked activity title
        const tasks = await Task.find({ user_id: req.userId })
            .populate('activity_id', 'title')
            .sort({ created_at: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
    try {
        const title = req.body.title || 'New Task'; // Default title if empty
        const task = new Task({
            user_id: req.userId,
            ...req.body,
            title
        });
        await task.save();

        // Return populated task
        await task.populate('activity_id', 'title');
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PATCH /api/tasks/:id - Update task
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user_id: req.userId },
            req.body,
            { new: true }
        ).populate('activity_id', 'title');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

export default router;
