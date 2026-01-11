import express from 'express';
import db from '../database.js';
import jwt from 'jsonwebtoken';

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
router.get('/', (req, res) => {
    try {
        const { category, day_of_week, completed } = req.query;

        let query = 'SELECT * FROM activities WHERE user_id = ?';
        const params = [req.userId];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (day_of_week) {
            query += ' AND day_of_week = ?';
            params.push(day_of_week);
        }

        if (completed !== undefined) {
            query += ' AND completed = ?';
            params.push(completed === 'true' ? 1 : 0);
        }

        query += ' ORDER BY day_of_week, time_slot';

        const stmt = db.prepare(query);
        const activities = stmt.all(...params);

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Get single activity by ID (scoped to user)
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?');
        const activity = stmt.get(id, req.userId);

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
router.post('/', (req, res) => {
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

        const stmt = db.prepare(`
      INSERT INTO activities (user_id, title, description, category, day_of_week, time_slot, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(req.userId, title, description || null, category, day_of_week, time_slot, duration);

        const newActivity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newActivity);
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Update activity (scoped to user)
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, day_of_week, time_slot, duration, completed } = req.body;

        const existing = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(id, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const stmt = db.prepare(`
      UPDATE activities 
      SET title = ?, description = ?, category = ?, day_of_week = ?, 
          time_slot = ?, duration = ?, completed = ?
      WHERE id = ? AND user_id = ?
    `);

        stmt.run(
            title || existing.title,
            description !== undefined ? description : existing.description,
            category || existing.category,
            day_of_week || existing.day_of_week,
            time_slot || existing.time_slot,
            duration || existing.duration,
            completed !== undefined ? (completed ? 1 : 0) : existing.completed,
            id,
            req.userId
        );

        const updated = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Failed to update activity' });
    }
});

// Toggle completion status (scoped to user)
router.patch('/:id/toggle', (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(id, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const newStatus = existing.completed === 1 ? 0 : 1;
        const stmt = db.prepare('UPDATE activities SET completed = ? WHERE id = ? AND user_id = ?');
        stmt.run(newStatus, id, req.userId);

        const updated = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error toggling activity:', error);
        res.status(500).json({ error: 'Failed to toggle activity' });
    }
});

// Delete activity (scoped to user)
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(id, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const stmt = db.prepare('DELETE FROM activities WHERE id = ? AND user_id = ?');
        stmt.run(id, req.userId);

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

export default router;
