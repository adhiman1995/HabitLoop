import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const StreakWidget = ({ streak = 0 }) => {
    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
            <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Flame Icon SVG - Custom matching the image style */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-orange-400 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FFF7ED" />
                        <path d="M12 18.5C14.7614 18.5 17 16.2614 17 13.5C17 10.7386 14.7614 8.5 12 8.5C9.23858 8.5 7 10.7386 7 13.5C7 16.2614 9.23858 18.5 12 18.5Z" fill="#F97316" fillOpacity="0.2" />
                        <path d="M12 2C10.5 4.5 7 8 7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 9 14 5 12 2ZM12 16C10.3431 16 9 14.6569 9 13C9 12 10 10 12 8C14 10 15 12 15 13C15 14.6569 13.6569 16 12 16Z" fill="#F97316" />
                        <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" fill="#FFF7ED" />
                    </svg>
                </div>
                <div className="text-left">
                    <p className="text-slate-400 text-sm font-medium mb-1">Streak progress</p>
                    <h2 className="text-4xl font-extrabold text-orange-400 leading-none">
                        {streak} <span className="text-3xl font-bold text-orange-300">day streak</span>
                    </h2>
                </div>
            </div>

            <p className="text-slate-500 font-medium">
                Do any habit each day to grow your streak.
            </p>
        </div>
    );
};

export default StreakWidget;
