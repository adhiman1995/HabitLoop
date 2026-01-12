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
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40 transition-all">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10">
                <div className="flex items-center justify-between h-20">

                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 rounded-lg p-1">
                            <Logo className="w-10 h-10" />
                        </div>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">
                            HabitLoop
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 h-10">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 shadow-inner ring-2 ring-white">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-bold text-slate-700 leading-tight">{user?.name || 'User'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-500 font-bold text-sm rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all group"
                            title="Sign Out"
                        >
                            <span className="hidden sm:inline">Log Out</span>
                            <FiLogOut className="text-lg group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>


                <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto pb-4 pt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex-1 min-w-[80px] px-2 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1.5
                                        ${isActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                    }`}
                            >
                                <Icon className={`text-xl ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
