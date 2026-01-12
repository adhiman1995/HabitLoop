import React, { useState } from 'react';
import { FiUser, FiDatabase, FiCheck, FiLoader, FiAlertTriangle, FiMoon } from 'react-icons/fi';
import { generateDummyData } from '../utils/dummyGenerator';

const Settings = ({ user, onRefresh, isDarkMode, toggleTheme }) => {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleGenerateData = async () => {
        if (!window.confirm('This will add random activities to your schedule. Continue?')) return;

        setGenerating(true);
        try {
            await generateDummyData((percent) => setProgress(percent));
            await onRefresh();
            alert('Demo data successfully generated!');
        } catch (error) {
            console.error(error);
            alert('Failed to generate data.');
        } finally {
            setGenerating(false);
            setProgress(0);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">

            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <FiUser className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">My Profile</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Your account information</p>
                    </div>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            disabled
                            value={user?.name || ''}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            disabled
                            value={user?.email || ''}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <FiMoon className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Appearance (Experimental)</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Dark Mode</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes.</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-14 h-7 rounded-full transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isDarkMode ? 'bg-purple-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
