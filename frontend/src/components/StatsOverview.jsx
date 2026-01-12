import React from 'react';
import { FiCheckCircle, FiClock, FiActivity, FiTrendingUp } from 'react-icons/fi';

const StatsOverview = ({ activities }) => {

    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.completed).length;
    const totalMinutes = activities.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);


    const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
    const avgDuration = totalActivities > 0 ? Math.round(totalMinutes / totalActivities) : 0;


    const categoryCounts = activities.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});
    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || '-';


    const weeklyGoal = 20;
    const goalProgress = Math.min(Math.round((totalActivities / weeklyGoal) * 100), 100);


    const stats = [
        {
            label: 'Weekly Activities',
            value: totalActivities,
            subtext: `/ ${weeklyGoal} Goal`,
            icon: FiActivity,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            progress: goalProgress
        },
        {
            label: 'Total Hours',
            value: totalHours,
            subtext: `Avg ${avgDuration}m/session`,
            icon: FiClock,
            color: 'text-sky-600 dark:text-sky-400',
            bg: 'bg-sky-50 dark:bg-sky-900/20',
            progress: null
        },
        {
            label: 'Completion',
            value: `${completionRate}%`,
            subtext: `${completedActivities} finished`,
            icon: FiCheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
            progress: completionRate
        },
        {
            label: 'Top Focus',
            value: topCategory,
            subtext: `${categoryCounts[topCategory] || 0} sessions`,
            icon: FiTrendingUp,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            progress: null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden group">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.subtext}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className={`text-xl ${stat.color}`} />
                        </div>
                    </div>

                    {stat.progress !== null && (
                        <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${stat.color.replace('text-', 'bg-').split(' ')[0]} transition-all duration-1000 ease-out`}
                                style={{ width: `${stat.progress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;
