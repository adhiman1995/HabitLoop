import express from 'express';
import jwt from 'jsonwebtoken';
import Activity from '../models/Activity.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_12345';

// MIDDLEWARE: Verify Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // Bearer <token>
    const tokenString = token.split(' ')[1];
    if (!tokenString) {
        return res.status(403).json({ error: 'Invalid token format' });
    }

    jwt.verify(tokenString, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Apply middleware to all routes
router.use(verifyToken);

// Get all activities for the user
router.get('/', async (req, res) => {
    try {
        const { category, day_of_week, completed } = req.query;

        const query = { user_id: req.userId };

        if (category) {
            query.category = category;
        }

        if (day_of_week) {
            query.day_of_week = day_of_week;
        }

        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        const activities = await Activity.find(query).sort({ day_of_week: 1, time_slot: 1 });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Get single activity by ID (scoped to user)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findOne({ _id: id, user_id: req.userId });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.json(activity);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

// Create new activity
router.post('/', async (req, res) => {
    try {
        const { title, description, category, day_of_week, time_slot, duration } = req.body;

        if (!title || !category || !day_of_week || !time_slot || !duration) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(day_of_week)) {
            return res.status(400).json({ error: 'Invalid day_of_week' });
        }

        const newActivity = await Activity.create({
            user_id: req.userId,
            title,
            description: description || '',
            category,
            day_of_week,
            time_slot,
            duration,
            completed: false
        });

        res.status(201).json(newActivity);
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Update activity (scoped to user)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Ensure user owns activity before update
        const activity = await Activity.findOne({ _id: id, user_id: req.userId });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Mongo update
        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Failed to update activity' });
    }
});

// Toggle completion status (scoped to user)
router.patch('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findOne({ _id: id, user_id: req.userId });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        activity.completed = !activity.completed;
        await activity.save();

        res.json(activity);
    } catch (error) {
        console.error('Error toggling activity:', error);
        res.status(500).json({ error: 'Failed to toggle activity' });
    }
});

// Delete activity (scoped to user)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Activity.findOneAndDelete({ _id: id, user_id: req.userId });

        if (!result) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

export default router;
