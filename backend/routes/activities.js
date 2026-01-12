import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import Activity from '../models/Activity.js';
import DailyStats from '../models/DailyStats.js';

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

        // Validation for MongoDB migration: Ensure ID is a valid ObjectId
        // Old SQLite tokens had numeric IDs (e.g. 1), which crash Mongoose
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).json({ error: 'Token invalid (legacy format). Please log out and back in.' });
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

// Helper: Convert "HH:MM" to minutes since midnight
const minutesFromTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper: Check if two activities overlap
const doActivitiesOverlap = (newActivity, existingActivity) => {
    // 1. Check Day
    if (newActivity.day_of_week !== existingActivity.day_of_week) return false;

    // 2. Check Specific Date vs Recurring Logic
    if (!newActivity.is_recurring && !existingActivity.is_recurring) {
        // Both specific: check date match
        const date1 = newActivity.specific_date ? new Date(newActivity.specific_date).toISOString().split('T')[0] : null;
        const date2 = existingActivity.specific_date ? new Date(existingActivity.specific_date).toISOString().split('T')[0] : null;
        if (date1 !== date2) return false;
    }

    // 3. Check Time Overlap
    const start1 = minutesFromTime(newActivity.time_slot);
    const end1 = start1 + Number(newActivity.duration);

    const start2 = minutesFromTime(existingActivity.time_slot);
    const end2 = start2 + Number(existingActivity.duration);

    return (start1 < end2) && (start2 < end1);
};

// Create new activity (Supports single or multiple days)
router.post('/', async (req, res) => {
    try {
        const { title, description, category, day_of_week, time_slot, duration, specific_date } = req.body;

        if (!title || !category || !day_of_week || !time_slot || !duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Prepare list of new activity objects to validate
        let newActivities = [];
        if (Array.isArray(day_of_week)) {
            // Validate all days
            const invalidDays = day_of_week.filter(day => !validDays.includes(day));
            if (invalidDays.length > 0) {
                return res.status(400).json({ error: `Invalid days: ${invalidDays.join(', ')}` });
            }

            newActivities = day_of_week.map(day => ({
                user_id: req.userId,
                title, description: description || '', category,
                day_of_week: day, time_slot, duration,
                completed: false,
                is_recurring: true, specific_date: null
            }));
        } else {
            if (!validDays.includes(day_of_week)) {
                return res.status(400).json({ error: 'Invalid day_of_week' });
            }
            const isRecurring = !specific_date;
            newActivities = [{
                user_id: req.userId,
                title, description: description || '', category,
                day_of_week, time_slot, duration,
                completed: false,
                is_recurring: isRecurring, specific_date: specific_date || null
            }];
        }

        // Fetch existing activities for the user to check for conflicts
        // Optimization: limit to the days involved
        const daysToCheck = newActivities.map(a => a.day_of_week);
        const existingActivities = await Activity.find({
            user_id: req.userId,
            day_of_week: { $in: daysToCheck }
        });

        // Check for conflicts
        for (const newAct of newActivities) {
            const conflict = existingActivities.find(existing => doActivitiesOverlap(newAct, existing));
            if (conflict) {
                return res.status(400).json({
                    error: `Overlap detected with "${conflict.title}" on ${conflict.day_of_week} at ${conflict.time_slot}.`
                });
            }
        }

        // If no conflicts, save all
        if (newActivities.length === 1) {
            const created = await Activity.create(newActivities[0]);
            return res.status(201).json(created);
        } else {
            const created = await Activity.insertMany(newActivities);
            return res.status(201).json(created);
        }

    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Update activity (scoped to user)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, day_of_week, time_slot, duration, specific_date } = req.body;

        // Ensure user owns activity before update
        const activityToUpdate = await Activity.findOne({ _id: id, user_id: req.userId });
        if (!activityToUpdate) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Prepare updated object for validation
        // Use existing values if not provided in the update request
        const updatedDayOfWeek = day_of_week !== undefined ? day_of_week : activityToUpdate.day_of_week;
        const updatedTimeSlot = time_slot !== undefined ? time_slot : activityToUpdate.time_slot;
        const updatedDuration = duration !== undefined ? duration : activityToUpdate.duration;
        const updatedSpecificDate = specific_date !== undefined ? specific_date : activityToUpdate.specific_date;

        // Determine is_recurring based on specific_date in the update, or existing if not provided
        let updatedIsRecurring;
        if (specific_date !== undefined) {
            updatedIsRecurring = !specific_date;
        } else {
            updatedIsRecurring = activityToUpdate.is_recurring;
        }

        const updatedActivityStub = {
            day_of_week: updatedDayOfWeek,
            time_slot: updatedTimeSlot,
            duration: updatedDuration,
            is_recurring: updatedIsRecurring,
            specific_date: updatedSpecificDate
        };

        // Fetch existing activities to check for conflicts (exclude self)
        const existingActivities = await Activity.find({
            user_id: req.userId,
            day_of_week: updatedDayOfWeek, // Check only for the day being updated
            _id: { $ne: id } // Exclude the activity being updated
        });

        const conflict = existingActivities.find(existing => doActivitiesOverlap(updatedActivityStub, existing));
        if (conflict) {
            return res.status(400).json({
                error: `Overlap detected with "${conflict.title}" on ${conflict.day_of_week} at ${conflict.time_slot}.`
            });
        }

        // Construct the update object dynamically
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (category !== undefined) updates.category = category;
        if (day_of_week !== undefined) updates.day_of_week = day_of_week;
        if (time_slot !== undefined) updates.time_slot = time_slot;
        if (duration !== undefined) updates.duration = duration;
        if (specific_date !== undefined) updates.specific_date = specific_date;
        // Always update is_recurring based on the logic derived from specific_date
        updates.is_recurring = updatedIsRecurring;


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

        // Streak & Points Logic
        if (activity.completed) {
            const User = mongoose.model('User');
            const user = await User.findById(req.userId);

            if (user) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
                if (lastActive) lastActive.setHours(0, 0, 0, 0);

                const oneDayMs = 24 * 60 * 60 * 1000;

                // Points for completing an activity
                const POINTS_PER_ACTIVITY = 10;
                user.points = (user.points || 0) + POINTS_PER_ACTIVITY;

                // Update Daily Stats (Heatmap)
                const dateStr = today.toISOString().split('T')[0];
                await DailyStats.findOneAndUpdate(
                    { user_id: req.userId, date: dateStr },
                    { $inc: { count: 1 } },
                    { upsert: true, new: true }
                );

                if (!lastActive) {
                    // First ever activity
                    user.streak = 1;
                    user.lastActiveDate = new Date();
                } else if (today.getTime() === lastActive.getTime()) {
                    // Already active today, streak keeps same, just update points
                } else if (today.getTime() - lastActive.getTime() < (oneDayMs + 1000)) { // roughly 1 day diff
                    // Consecutive day
                    user.streak = (user.streak || 0) + 1;
                    user.lastActiveDate = new Date();
                } else {
                    // Broken streak
                    user.streak = 1;
                    user.lastActiveDate = new Date();
                }

                await user.save();
            }
        }

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

// Get heatmap stats (scoped to user)
router.get('/stats/heatmap', async (req, res) => {
    try {
        const stats = await DailyStats.find({ user_id: req.userId }).sort({ date: 1 });
        res.json(stats);
    } catch (error) {
        console.error('Error fetching heatmap stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;
