import React, { useMemo } from 'react';
import { CATEGORIES } from '../utils/helpers';
import { FiClock, FiTrendingUp, FiAlertTriangle, FiPieChart } from 'react-icons/fi';

const CategoryBreakdown = ({ activities }) => {
    const { sortedCategories, insights, totalDuration } = useMemo(() => {
        const categoryStats = activities.reduce((acc, activity) => {
            const { category, duration, completed } = activity;
            if (!acc[category]) {
                acc[category] = { time: 0, count: 0, completed: 0 };
            }
            acc[category].time += parseInt(duration, 10);
            acc[category].count += 1;
            if (completed) acc[category].completed += 1;
            return acc;
        }, {});

        const total = Object.values(categoryStats).reduce((sum, val) => sum + val.time, 0);

        const sorted = Object.entries(categoryStats)
            .sort(([, a], [, b]) => b.time - a.time)
            .map(([key, value]) => ({
                key,
                time: value.time,
                count: value.count,
                completed: value.completed,
                percentage: total ? Math.round((value.time / total) * 100) : 0,
                avgDuration: value.count > 0 ? Math.round(value.time / value.count) : 0
            }));

        // Generate insights
        const topTimeCategory = sorted[0];
        const leastTimeCategory = sorted[sorted.length - 1];

        // Check for imbalance (one category > 50%)
        const isDominated = topTimeCategory && topTimeCategory.percentage > 50;

        // Find neglected categories (have activities but < 10% time)
        const neglected = sorted.find(c => c.percentage < 10 && c.count >= 2);

        // Calculate total hours
        const totalHours = (total / 60).toFixed(1);

        return {
            sortedCategories: sorted,
            totalDuration: total,
            insights: {
                topTimeCategory,
                leastTimeCategory,
                isDominated,
                neglected,
                totalHours,
                categoryCount: sorted.length
            }
        };
    }, [activities]);

    const getCategoryColor = (categoryName) => {
        const colors = {
            'Work': 'bg-blue-500',
            'Personal': 'bg-sky-500',
            'Fitness': 'bg-emerald-500',
            'Learning': 'bg-amber-500',
            'Social': 'bg-pink-500',
            'Health': 'bg-red-500',
            'Creative': 'bg-violet-500',
            'Other': 'bg-slate-500'
        };
        return colors[categoryName] || 'bg-slate-500';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Time Distribution</h3>

            {/* Progress Bars */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar mb-4">
                {sortedCategories.length > 0 ? (
                    sortedCategories.map(({ key, time, count, percentage, avgDuration }) => (
                        <div key={key} className="space-y-1 group">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-slate-700 dark:text-slate-300">{key}</span>
                                <span className="text-slate-500 dark:text-slate-400">
                                    {percentage}% <span className="text-slate-400 dark:text-slate-500">({(time / 60).toFixed(1)}h)</span>
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getCategoryColor(key)} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {count} activities • Avg {avgDuration}m each
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No activities recorded yet.
                    </div>
                )}
            </div>

            {/* Insights Section */}
            {sortedCategories.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Insights</p>

                    {/* Total Time */}
                    <div className="flex items-center gap-2 text-sm">
                        <FiClock className="text-blue-500" />
                        <span className="text-slate-600 dark:text-slate-300">
                            Total: <span className="font-bold">{insights.totalHours}h</span> across {insights.categoryCount} categories
                        </span>
                    </div>

                    {/* Dominant Category Warning */}
                    {insights.isDominated && (
                        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-sm">
                            <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-amber-700 dark:text-amber-400">
                                <span className="font-bold">{insights.topTimeCategory.key}</span> takes {insights.topTimeCategory.percentage}% of your time. Consider balancing.
                            </span>
                        </div>
                    )}

                    {/* Suggestion */}
                    {insights.neglected && (
                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-sm">
                            <FiPieChart className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-700 dark:text-blue-400">
                                <span className="font-bold">{insights.neglected.key}</span> only gets {insights.neglected.percentage}% of your time. Need more focus?
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryBreakdown;
