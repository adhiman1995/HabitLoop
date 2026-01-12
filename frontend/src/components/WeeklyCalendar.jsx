import React from 'react';
import { FiCheck, FiEdit2, FiTrash2, FiClock, FiPlus, FiMoreHorizontal } from 'react-icons/fi';
import { DAYS_OF_WEEK, formatDate, isToday, getCategoryStyle, formatTime, formatTimeRange } from '../utils/helpers';

const WeeklyCalendar = ({ activities, weekDates, onToggle, onEdit, onDelete, onCreate, onView, isLoading }) => {

    // Show Skeleton Loader if loading week
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-pulse">
                <div className="flex border-b border-slate-100 dark:border-slate-700">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="flex-1 p-6 text-center border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                            <div className="h-14 w-20 bg-slate-100 dark:bg-slate-700 rounded-lg mx-auto mb-2"></div>
                        </div>
                    ))}
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            {DAYS_OF_WEEK.map(d => (
                                <div key={d} className="flex-1 h-32 bg-slate-50 rounded-lg border border-slate-100"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const visibleActivities = activities.filter(activity => {
        if (activity.is_recurring) return true;
        if (!activity.specific_date) return true;

        const actDate = new Date(activity.specific_date).toDateString();
        return weekDates.some(date => date.toDateString() === actDate);
    });

    const getActivityForDayAndTime = (dayName, timeSlot, date) => {
        return visibleActivities.find(activity => {
            const isTimeMatch = activity.time_slot === timeSlot;
            if (!isTimeMatch) return false;

            if (activity.is_recurring) {
                return activity.day_of_week === dayName;
            }

            if (activity.specific_date) {
                const activityDate = new Date(activity.specific_date).toDateString();
                const cellDate = date.toDateString();
                return activityDate === cellDate;
            }

            return activity.day_of_week === dayName;
        });
    };

    const allTimeSlots = [...new Set(visibleActivities.map(a => a.time_slot))].sort();

    if (activities.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 p-20 text-center animate-fadeIn">
                <div className="text-slate-400 dark:text-slate-500 mb-6">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiClock className="text-4xl text-slate-300 dark:text-slate-500" />
                    </div>
                    <p className="text-2xl text-slate-800 dark:text-white font-bold mb-3 tracking-tight">Schedule is empty</p>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                        Your week is wide open. Click the "Add New Activity" button above or tap on a time slot to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden animate-slideUp transition-colors">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
                    <thead>
                        <tr>
                            {DAYS_OF_WEEK.map((day, index) => {
                                const date = weekDates[index];
                                const isTodayDate = isToday(date);

                                return (
                                    <th
                                        key={day}
                                        className="p-4 text-center sticky top-0 z-20 border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm w-1/7 group"
                                    >
                                        <div className={`inline-flex flex-col items-center justify-center py-3 px-6 rounded-lg transition-all duration-300
                                            ${isTodayDate
                                                ? 'bg-blue-600 shadow-lg shadow-blue-300 scale-105'
                                                : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                                            }
                                        `}>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isTodayDate ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-400'}`}>
                                                {day.substring(0, 3)}
                                            </div>
                                            <div className={`text-2xl font-black ${isTodayDate ? 'text-white' : 'text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400'}`}>
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
                                            className={`p-3 align-top transition-all duration-300 border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0
                                                ${isPast ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'}
                                            `}
                                        >
                                            <div className={`h-[140px] ${isPast ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                                                {activity ? (
                                                    <div
                                                        onClick={() => onView(activity)}
                                                        className={`group relative p-4 h-full rounded-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer border-2 shadow-sm hover:shadow-xl flex flex-col hover:z-30
                                                            ${activity.completed ? 'opacity-70 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : `${style.pastelBg} ${style.hoverBg} ${style.pastelBorder}`}
                                                        `}
                                                    >
                                                        <div className="flex justify-between items-start mb-2 shrink-0">
                                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm ${style.pastelText}`}>
                                                                {activity.category}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1 flex-1 min-h-0 pt-1">
                                                            <h4 className={`text-sm font-extrabold leading-tight ${style.pastelText} ${activity.completed ? 'line-through decoration-2 opacity-50' : ''} line-clamp-2`}>
                                                                {activity.title}
                                                            </h4>

                                                            <div className={`flex items-center gap-1.5 text-[10px] font-bold opacity-80 ${style.pastelText} mt-auto`}>
                                                                <FiClock size={10} className="shrink-0" />
                                                                <span>{formatTimeRange(activity.time_slot, activity.duration)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="absolute top-3 right-3 z-20">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!isPast) onToggle(activity.id);
                                                                }}
                                                                disabled={isPast}
                                                                className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm transition-all duration-200 
                                                                    ${activity.completed
                                                                        ? 'bg-blue-600 text-white shadow-blue-200 scale-100 rotate-0'
                                                                        : (isPast
                                                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                                            : 'bg-white/80 backdrop-blur-sm text-slate-300 hover:text-blue-500 hover:bg-white hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100'
                                                                        )
                                                                    }`}
                                                                title={isPast ? "Past activities are locked" : (activity.completed ? "Mark as incomplete" : "Mark as done")}
                                                            >
                                                                <FiCheck size={16} className={`transition-all duration-300 ${activity.completed ? 'stroke-[3px]' : 'stroke-[3px]'}`} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => !isPast && onCreate && onCreate({ day_of_week: day, time_slot: timeSlot })}
                                                        className={`w-full h-full rounded-lg transition-all duration-200 group/cell flex items-center justify-center
                                                            ${isPast ? 'cursor-default bg-slate-50/50 dark:bg-slate-900/50' : 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10'}
                                                        `}
                                                    >
                                                        {!isPast && (
                                                            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white grid place-items-center shadow-lg shadow-blue-200 transform scale-0 group-hover/cell:scale-100 transition-all duration-300 hover:bg-blue-700">
                                                                <FiPlus size={22} />
                                                            </div>
                                                        )}
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
            </div>

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
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div >
    );
};

export default WeeklyCalendar;
