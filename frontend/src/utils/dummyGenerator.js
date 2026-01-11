import { activityAPI } from '../services/api';
import { getStartOfWeek } from './helpers';

const ACTIVITY_TEMPLATES = [
    { title: 'Morning Standup', category: 'Work', duration: 15, time: '09:00', description: 'Daily team sync to discuss blockers and progress.' },
    { title: 'Code Review', category: 'Work', duration: 45, time: '10:00', description: 'Reviewing pull requests for the new feature branch.' },
    { title: 'Client Meeting', category: 'Work', duration: 60, time: '14:00', description: 'Monthly progress report with the client.' },
    { title: 'Deep Work', category: 'Work', duration: 120, time: '15:00', description: 'Focused coding session, no interruptions.' },
    { title: 'Gym Workout', category: 'Fitness', duration: 60, time: '18:00', description: 'Chest and Triceps day.' },
    { title: 'Morning Run', category: 'Fitness', duration: 30, time: '07:00', description: '5k run in the park.' },
    { title: 'Reading', category: 'Learning', duration: 45, time: '20:00', description: 'Reading "Clean Code" by Uncle Bob.' },
    { title: 'Online Course', category: 'Learning', duration: 60, time: '21:00', description: 'React Advanced Patterns module.' },
    { title: 'Dinner with Friends', category: 'Social', duration: 120, time: '19:30', description: 'Trying out the new Italian place.' },
    { title: 'Grocery Shopping', category: 'Personal', duration: 60, time: '11:00', description: 'Weekly groceries.' },
    { title: 'Meditation', category: 'Health', duration: 15, time: '08:00', description: 'Mindfulness session.' },
    { title: 'Lunch Break', category: 'Personal', duration: 60, time: '13:00', description: 'Relaxing lunch.' },
];

export const generateDummyData = async (onProgress) => {
    const monday = getStartOfWeek(new Date());
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Select ~15 random activities
    const activitiesToCreate = [];

    // Guaranteed activities (Work week)
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        activitiesToCreate.push({ ...ACTIVITY_TEMPLATES[0], day_of_week: day, completed: true }); // Standup
        if (Math.random() > 0.5) activitiesToCreate.push({ ...ACTIVITY_TEMPLATES[3], day_of_week: day, completed: Math.random() > 0.5 }); // Deep work
    });

    // Random items
    for (let i = 0; i < 8; i++) {
        const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
        const day = days[Math.floor(Math.random() * days.length)];
        activitiesToCreate.push({ ...template, day_of_week: day, completed: Math.random() > 0.4 });
    }

    let count = 0;
    for (const activity of activitiesToCreate) {
        await activityAPI.create({
            title: activity.title,
            description: activity.description,
            category: activity.category,
            day_of_week: activity.day_of_week,
            time_slot: activity.time,
            duration: activity.duration,
            completed: activity.completed
        });
        count++;
        if (onProgress) onProgress(Math.round((count / activitiesToCreate.length) * 100));
    }
};
