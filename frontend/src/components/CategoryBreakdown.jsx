import React from 'react';
import { CATEGORIES } from '../utils/helpers';

const CategoryBreakdown = ({ activities }) => {

    const categoryStats = activities.reduce((acc, activity) => {
        const { category, duration } = activity;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += parseInt(duration, 10);
        return acc;
    }, {});

    const totalDuration = Object.values(categoryStats).reduce((sum, val) => sum + val, 0);

    const sortedCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => ({
            key,
            value,
            percentage: totalDuration ? Math.round((value / totalDuration) * 100) : 0
        }));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Time Distribution</h3>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {sortedCategories.length > 0 ? (
                    sortedCategories.map(({ key, value, percentage }) => {
                        const categoryConfig = CATEGORIES.find(c => c.id === key) || { label: key, color: 'bg-slate-500' };

                        return (
                            <div key={key} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-700 dark:text-slate-300">{categoryConfig.label}</span>
                                    <span className="text-slate-500 dark:text-slate-400">{percentage}% ({value}m)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${categoryConfig.color.replace('text-', 'bg-').split(' ')[0]} transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No activities recorded yet.
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                Based on your total logged activity time.
            </p>
        </div>
    );
};

export default CategoryBreakdown;
