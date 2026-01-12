import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';

const HeatmapWidget = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await activityAPI.getHeatmap();
                const statsMap = {};
                response.data.forEach(item => {
                    statsMap[item.date] = item.count;
                });
                setStats(statsMap);
            } catch (err) {
                console.error("Failed to load heatmap", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const monthsToShow = 4;
    const monthsData = [];
    const today = new Date();
    for (let i = monthsToShow - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const monthName = d.toLocaleString('default', { month: 'short' });


        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startDay = new Date(year, month, 1).getDay();

        startDay = startDay === 0 ? 6 : startDay - 1;

        const days = [];

        for (let p = 0; p < startDay; p++) {
            days.push({ id: `pad-${year}-${month}-${p}`, empty: true });
        }


        for (let day = 1; day <= daysInMonth; day++) {

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = stats[dateStr] || 0;


            let color = 'bg-slate-100 dark:bg-slate-700';
            if (count === 1) color = 'bg-blue-300';
            else if (count === 2) color = 'bg-blue-400';
            else if (count >= 3) color = 'bg-blue-600';

            days.push({
                id: dateStr,
                date: dateStr,
                day,
                count,
                color,
                empty: false
            });
        }

        monthsData.push({
            name: monthName,
            year,
            days
        });
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[240px] flex flex-col justify-center overflow-hidden transition-colors">
            <div className="flex flex-wrap md:flex-nowrap gap-8 justify-center items-start">
                {monthsData.map((month) => (
                    <div key={`${month.name}-${month.year}`} className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
                            {month.name}
                        </span>

                        {/* 7 Columns Grid (Mon-Sun) */}
                        <div className="grid grid-cols-7 gap-1.5">
                            {month.days.map((day) => (
                                day.empty ? (
                                    <div key={day.id} className="w-3 h-3 md:w-3.5 md:h-3.5"></div>
                                ) : (
                                    <div
                                        key={day.id}
                                        className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm transition-all duration-300 ${day.color} hover:scale-125 hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800 cursor-pointer`}
                                        title={`${day.date}: ${day.count} activities`}
                                    ></div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default HeatmapWidget;
