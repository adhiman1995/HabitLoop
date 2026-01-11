import React from 'react';
import { FiCheck, FiEdit2, FiTrash2, FiClock, FiPlus } from 'react-icons/fi';
import { DAYS_OF_WEEK, formatDate, isToday, getCategoryStyle, formatTime, formatTimeRange } from '../utils/helpers';

const WeeklyCalendar = ({ activities, weekDates, onToggle, onEdit, onDelete, onCreate, onView }) => {

    // Group activities by time slot for row-based display
    const getActivityForDayAndTime = (dayName, timeSlot) => {
        return activities.find(
            activity => activity.day_of_week === dayName && activity.time_slot === timeSlot
        );
    };

    // Get all unique time slots from activities, sorted
    const allTimeSlots = [...new Set(activities.map(a => a.time_slot))].sort();

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
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                    <tr>
                        <th className="p-6 bg-white sticky left-0 top-0 z-30 min-w-[100px] border-b border-r border-slate-200">
                            <span className="text-sm font-extrabold text-slate-600 uppercase tracking-widest pl-2">Time</span>
                        </th>
                        {DAYS_OF_WEEK.map((day, index) => {
                            const date = weekDates[index];
                            const isTodayDate = isToday(date);
                            return (
                                <th
                                    key={day}
                                    className={`p-4 text-center min-w-[160px] sticky top-0 z-20 border-b border-r border-slate-200 bg-white last:border-r-0
                                    `}
                                >
                                    <div className={`inline-flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300
                                        ${isTodayDate ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'hover:bg-slate-50'}
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
                            <td className="p-4 align-top text-right sticky left-0 z-10 bg-white border-r border-b border-slate-200">
                                <span className="text-sm font-bold text-slate-600 relative -top-3">{formatTime(timeSlot)}</span>
                            </td>
                            {DAYS_OF_WEEK.map((day, colIndex) => {
                                const activity = getActivityForDayAndTime(day, timeSlot);
                                const style = activity ? getCategoryStyle(activity.category) : {};

                                return (
                                    <td
                                        key={day}
                                        className="p-2 align-top transition-all duration-300 border-b border-r border-slate-200 hover:bg-slate-50 last:border-r-0"
                                    >
                                        <div className="h-full min-h-[110px]">
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

                                                        {/* Actions Menu */}
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/40 backdrop-blur-sm rounded-lg p-0.5">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onEdit(activity) }}
                                                                className="p-1.5 rounded-md hover:bg-white text-slate-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FiEdit2 size={12} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onDelete(activity.id) }}
                                                                className="p-1.5 rounded-md hover:bg-white text-rose-500 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={12} />
                                                            </button>
                                                        </div>
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

                                                    {/* Footer: Checkmark */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onToggle(activity.id); }}
                                                            className={`w-7 h-7 flex items-center justify-center rounded-full shadow-sm section-transition transform transition-all duration-200 hover:scale-110 active:scale-95
                                                                ${activity.completed
                                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-600 shadow-blue-200'
                                                                    : 'bg-white text-slate-300 ring-1 ring-slate-200 hover:border-blue-300 hover:text-blue-500'
                                                                }`}
                                                            title={activity.completed ? "Mark as incomplete" : "Mark as done"}
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
