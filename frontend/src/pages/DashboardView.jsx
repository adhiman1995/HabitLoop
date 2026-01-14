import React from 'react';
import StreakWidget from '../components/StreakWidget';
import DailyProgressWidget from '../components/DailyProgressWidget';
import TaskProgressWidget from '../components/TaskProgressWidget';
import WeekComparisonWidget from '../components/WeekComparisonWidget';
import ConsistencyScoreWidget from '../components/ConsistencyScoreWidget';
import DayPerformanceWidget from '../components/DayPerformanceWidget';
import HeatmapWidget from '../components/HeatmapWidget';
import AnalyticsChart from '../components/AnalyticsChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RecentActivityLog from '../components/RecentActivityLog';
import RecentTasksWidget from '../components/RecentTasksWidget';

const DashboardView = ({ activities, user }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Insight Widgets Row - Behavior & Discipline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WeekComparisonWidget activities={activities} />
                <ConsistencyScoreWidget activities={activities} />
                <DayPerformanceWidget activities={activities} />
            </div>

            {/* Progress Widgets Row - Activity & Task */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyProgressWidget activities={activities} />
                <TaskProgressWidget />
            </div>

            {/* Streak & Heatmap Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StreakWidget streak={user?.streak} />
                <HeatmapWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart activities={activities} />
                <CategoryBreakdown activities={activities} />
            </div>

            {/* Recent Completions Row - Activities & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivityLog activities={activities} />
                <RecentTasksWidget />
            </div>
        </div>
    );
};

export default DashboardView;


