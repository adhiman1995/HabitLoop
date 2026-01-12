import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiClock, FiCalendar, FiTag, FiAlignLeft, FiEdit2, FiTrash2, FiAlertCircle, FiCheckSquare, FiCheck } from 'react-icons/fi';
import { getCategoryStyle, formatTimeRange } from '../utils/helpers';

const ActivityDetails = ({ activity, onClose, onEdit, onDelete, onCreateTask }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!activity) return null;

    const style = getCategoryStyle(activity.category);

    return createPortal(
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden relative animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <div className="p-8 pb-0 relative">
                    <div className="flex items-start justify-between mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-600 flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${style.pastelText.replace('text', 'bg').replace('800', '500')}`}></span>
                            {activity.category}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group -mr-2 -mt-2"
                        >
                            <FiX className="text-xl text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                        {activity.title}
                    </h2>
                </div>

                <div className="p-8 space-y-6 relative">
                    {/* Time & Date */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <FiClock size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Schedule</p>
                            <p className="text-xl font-bold text-slate-800">
                                {formatTimeRange(activity.time_slot, activity.duration)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${Array.isArray(activity.day_of_week) ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {Array.isArray(activity.day_of_week) ? 'Recurring' : activity.day_of_week}
                                </span>
                                {Array.isArray(activity.day_of_week) && (
                                    <span className="text-sm text-slate-500 font-medium">
                                        ({activity.day_of_week.join(', ')})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-4 pt-6 border-t border-slate-100">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-lg shrink-0">
                            <FiAlignLeft size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Notes</p>
                            <div className="text-base leading-relaxed text-slate-600 whitespace-pre-wrap">
                                {activity.description || <span className="italic text-slate-400">No notes provided for this activity.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                    {isDeleting ? (
                        <div className="bg-white p-4 rounded-lg border-2 border-red-50 shadow-sm animate-fadeIn">
                            <div className="flex items-center gap-3 text-red-700 font-bold mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FiAlertCircle size={20} />
                                </div>
                                <span className="text-lg">Are you sure?</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-4 pl-1">This will permanently delete this activity from your schedule.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleting(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex gap-2">
                                {onEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="p-3 bg-white border-2 border-slate-100 text-slate-600 rounded-lg hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        title="Edit Activity"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => setIsDeleting(true)}
                                        className="p-3 bg-white border-2 border-slate-100 text-slate-600 rounded-lg hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Delete Activity"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                )}
                            </div>

                            {onCreateTask && (
                                <button
                                    onClick={onCreateTask}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
                                >
                                    <FiCheckSquare className="text-lg group-hover:scale-110 transition-transform" />
                                    <span>Create Task</span>
                                </button>
                            )}
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
