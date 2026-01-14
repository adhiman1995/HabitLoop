import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { CATEGORIES } from '../utils/helpers';
import { FiTrendingUp, FiAlertCircle, FiTarget } from 'react-icons/fi';

const AnalyticsChart = ({ activities }) => {
    const { data, insights } = useMemo(() => {
        const categoryData = CATEGORIES.map(cat => {
            const catActivities = activities.filter(a => a.category === cat.name);
            const count = catActivities.length;
            const completed = catActivities.filter(a => a.completed).length;
            const completionRate = count > 0 ? Math.round((completed / count) * 100) : 0;

            let fill = '#94a3b8'; // default slate-400
            if (cat.name === 'Work') fill = '#3b82f6';
            if (cat.name === 'Personal') fill = '#0ea5e9';
            if (cat.name === 'Fitness') fill = '#22c55e';
            if (cat.name === 'Learning') fill = '#f59e0b';
            if (cat.name === 'Social') fill = '#ec4899';
            if (cat.name === 'Health') fill = '#ef4444';
            if (cat.name === 'Creative') fill = '#8b5cf6';

            return {
                name: cat.name,
                activities: count,
                completed,
                completionRate,
                fill
            };
        }).filter(item => item.activities > 0);

        // Generate insights
        const sortedByCount = [...categoryData].sort((a, b) => b.activities - a.activities);
        const sortedByRate = [...categoryData].sort((a, b) => b.completionRate - a.completionRate);

        const topCategory = sortedByCount[0];
        const bottomCategory = sortedByCount[sortedByCount.length - 1];
        const bestPerforming = sortedByRate[0];
        const needsWork = sortedByRate.find(c => c.completionRate < 50 && c.activities > 0);

        const totalActivities = categoryData.reduce((sum, c) => sum + c.activities, 0);
        const avgPerCategory = categoryData.length > 0 ? Math.round(totalActivities / categoryData.length) : 0;

        return {
            data: categoryData,
            insights: {
                topCategory,
                bottomCategory,
                bestPerforming,
                needsWork,
                avgPerCategory,
                categoryCount: categoryData.length
            }
        };
    }, [activities]);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex items-center justify-center h-[400px] transition-colors">
                <p className="text-slate-400 dark:text-slate-500">Add activities to see your analytics</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-full transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Activities by Category</h3>

            {/* Chart */}
            <div className="h-[200px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value, name, props) => [
                                `${value} activities (${props.payload.completionRate}% completed)`,
                                props.payload.name
                            ]}
                        />
                        <ReferenceLine y={insights.avgPerCategory} stroke="#94a3b8" strokeDasharray="3 3" />
                        <Bar dataKey="activities" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Insights Section */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Insights</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {insights.topCategory && (
                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <FiTarget className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Most Active</p>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{insights.topCategory.name}</p>
                                <p className="text-[10px] text-slate-500">{insights.topCategory.activities} activities</p>
                            </div>
                        </div>
                    )}

                    {insights.bestPerforming && (
                        <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                            <FiTrendingUp className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Best Completion</p>
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{insights.bestPerforming.name}</p>
                                <p className="text-[10px] text-slate-500">{insights.bestPerforming.completionRate}% completion rate</p>
                            </div>
                        </div>
                    )}

                    {insights.needsWork && (
                        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg sm:col-span-2">
                            <FiAlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Needs Attention</p>
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    <span className="font-bold">{insights.needsWork.name}</span> has only {insights.needsWork.completionRate}% completion
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsChart;
