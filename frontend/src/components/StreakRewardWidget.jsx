import React from 'react';
import { FiTrendingUp, FiAward, FiZap } from 'react-icons/fi';

const StreakRewardWidget = ({ user }) => {
    if (!user) return null;

    const streak = user.streak || 0;
    const points = user.points || 0;

    const getMotivation = (streak) => {
        if (streak >= 30) return "Unstoppable! 🔥";
        if (streak >= 7) return "On fire! Week strong! 🚀";
        if (streak >= 3) return "Great momentum! Keep it up! ⭐";
        if (streak > 0) return "Off to a great start! 🌱";
        return "Start your streak today! 💡";
    };

    return (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center p-3 bg-white/20 backdrop-blur-sm rounded-lg min-w-[80px]">
                        <FiZap className="text-yellow-300 text-2xl mb-1" />
                        <span className="text-2xl font-black">{streak}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Day Streak</span>
                    </div>

                    <div className="h-10 w-px bg-white/20"></div>

                    <div className="flex flex-col items-center p-3 bg-white/20 backdrop-blur-sm rounded-lg min-w-[80px]">
                        <FiAward className="text-yellow-300 text-2xl mb-1" />
                        <span className="text-2xl font-black">{points}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Points</span>
                    </div>
                </div>

                <div className="text-right hidden sm:block">
                    <h3 className="text-lg font-bold mb-1">Your Progress</h3>
                    <p className="text-sm font-medium text-indigo-100 flex items-center gap-2 justify-end">
                        {getMotivation(streak)} <FiTrendingUp />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StreakRewardWidget;
