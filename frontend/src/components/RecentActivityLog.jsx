import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const RecentActivityLog = ({ activities }) => {

    const recentActivities = activities
        .filter(a => a.completed)
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors h-full">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" />
                Recent Activity Completed
            </h3>

            <div className="space-y-3">
                {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <FiCheckCircle className="text-emerald-500 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                    {activity.title}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                                    {activity.category}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <FiCheckCircle className="text-3xl mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No completed activities yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivityLog;

