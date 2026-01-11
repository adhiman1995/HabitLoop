import React from 'react';
import Logo from './Logo';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-700">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-100/50 blur-3xl animate-pulse delay-700"></div>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center animate-fade-in-up">
                <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-ping-slow"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-xl shadow-blue-200 ring-1 ring-blue-100">
                        <Logo className="w-full h-full text-blue-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                    Habit<span className="text-blue-600">Loop</span>
                </h1>

                <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue-500 rounded-full w-1/2 animate-shimmer-slide"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
