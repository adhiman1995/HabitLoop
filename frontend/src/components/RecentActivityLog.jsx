import React from 'react';
import { formatDate } from '../utils/helpers';
import { FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';

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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" />
                Recent Completions
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Activity</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                        {activity.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            {activity.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(new Date(activity.date))}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {activity.duration}m
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-slate-400 italic">
                                    No completed activities yet. Start tracking!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivityLog;
