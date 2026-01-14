import React, { useMemo } from 'react';

const ConsistencyScoreWidget = ({ activities }) => {
    const score = useMemo(() => {
        if (activities.length === 0) return { value: 0, grade: 'N/A', message: 'Start tracking activities!' };

        // Factor 1: Overall completion rate (40% weight)
        const completed = activities.filter(a => a.completed).length;
        const completionRate = activities.length > 0 ? completed / activities.length : 0;

        // Factor 2: Recent activity (last 7 days) completion rate (40% weight)
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const recentActivities = activities.filter(a => {
            if (a.specific_date) {
                const actDate = new Date(a.specific_date);
                return actDate >= weekAgo && actDate <= today;
            }
            return a.is_recurring; // Recurring activities count as recent
        });

        const recentCompleted = recentActivities.filter(a => a.completed).length;
        const recentRate = recentActivities.length > 0 ? recentCompleted / recentActivities.length : 0;

        // Factor 3: Activity diversity - using multiple categories (20% weight)
        const categories = new Set(activities.map(a => a.category));
        const diversityScore = Math.min(categories.size / 4, 1); // Max at 4 categories

        // Calculate weighted score
        const rawScore = (completionRate * 0.4) + (recentRate * 0.4) + (diversityScore * 0.2);
        const finalScore = Math.round(rawScore * 100);

        // Determine grade and message
        let grade, message;
        if (finalScore >= 90) {
            grade = 'S';
            message = 'Exceptional discipline! 🏆';
        } else if (finalScore >= 80) {
            grade = 'A';
            message = 'Excellent consistency! 🌟';
        } else if (finalScore >= 70) {
            grade = 'B';
            message = 'Good progress! Keep it up! 💪';
        } else if (finalScore >= 50) {
            grade = 'C';
            message = 'Room for improvement 📈';
        } else {
            grade = 'D';
            message = 'Let\'s build better habits! 🌱';
        }

        return { value: finalScore, grade, message };
    }, [activities]);

    // SVG gauge parameters
    const size = 140;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Half circle
    const offset = circumference - (score.value / 100) * circumference;

    const getGaugeColor = () => {
        if (score.value >= 80) return '#10b981'; // emerald
        if (score.value >= 60) return '#f59e0b'; // amber
        return '#ef4444'; // rose
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-colors flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 self-start">Consistency Score</h3>

            {/* Gauge */}
            <div className="relative mb-4">
                <svg width={size} height={size / 2 + 20} className="overflow-visible">
                    {/* Background arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-100 dark:text-slate-700"
                        strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <path
                        d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                        fill="none"
                        stroke={getGaugeColor()}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Score in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">{score.value}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">/ 100</span>
                </div>
            </div>

            {/* Grade Badge */}
            <div className={`px-4 py-1 rounded-full text-sm font-bold mb-2 ${score.grade === 'S' || score.grade === 'A'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : score.grade === 'B' || score.grade === 'C'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                Grade: {score.grade}
            </div>

            {/* Message */}
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{score.message}</p>
        </div>
    );
};

export default ConsistencyScoreWidget;
