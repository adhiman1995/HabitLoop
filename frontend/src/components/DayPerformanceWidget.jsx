import React, { useMemo } from 'react';

const DayPerformanceWidget = ({ activities }) => {
    const dayStats = useMemo(() => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const stats = days.map(day => {
            const dayActivities = activities.filter(a => a.day_of_week === day);
            const completed = dayActivities.filter(a => a.completed).length;
            const total = dayActivities.length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                day,
                label: day.substring(0, 3),
                completed,
                total,
                rate
            };
        });

        // Find best and worst days
        const activeDays = stats.filter(s => s.total > 0);
        const best = activeDays.length > 0
            ? activeDays.reduce((a, b) => a.rate > b.rate ? a : b)
            : null;
        const worst = activeDays.length > 0
            ? activeDays.reduce((a, b) => a.rate < b.rate ? a : b)
            : null;

        return { stats, best, worst };
    }, [activities]);

    const maxRate = Math.max(...dayStats.stats.map(s => s.rate), 1);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-colors">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Day-of-Week Performance</h3>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-24 mb-4">
                {dayStats.stats.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                {day.completed}/{day.total} ({day.rate}%)
                            </div>
                        </div>
                        <div
                            className={`w-full rounded-t transition-all duration-500 cursor-pointer hover:opacity-80 ${dayStats.best?.day === day.day
                                    ? 'bg-emerald-500'
                                    : dayStats.worst?.day === day.day && day.total > 0
                                        ? 'bg-rose-400 dark:bg-rose-500'
                                        : day.rate >= 70
                                            ? 'bg-blue-400 dark:bg-blue-500'
                                            : day.total > 0
                                                ? 'bg-amber-400 dark:bg-amber-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            style={{ height: `${Math.max((day.rate / maxRate) * 80, 4)}px` }}
                        />
                        <span className={`text-[10px] font-medium ${dayStats.best?.day === day.day
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}>
                            {day.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Insights */}
            <div className="flex justify-between text-xs">
                {dayStats.best && (
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400">Best:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{dayStats.best.label} ({dayStats.best.rate}%)</span>
                    </div>
                )}
                {dayStats.worst && dayStats.worst.day !== dayStats.best?.day && (
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400">Needs work:</span>
                        <span className="font-bold text-rose-500 dark:text-rose-400">{dayStats.worst.label} ({dayStats.worst.rate}%)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayPerformanceWidget;
