import React, { useState, useEffect, useMemo } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { taskAPI } from '../services/api';

const TaskProgressWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await taskAPI.getAll();
                setTasks(res.data);
            } catch (err) {
                console.error('Failed to load tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Calculate today's stats
    const todayStats = useMemo(() => {
        const today = new Date();
        const todayDateStr = today.toISOString().split('T')[0];

        // Filter tasks created today
        const todaysTasks = tasks.filter(t => {
            if (!t.created_at) return false;
            const taskDateStr = new Date(t.created_at).toISOString().split('T')[0];
            return taskDateStr === todayDateStr;
        });

        const completed = todaysTasks.filter(t => t.status === 'Completed').length;
        const total = todaysTasks.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
    }, [tasks]);

    // Calculate weekly trend (last 7 days)
    const weeklyTrend = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayTasks = tasks.filter(t => {
                if (!t.created_at) return false;
                const taskDateStr = new Date(t.created_at).toISOString().split('T')[0];
                return taskDateStr === dateStr;
            });

            const total = dayTasks.length;
            const completed = dayTasks.filter(t => t.status === 'Completed').length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            days.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                percentage,
                total,
                completed,
                isToday: i === 0
            });
        }
        return days;
    }, [tasks]);

    // SVG circular progress ring parameters
    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (todayStats.percentage / 100) * circumference;

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full min-h-[240px] flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full min-h-[240px] transition-colors">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <FiCheckSquare className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Today's Tasks</h3>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="text-slate-100 dark:text-slate-700"
                        />
                        {/* Progress circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="url(#taskProgressGradient)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-1000 ease-out"
                        />
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="taskProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#60a5fa" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            {todayStats.percentage}%
                        </span>
                    </div>
                </div>

                {/* Stats text */}
                <div className="flex-1">
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {todayStats.completed} <span className="text-base font-normal text-slate-400">/ {todayStats.total}</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {todayStats.total - todayStats.completed > 0
                            ? `${todayStats.total - todayStats.completed} remaining`
                            : todayStats.total > 0 ? 'All done! 🎉' : 'No tasks today'}
                    </p>
                </div>
            </div>

            {/* Weekly Sparkline */}
            <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Weekly Trend</p>
                <div className="flex items-end justify-between gap-1 h-12">
                    {weeklyTrend.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                <div className="bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                    {day.completed}/{day.total}
                                </div>
                            </div>
                            <div
                                className={`w-full rounded-t transition-all duration-500 cursor-pointer hover:opacity-80 ${day.isToday
                                    ? 'bg-blue-500'
                                    : day.percentage >= 80
                                        ? 'bg-blue-400 dark:bg-blue-500'
                                        : day.percentage >= 50
                                            ? 'bg-amber-400 dark:bg-amber-500'
                                            : day.percentage > 0
                                                ? 'bg-rose-400 dark:bg-rose-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                style={{ height: `${Math.max(day.percentage * 0.4, 4)}px` }}
                            />
                            <span className={`text-[10px] font-medium ${day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                {day.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskProgressWidget;
