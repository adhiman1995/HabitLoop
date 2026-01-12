import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_12345';

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name: name || '',
            email,
            password_hash: hashedPassword
        });

        // Generate Token
        // Mongoose ids are objects, convert to string
        const token = jwt.sign({ id: newUser._id.toString(), email }, SECRET_KEY, { expiresIn: '1d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name,
                email,
                streak: newUser.streak,
                points: newUser.points,
                lastActiveDate: newUser.lastActiveDate
            }
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user
        const user = await User.findOne({ email });
        console.log('Login attempt for:', email);
        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        if (!user.password_hash) {
            console.error('CRITICAL: User found but has no password_hash!', user);
            return res.status(500).json({ error: 'User account corrupted' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id.toString(), email: user.email }, SECRET_KEY, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                streak: user.streak,
                points: user.points,
                lastActiveDate: user.lastActiveDate
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// GET ME (Fetch current user data)
router.get('/me', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            streak: user.streak,
            points: user.points,
            lastActiveDate: user.lastActiveDate
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
