import React, { useMemo } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const WeekComparisonWidget = ({ activities }) => {
    const comparison = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // This week's Monday
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - daysSinceMonday);
        thisWeekStart.setHours(0, 0, 0, 0);

        // Last week's Monday
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);

        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);

        // Helper to check if activity falls in date range
        const isInRange = (activity, start, end) => {
            // For recurring activities, check if any day falls in the range
            if (activity.is_recurring) {
                // Check day of week matches any day in range
                const activityDay = activity.day_of_week;
                let cursor = new Date(start);
                while (cursor <= end) {
                    const cursorDayName = cursor.toLocaleDateString('en-US', { weekday: 'long' });
                    if (cursorDayName === activityDay) return true;
                    cursor.setDate(cursor.getDate() + 1);
                }
                return false;
            } else if (activity.specific_date) {
                const actDate = new Date(activity.specific_date);
                return actDate >= start && actDate <= end;
            }
            return false;
        };

        // Count activities for each week
        const thisWeekEnd = new Date();
        const thisWeekActivities = activities.filter(a => isInRange(a, thisWeekStart, thisWeekEnd));
        const lastWeekActivities = activities.filter(a => isInRange(a, lastWeekStart, lastWeekEnd));

        const thisWeekCompleted = thisWeekActivities.filter(a => a.completed).length;
        const lastWeekCompleted = lastWeekActivities.filter(a => a.completed).length;

        const thisWeekTotal = thisWeekActivities.length;
        const lastWeekTotal = lastWeekActivities.length;

        const thisWeekRate = thisWeekTotal > 0 ? Math.round((thisWeekCompleted / thisWeekTotal) * 100) : 0;
        const lastWeekRate = lastWeekTotal > 0 ? Math.round((lastWeekCompleted / lastWeekTotal) * 100) : 0;

        const change = thisWeekRate - lastWeekRate;

        return {
            thisWeek: { completed: thisWeekCompleted, total: thisWeekTotal, rate: thisWeekRate },
            lastWeek: { completed: lastWeekCompleted, total: lastWeekTotal, rate: lastWeekRate },
            change,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    }, [activities]);

    const getTrendIcon = () => {
        if (comparison.trend === 'up') return <FiTrendingUp className="text-emerald-500" />;
        if (comparison.trend === 'down') return <FiTrendingDown className="text-rose-500" />;
        return <FiMinus className="text-slate-400" />;
    };

    const getTrendColor = () => {
        if (comparison.trend === 'up') return 'text-emerald-500';
        if (comparison.trend === 'down') return 'text-rose-500';
        return 'text-slate-400';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-colors">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Week-over-Week</h3>

            <div className="flex items-center justify-between mb-6">
                {/* This Week */}
                <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">This Week</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{comparison.thisWeek.rate}%</p>
                    <p className="text-xs text-slate-500">{comparison.thisWeek.completed}/{comparison.thisWeek.total}</p>
                </div>

                {/* Trend Arrow */}
                <div className="flex flex-col items-center">
                    <div className="text-2xl">{getTrendIcon()}</div>
                    <p className={`text-sm font-bold ${getTrendColor()}`}>
                        {comparison.change > 0 ? '+' : ''}{comparison.change}%
                    </p>
                </div>

                {/* Last Week */}
                <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Last Week</p>
                    <p className="text-3xl font-bold text-slate-400 dark:text-slate-500">{comparison.lastWeek.rate}%</p>
                    <p className="text-xs text-slate-500">{comparison.lastWeek.completed}/{comparison.lastWeek.total}</p>
                </div>
            </div>

            {/* Motivational Message */}
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                {comparison.trend === 'up'
                    ? "Great job! You're more disciplined this week! 🔥"
                    : comparison.trend === 'down'
                        ? "Keep pushing! Every day is a new chance. 💪"
                        : "Steady progress. Stay consistent! ✨"}
            </p>
        </div>
    );
};

export default WeekComparisonWidget;
