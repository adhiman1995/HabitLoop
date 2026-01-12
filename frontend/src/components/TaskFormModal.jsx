import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { taskAPI } from '../services/api';
import { FiX, FiType, FiAlignLeft, FiActivity, FiCheckCircle, FiLoader } from 'react-icons/fi';

const TaskFormModal = ({ isOpen, onClose, activities, initialActivityId, taskToEdit = null, onTaskSaved }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
        activity_id: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                status: taskToEdit.status,
                activity_id: taskToEdit.activity_id?.id || taskToEdit.activity_id?._id || taskToEdit.activity_id || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'Pending',
                activity_id: initialActivityId || ''
            });
        }
    }, [taskToEdit, initialActivityId, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                activity_id: formData.activity_id || null
            };

            let savedTask;
            if (taskToEdit) {
                const res = await taskAPI.update(taskToEdit.id || taskToEdit._id, dataToSubmit);
                savedTask = res.data;
            } else {
                const res = await taskAPI.create(dataToSubmit);
                savedTask = res.data;
            }

            if (onTaskSaved) onTaskSaved(savedTask);
            onClose();
        } catch (err) {
            console.error('Failed to save task', err);
            alert('Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn transition-colors"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 animate-slideUp relative overflow-hidden transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-6 relative">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {taskToEdit ? 'Edit Task' : 'New Task'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {taskToEdit ? 'Update task details below' : 'Create a new task to stay organized'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors group"
                    >
                        <FiX className="text-xl text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    {/* Task Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FiType /> Task Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-base font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white"
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                        />
                    </div>



                    {/* Status Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FiCheckCircle /> Status
                        </label>
                        <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            {['Pending', 'In Progress', 'Completed'].map(status => (
                                <button
                                    type="button"
                                    key={status}
                                    onClick={() => setFormData({ ...formData, status })}
                                    className={`py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.status === status
                                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white scale-100'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Linked Activity */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <FiActivity /> Linked Activity
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.activity_id}
                                    onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
                                    className="w-full px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-lg appearance-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-slate-700 dark:text-white font-medium"
                                >
                                    <option value="">No linked activity</option>
                                    {activities.map(act => (
                                        <option key={act.id || act._id} value={act.id || act._id}>
                                            {act.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FiAlignLeft /> Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-600 dark:text-slate-300"
                            placeholder="Add details, subtasks, or notes..."
                            rows="3"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all font-bold text-sm uppercase tracking-wide"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <FiLoader className="animate-spin text-lg" />}
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default TaskFormModal;
