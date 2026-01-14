import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiPlus, FiClock } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

const AppHeader = ({
    currentView,
    currentWeekStart,
    weekDates,
    onPrevWeek,
    onNextWeek,
    onToday,
    onAddActivity
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const getPageTitle = () => {
        switch (currentView) {
            case 'dashboard': return 'Dashboard';
            case 'tasks': return 'Task Management';
            case 'activities': return 'My Schedule';
            case 'settings': return 'Settings';
            default: return 'Dashboard';
        }
    }

    const getPageSubtitle = () => {
        switch (currentView) {
            case 'dashboard': return 'Overview of your performance and statistics.';
            case 'tasks': return 'Track specific tasks linked to your activities.';
            case 'activities': return 'Manage your weekly activity schedule.';
            case 'settings': return 'Manage your account and preferences.';
            default: return '';
        }
    }

    return (
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 animate-fadeIn">
            <div>
                <h1 className="text-2xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                    {getPageTitle()}
                </h1>
                <p className="text-md text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                    {getPageSubtitle()}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                {/* Digital Clock - Only on Dashboard */}
                {currentView === 'dashboard' && (
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                        <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <FiClock className="text-blue-500 text-base sm:text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-wider">
                                {formatTime(currentTime)}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                        </div>
                    </div>
                )}
                {/* Week Navigation - Only Show in Activities Tab */}
                {currentView === 'activities' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onPrevWeek}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95"
                        >
                            <FiChevronLeft className="text-2xl" />
                        </button>

                        <div className="flex flex-col items-center px-2">
                            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white">
                                <FiCalendar className="text-blue-500" />
                                <span>{formatDate(weekDates[0])} - {formatDate(weekDates[6])}</span>
                            </div>
                        </div>

                        <button
                            onClick={onNextWeek}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95"
                        >
                            <FiChevronRight className="text-2xl" />
                        </button>

                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-4 hidden sm:block"></div>

                        <button
                            onClick={onToday}
                            className="hidden sm:block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-all active:scale-95 border border-blue-100 dark:border-blue-800"
                        >
                            Today
                        </button>
                    </div>
                )}

                {currentView === 'activities' && (
                    <button
                        onClick={onAddActivity}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group whitespace-nowrap"
                    >
                        <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
                        <span>New Activity</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppHeader;
