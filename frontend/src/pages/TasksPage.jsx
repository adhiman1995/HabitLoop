import React, { useState, useEffect } from 'react';
import { taskAPI, activityAPI } from '../services/api';
import { FiPlus, FiTrash2, FiCheck, FiEdit2, FiList, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';
import TaskFormModal from '../components/TaskFormModal';

const TasksPage = ({ initialActivityId, onClearActivity }) => {
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All'); // New Filter State


    // Handle initial activity if provided (auto-open modal)
    useEffect(() => {
        if (initialActivityId) {
            setEditingTask(null);
            setShowModal(true);

            if (onClearActivity) {
                onClearActivity();
            }
        }
    }, [initialActivityId, onClearActivity]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, actsRes] = await Promise.all([
                    taskAPI.getAll(),
                    activityAPI.getAll()
                ]);
                setTasks(tasksRes.data);
                setActivities(actsRes.data);
            } catch (err) {
                console.error('Failed to load tasks/activities', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Open modal for new task
    const handleAddRow = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    // Open modal for editing task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    // Handle task saved from modal
    const handleTaskSaved = (savedTask) => {
        if (editingTask) {
            const taskId = editingTask.id || editingTask._id;
            setTasks(prev => prev.map(t => (t.id || t._id) === taskId ? savedTask : t));
        } else {
            setTasks([...tasks, savedTask]);
        }
        setEditingTask(null);
    };

    // Delete task
    const handleDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await taskAPI.delete(taskId);
            setTasks(prev => prev.filter(t => (t.id || t._id) !== taskId));
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    // Toggle completion
    const handleToggleComplete = async (task) => {
        const taskId = task.id || task._id;
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            const updateData = {
                title: task.title,
                description: task.description,
                status: newStatus,
                activity_id: task.activity_id?.id || task.activity_id?._id || task.activity_id || null
            };
            const res = await taskAPI.update(taskId, updateData);
            setTasks(prev => prev.map(t => (t.id || t._id) === taskId ? res.data : t));
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };

    // Get activity name
    const getActivityName = (activityId) => {
        if (!activityId) return null;
        const activity = activities.find(a => (a.id || a._id) === (activityId.id || activityId._id || activityId));
        return activity ? activity.title : null;
    };



    const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        if (statusFilter === 'All') return true;
        return task.status === statusFilter;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header: Filter & Actions */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 flex flex-col sm:flex-row items-center gap-4 flex-grow w-full xl:w-auto transition-colors">
                    <div className="flex items-center gap-2 pl-4 py-2 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs whitespace-nowrap border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700 sm:pr-4 w-full sm:w-auto">
                        <FiList className="text-lg text-blue-500 dark:text-blue-400" />
                        <span>Filter Status</span>
                    </div>

                    <div className="flex flex-wrap gap-2 p-1 w-full sm:w-auto">
                        {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${statusFilter === status
                                    ? 'bg-blue-600 text-white scale-105'
                                    : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                {statusFilter === status && <FiCheck strokeWidth={3} />}
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Create Task Button (Resized) */}
                <button
                    onClick={handleAddRow}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group whitespace-nowrap w-full xl:w-auto text-sm"
                >
                    <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
                    <span>Create New Task</span>
                </button>
            </div>

            {/* Tasks Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden animate-slideUp transition-colors">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm sticky top-0 z-10 transition-colors">
                                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest min-w-[120px] border-b border-r border-slate-200 dark:border-slate-700">
                                    Created
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest w-full min-w-[300px] border-b border-r border-slate-200 dark:border-slate-700">
                                    Task Details
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest min-w-[140px] border-b border-r border-slate-200 dark:border-slate-700">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest min-w-[200px] border-b border-r border-slate-200 dark:border-slate-700">
                                    Linked Activity
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest w-32 border-b border-slate-200 dark:border-slate-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800">
                            {loading ? (
                                // Skeleton Loader Rows
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`skeleton-${index}`} className="animate-pulse border-b border-r border-slate-200 dark:border-slate-700 last:border-b-0">
                                        {/* Date Skeleton */}
                                        <td className="px-5 py-4 border-r border-slate-200 dark:border-slate-700">
                                            <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                        </td>
                                        {/* Details Skeleton */}
                                        <td className="px-5 py-4 w-full border-r border-slate-200 dark:border-slate-700">
                                            <div className="space-y-2">
                                                <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                                <div className="h-3 w-1/2 bg-slate-50 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        </td>
                                        {/* Status Skeleton */}
                                        <td className="px-5 py-4 border-r border-slate-200 dark:border-slate-700">
                                            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                        </td>
                                        {/* Linked Activity Skeleton */}
                                        <td className="px-5 py-4 border-r border-slate-200 dark:border-slate-700">
                                            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                        </td>
                                        {/* Actions Skeleton */}
                                        <td className="px-5 py-4">
                                            <div className="flex justify-center gap-2">
                                                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-6 opacity-60">
                                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                <FiList className="text-4xl text-slate-300 dark:text-slate-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-bold text-slate-700 dark:text-white">No tasks found</p>
                                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                                    {statusFilter === 'All'
                                                        ? "Get organized by adding your first task using the button above."
                                                        : `No tasks found with status "${statusFilter}".`}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task, index) => {
                                    const taskId = task.id || task._id;
                                    const activityName = getActivityName(task.activity_id);

                                    return (
                                        <tr
                                            key={taskId}
                                            className={`group transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-700/30`}
                                        >
                                            {/* Date */}
                                            <td className="px-5 py-2.5 align-top border-b border-r border-slate-200 dark:border-slate-700">
                                                <span className="text-slate-500 dark:text-slate-300 font-bold text-sm whitespace-nowrap bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
                                                    {new Date(task.created_at || Date.now()).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </td>

                                            {/* Task Name & Desc */}
                                            <td className="px-5 py-2.5 border-b border-r border-slate-200 dark:border-slate-700">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-sm font-bold transition-colors ${task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-400 decoration-slate-300 dark:decoration-slate-500 decoration-2' : 'text-slate-800 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400'
                                                        }`}>
                                                        {task.title}
                                                    </span>
                                                    {task.description && (
                                                        <span className={`text-sm leading-relaxed ${task.status === 'Completed' ? 'text-slate-300 dark:text-slate-500 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
                                                            {task.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-2.5 align-top pt-3.5 border-b border-r border-slate-200 dark:border-slate-700">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border ${task.status === 'Completed'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                                                    : task.status === 'In Progress'
                                                        ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800'
                                                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500' : task.status === 'In Progress' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                                    {task.status}
                                                </span>
                                            </td>

                                            {/* Linked Activity */}
                                            <td className="px-5 py-2.5 align-top pt-3.5 border-b border-r border-slate-200 dark:border-slate-700">
                                                {activityName ? (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        <FiActivity />
                                                        {activityName}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-600 text-xs italic font-medium px-2 py-1">--</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-2.5 align-top pt-3.5 border-b border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleToggleComplete(task)}
                                                        className={`p-2 rounded-lg transition-all hover:scale-110 border ${task.status === 'Completed'
                                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                            : 'text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                                            }`}
                                                        title={task.status === 'Completed' ? "Mark Incomplete" : "Mark Complete"}
                                                    >
                                                        <FiCheck className="text-lg" strokeWidth={3} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleEditTask(task)}
                                                        className="p-2 text-blue-500 dark:text-blue-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all hover:scale-110"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(taskId)}
                                                        className="p-2 text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-rose-200 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all hover:scale-110"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Modal (Create & Edit) */}
            {showModal && (
                <TaskFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    activities={activities}
                    initialActivityId={initialActivityId}
                    taskToEdit={editingTask}
                    onTaskSaved={handleTaskSaved}
                />
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #cbd5e1;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default TasksPage;
