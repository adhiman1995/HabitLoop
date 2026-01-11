import React from 'react';
import { FiCheck, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import { getCategoryStyle, formatTime } from '../utils/helpers';

const ActivityCard = ({ activity, onToggle, onEdit, onDelete }) => {
    const categoryStyle = getCategoryStyle(activity.category);

    return (
        <div
            className={`glass-card p-4 mb-3 transform transition-all duration-300 hover:scale-102 hover:shadow-2xl ${activity.completed ? 'opacity-75' : ''
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`category-badge ${categoryStyle.color} ${categoryStyle.textColor}`}>
                            {activity.category}
                        </span>
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                            <FiClock className="text-xs" />
                            <span>{formatTime(activity.time_slot)}</span>
                            <span className="mx-1">•</span>
                            <span>{activity.duration} min</span>
                        </div>
                    </div>

                    <h3
                        className={`text-lg font-semibold text-white mb-1 ${activity.completed ? 'line-through opacity-60' : ''
                            }`}
                    >
                        {activity.title}
                    </h3>

                    {activity.description && (
                        <p className="text-white/70 text-sm line-clamp-2">
                            {activity.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onToggle(activity.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${activity.completed
                                ? 'bg-success-500 text-white shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        title={activity.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        <FiCheck className="text-lg" />
                    </button>

                    <button
                        onClick={() => onEdit(activity)}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200"
                        title="Edit activity"
                    >
                        <FiEdit2 className="text-lg" />
                    </button>

                    <button
                        onClick={() => onDelete(activity.id)}
                        className="p-2 bg-red-500/30 text-white rounded-lg hover:bg-red-500/50 transition-all duration-200"
                        title="Delete activity"
                    >
                        <FiTrash2 className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
