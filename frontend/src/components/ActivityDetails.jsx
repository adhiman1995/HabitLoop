import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiClock, FiCalendar, FiTag, FiAlignLeft, FiEdit2, FiTrash2, FiAlertCircle, FiCheckSquare, FiCheck } from 'react-icons/fi';
import { getCategoryStyle, formatTimeRange } from '../utils/helpers';

const ActivityDetails = ({ activity, onClose, onEdit, onDelete, onCreateTask, onToggle }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!activity) return null;

    const style = getCategoryStyle(activity.category);

    return createPortal(
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn transition-colors"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden relative animate-slideUp transition-colors"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <div className="p-6 pb-0 relative">
                    <div className="flex items-start justify-between mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${style.pastelText.replace('text', 'bg').replace('800', '500')}`}></span>
                            {activity.category}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors group -mr-2 -mt-2"
                        >
                            <FiX className="text-xl text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                        {activity.title}
                    </h2>
                </div>

                <div className="p-6 space-y-5 relative">
                    {/* Time & Date */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                            <FiClock size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Schedule</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-white">
                                {formatTimeRange(activity.time_slot, activity.duration)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${Array.isArray(activity.day_of_week) ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {Array.isArray(activity.day_of_week) ? 'Recurring' : activity.day_of_week}
                                </span>
                                {Array.isArray(activity.day_of_week) && (
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        ({activity.day_of_week.join(', ')})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 rounded-lg shrink-0">
                            <FiAlignLeft size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Notes</p>
                            <div className="text-base leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {activity.description || <span className="italic text-slate-400 dark:text-slate-500">No notes provided for this activity.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    {isDeleting ? (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border-2 border-red-50 dark:border-red-900/30 shadow-sm animate-fadeIn">
                            <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold mb-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <FiAlertCircle size={20} />
                                </div>
                                <span className="text-lg">Are you sure?</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 pl-1">This will permanently delete this activity from your schedule.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleting(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Primary Action Button */}
                            <button
                                onClick={() => onToggle(activity.id)}
                                className={`w-full px-6 py-4 font-bold rounded-lg transition-all flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${activity.completed
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {activity.completed ? (
                                    <>
                                        <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-700">
                                            <FiCheck size={20} />
                                        </div>
                                        <span>Completed</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-1 rounded-full bg-blue-400/30">
                                            <FiCheck size={20} />
                                        </div>
                                        <span>Mark as Complete</span>
                                    </>
                                )}
                            </button>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex gap-1">
                                    {onEdit && (
                                        <button
                                            onClick={onEdit}
                                            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors flex items-center gap-2 group"
                                            title="Edit Activity"
                                        >
                                            <FiEdit2 size={16} className="group-hover:text-blue-500 transition-colors" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => setIsDeleting(true)}
                                            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors flex items-center gap-2 group"
                                            title="Delete Activity"
                                        >
                                            <FiTrash2 size={16} className="group-hover:text-red-500 transition-colors" />
                                            <span className="text-sm font-medium">Delete</span>
                                        </button>
                                    )}
                                </div>

                                {onCreateTask && (
                                    <button
                                        onClick={onCreateTask}
                                        className="px-3 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <FiCheckSquare size={16} />
                                        Create Task
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
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

export default ActivityDetails;
