import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORIES } from '../utils/helpers';

const AnalyticsChart = ({ activities }) => {
    const data = CATEGORIES.map(cat => {
        const count = activities.filter(a => a.category === cat.name).length;

        let fill = '#94a3b8'; // default slate-400
        if (cat.name === 'Work') fill = '#3b82f6'; // blue-500
        if (cat.name === 'Personal') fill = '#0ea5e9'; // sky-500
        if (cat.name === 'Fitness') fill = '#22c55e'; // green-500
        if (cat.name === 'Learning') fill = '#f59e0b'; // amber-500
        if (cat.name === 'Social') fill = '#ec4899'; // pink-500
        if (cat.name === 'Health') fill = '#ef4444'; // red-500

        return {
            name: cat.name,
            activities: count,
            fill: fill
        };
    }).filter(item => item.activities > 0);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex items-center justify-center h-[300px] transition-colors">
                <p className="text-slate-400 dark:text-slate-500">Add activities to see your analytics</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 h-full transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Activities by Category</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="activities" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;
