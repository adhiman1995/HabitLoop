import React, { useState } from 'react';
import { FiX, FiClock, FiCalendar, FiTag, FiAlignLeft, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { getCategoryStyle, formatTimeRange } from '../utils/helpers';

const ActivityDetails = ({ activity, onClose, onEdit, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!activity) return null;

    const style = getCategoryStyle(activity.category);

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`px-8 py-6 ${style.pastelBg} relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-slate-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>

                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/60 ${style.pastelText}`}>
                            {activity.category}
                        </span>
                    </div>

                    <h2 className={`text-2xl font-black ${style.pastelText} leading-tight`}>
                        {activity.title}
                    </h2>
                </div>

                <div className="p-8 space-y-6">

                    <div className="flex items-start gap-4 text-slate-600">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <FiClock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-0.5">Time</p>
                            <p className="text-lg font-bold text-slate-800">
                                {formatTimeRange(activity.time_slot, activity.duration)}
                            </p>
                            <p className="text-sm font-medium text-slate-500">
                                {activity.day_of_week}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 text-slate-600 pt-4 border-t border-slate-100">
                        <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                            <FiAlignLeft size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">Description</p>
                            <div className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                                {activity.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
                    {isDeleting ? (
                        <div className="flex items-center justify-between animate-in bg-red-50 p-4 rounded-xl border border-red-100">
                            <div className="flex items-center gap-3 text-red-700 font-bold">
                                <FiAlertCircle size={20} />
                                <span>Delete this activity?</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsDeleting(false)}
                                    className="px-4 py-1.5 bg-white text-slate-600 font-bold rounded-lg border border-red-100 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="px-4 py-1.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                                {onEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                    >
                                        <FiEdit2 size={16} />
                                        <span>Edit</span>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => setIsDeleting(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                                    >
                                        <FiTrash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
