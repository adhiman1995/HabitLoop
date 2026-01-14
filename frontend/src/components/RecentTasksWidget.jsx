import React, { useState, useEffect, useMemo } from 'react';
import { FiCheckSquare, FiClock, FiActivity } from 'react-icons/fi';
import { taskAPI } from '../services/api';

const RecentTasksWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const recentCompletedTasks = useMemo(() => {
        return tasks
            .filter(t => t.status === 'Completed')
            .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
            .slice(0, 5);
    }, [tasks]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors h-full">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FiCheckSquare className="text-blue-500" />
                Recent Tasks Completed
            </h3>

            <div className="space-y-3">
                {recentCompletedTasks.length > 0 ? (
                    recentCompletedTasks.map((task) => (
                        <div
                            key={task.id || task._id}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <FiCheckSquare className="text-emerald-500 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                    {task.title}
                                </p>
                                {task.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <FiClock />
                                        {formatDate(task.updated_at || task.created_at)}
                                    </span>
                                    {task.activity_id && (
                                        <span className="flex items-center gap-1">
                                            <FiActivity />
                                            Linked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <FiCheckSquare className="text-3xl mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No completed tasks yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTasksWidget;
