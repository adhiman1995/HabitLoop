import React from 'react';
import { FiHome, FiSettings, FiCalendar, FiLogOut, FiActivity } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = ({ currentView, onNavigate, user, onLogout }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome },
        { id: 'activities', label: 'My Schedule', icon: FiCalendar },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <nav className="bg-blue-600 shadow-md sticky top-0 z-40">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-lg shadow-sm">
                            <Logo className="w-11 h-11  " />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            HabitLoop
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`px-4 py-2 rounded-lg text-base font-bold transition-all flex items-center gap-2
                                        ${isActive
                                            ? 'bg-white/20 text-white shadow-sm'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className={isActive ? 'text-white' : 'text-blue-200'} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4  border-blue-500">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-base font-bold text-blue-600 shadow-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-base font-bold text-white leading-tight">{user?.name || 'User'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Sign Out"
                        >
                            <FiLogOut className="text-lg" />
                        </button>
                    </div>
                </div>


                <div className="md:hidden flex items-center justify-between py-2 border-t border-blue-500 overflow-x-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1
                                        ${isActive
                                        ? 'text-white bg-white/10'
                                        : 'text-blue-200 hover:bg-white/5'
                                    }`}
                            >
                                <Icon className={`text-lg ${isActive ? 'text-white' : 'text-blue-300'}`} />
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
