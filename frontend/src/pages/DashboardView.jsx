import React from 'react';
import StatsOverview from '../components/StatsOverview';
import StreakWidget from '../components/StreakWidget';
import HeatmapWidget from '../components/HeatmapWidget';
import AnalyticsChart from '../components/AnalyticsChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RecentActivityLog from '../components/RecentActivityLog';

const DashboardView = ({ activities, user }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Dashboard View: Analytics & Overview */}
            <StatsOverview activities={activities} />

            {/* Side-by-Side Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StreakWidget streak={user?.streak} />
                <HeatmapWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart activities={activities} />
                <CategoryBreakdown activities={activities} />
            </div>

            <RecentActivityLog activities={activities} />
        </div>
    );
};

export default DashboardView;
