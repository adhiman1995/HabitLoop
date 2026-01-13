import React from 'react';
import { FiHome, FiSettings, FiCalendar, FiLogOut, FiActivity, FiList } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = ({ currentView, onNavigate, user, onLogout }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome },
        { id: 'activities', label: 'My Schedule', icon: FiCalendar },
        { id: 'tasks', label: 'Tasks', icon: FiList },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl px-6 py-2 ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-5rem)] max-w-[calc(1600px-2rem)] md:max-w-[calc(1600px-4rem)] lg:max-w-[calc(1600px-5rem)]">

                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 shadow-sm border border-slate-200 dark:border-slate-700">
                        <Logo className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white tracking-tight text-xl hidden lg:block">
                        HabitLoop
                    </span>
                </div>

                {/* Centered Navigation Pills */}
                <div className="flex items-center p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2.5 z-10
                                    ${isActive
                                        ? 'text-white shadow-md scale-100'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-blue-600 rounded-lg -z-10 animate-fadeIn transition-all"></div>
                                )}
                                <Icon className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                                <span className={isActive ? '' : ''}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Profile & Logout */}
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden xl:block">
                            {user?.name || 'User'}
                        </span>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-900 rounded-lg transition-all font-medium text-xs"
                        title="Log Out"
                    >
                        <span>Log Out</span>
                        <FiLogOut size={16} />
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Bar (unchanged but cleaned up) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] z-50">
                <div className="flex items-center justify-around p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative overflow-hidden
                                        ${isActive
                                        ? 'text-blue-600'
                                        : 'text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {isActive && <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-50 rounded-xl"></div>}
                                <Icon className={`text-2xl transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`} />
                                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={onLogout}
                        className="flex flex-col items-center gap-1 p-2 text-slate-300 dark:text-slate-600"
                    >
                        <FiLogOut className="text-xl" />
                    </button>
                </div>
            </nav>

            {/* Spacer to prevent content overlap on desktop since navbar is fixed */}
            <div className="hidden md:block h-24"></div>
        </>
    );
};

export default Navbar;
