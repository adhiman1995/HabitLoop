import React from 'react';
import { FiCheck, FiEdit2, FiTrash2, FiClock, FiPlus } from 'react-icons/fi';
import { DAYS_OF_WEEK, formatDate, isToday, getCategoryStyle, formatTime, formatTimeRange } from '../utils/helpers';

const WeeklyCalendar = ({ activities, weekDates, onToggle, onEdit, onDelete, onCreate, onView, isLoading }) => {

    // Show Skeleton Loader if loading week
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-pulse">
                <div className="flex border-b border-slate-200">
                    {/* Skeleton Header */}
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="flex-1 p-4 text-center border-r border-slate-200 last:border-r-0">
                            <div className="h-12 w-16 bg-slate-200 rounded-xl mx-auto mb-2"></div>
                        </div>
                    ))}
                </div>
                <div className="p-4 space-y-4">
                    {/* Skeleton Rows */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            {DAYS_OF_WEEK.map(d => (
                                <div key={d} className="flex-1 h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Filter activities to only this week's relevant ones
    // This prevents rows from appearing for specific-date activities in other weeks
    const visibleActivities = activities.filter(activity => {
        if (activity.is_recurring) return true;
        if (!activity.specific_date) return true; // Legacy fallback

        // Check if specific_date is in current weekDates
        const actDate = new Date(activity.specific_date).toDateString();
        return weekDates.some(date => date.toDateString() === actDate);
    });

    // Group activities by time slot for row-based display
    const getActivityForDayAndTime = (dayName, timeSlot, date) => {
        return visibleActivities.find(activity => {
            const isTimeMatch = activity.time_slot === timeSlot;
            if (!isTimeMatch) return false;

            // 1. Recurring Logic (Matches Day Name)
            if (activity.is_recurring) {
                return activity.day_of_week === dayName;
            }

            // 2. Specific Date Logic (Matches Exact Date)
            // Use local date string comparison to avoid timezone issues for now
            if (activity.specific_date) {
                const activityDate = new Date(activity.specific_date).toDateString();
                const cellDate = date.toDateString();
                return activityDate === cellDate;
            }

            // Fallback for legacy data (treat as recurring if no specific date)
            return activity.day_of_week === dayName;
        });
    };

    // Get all unique time slots from VISIBLE activities, sorted
    const allTimeSlots = [...new Set(visibleActivities.map(a => a.time_slot))].sort();

    // If no activities, show empty state
    if (activities.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-16 text-center">
                <div className="text-slate-400 mb-4">
                    <FiClock className="text-6xl mx-auto mb-6 opacity-50" />
                    <p className="text-2xl text-slate-700 font-bold mb-2 tracking-tight">No activities yet</p>
                    <p className="text-base text-slate-500 font-medium">Click "Add Activity" to plan your week</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                    <tr>

                        {DAYS_OF_WEEK.map((day, index) => {
                            const date = weekDates[index];
                            const isTodayDate = isToday(date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const checkDate = new Date(date);
                            checkDate.setHours(0, 0, 0, 0);
                            const isPast = checkDate < today;

                            return (
                                <th
                                    key={day}
                                    className={`p-4 text-center min-w-[160px] sticky top-0 z-20 border-b border-r border-slate-200 last:border-r-0 transition-colors
                                        ${isPast ? 'bg-slate-100/60' : 'bg-white'}
                                    `}
                                >
                                    <div className={`inline-flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300
                                        ${isTodayDate ? 'bg-blue-600 shadow-lg shadow-blue-200' : (isPast ? 'opacity-60' : 'hover:bg-slate-50')}
                                    `}>
                                        <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${isTodayDate ? 'text-blue-200' : 'text-slate-600'}`}>
                                            {day.substring(0, 3)}
                                        </div>
                                        <div className={`text-xl font-black ${isTodayDate ? 'text-white' : 'text-slate-800'}`}>
                                            {date.getDate()}
                                        </div>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {allTimeSlots.map((timeSlot) => (
                        <tr key={timeSlot} className="group/row">

                            {DAYS_OF_WEEK.map((day, colIndex) => {
                                const date = weekDates[colIndex];
                                const activity = getActivityForDayAndTime(day, timeSlot, date);
                                const style = activity ? getCategoryStyle(activity.category) : {};

                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const checkDate = new Date(date);
                                checkDate.setHours(0, 0, 0, 0);
                                const isPast = checkDate < today;

                                return (
                                    <td
                                        key={day}
                                        className={`p-2 align-top transition-all duration-300 border-b border-r border-slate-200 last:border-r-0
                                            ${isPast ? 'bg-slate-50/80 hover:bg-slate-100' : 'hover:bg-slate-50'}
                                        `}
                                    >
                                        <div className={`h-full min-h-[110px] ${isPast ? 'opacity-75 grayscale-[0.3]' : ''}`}>
                                            {activity ? (
                                                <div
                                                    onClick={() => onView(activity)}
                                                    className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer border-2 shadow-sm hover:shadow-md
                                                        ${activity.completed ? 'opacity-60 grayscale-[0.5]' : ''}
                                                        ${style.pastelBg} ${style.hoverBg} ${style.pastelBorder}
                                                    `}
                                                >
                                                    {/* Header: Category & Actions */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className={`text-[12px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/50 backdrop-blur-sm ${style.pastelText}`}>
                                                            {activity.category}
                                                        </span>

                                                        {/* Original Actions Menu removed, now in footer */}
                                                    </div>

                                                    {/* Main Content */}
                                                    <div className="space-y-1 mb-4">
                                                        <h4 className={`text-base font-extrabold leading-tight ${style.pastelText} ${activity.completed ? 'line-through decoration-2 opacity-75' : ''}`}>
                                                            {activity.title}
                                                        </h4>

                                                        <div className={`flex items-center gap-1.5 text-xs font-bold opacity-80 ${style.pastelText}`}>
                                                            <FiClock size={12} className="shrink-0 opacity-70" />
                                                            <span>{formatTimeRange(activity.time_slot, activity.duration)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="absolute top-4 right-4 z-20">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!isPast) onToggle(activity.id);
                                                            }}
                                                            disabled={isPast}
                                                            className={`w-8 h-8 flex items-center justify-center rounded-full shadow-sm section-transition transform transition-all duration-200 
                                                                ${activity.completed
                                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-600 shadow-blue-200'
                                                                    : (isPast
                                                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed ring-0'
                                                                        : 'bg-white text-slate-300 ring-1 ring-slate-200 hover:scale-110 active:scale-95 hover:border-blue-300 hover:text-blue-500'
                                                                    )
                                                                }`}
                                                            title={isPast ? "Past activities are locked" : (activity.completed ? "Mark as incomplete" : "Mark as done")}
                                                        >
                                                            <FiCheck size={14} className={`transition-all duration-300 ${activity.completed ? 'stroke-[4px]' : 'stroke-[3px]'}`} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => onCreate && onCreate({ day_of_week: day, time_slot: timeSlot })}
                                                    className="w-full h-full min-h-[110px] rounded-[20px] hover:bg-slate-50 transition-all duration-200 group/cell cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white grid place-items-center shadow-lg transform scale-0 group-hover/cell:scale-100 transition-transform duration-300 leading-none">
                                                        <FiPlus size={20} className="block" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default WeeklyCalendar;
