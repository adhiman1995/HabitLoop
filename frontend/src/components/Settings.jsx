import React, { useState, useEffect } from 'react';
import { FiUser, FiDatabase, FiCheck, FiLoader, FiAlertTriangle, FiMoon, FiCalendar, FiClock, FiHome, FiDownload } from 'react-icons/fi';
import { generateDummyData } from '../utils/dummyGenerator';
import { activityAPI, taskAPI } from '../services/api';

const Settings = ({ user, onRefresh, isDarkMode, toggleTheme }) => {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [exporting, setExporting] = useState(false);

    // Settings State with localStorage persistence
    const [weekStartDay, setWeekStartDay] = useState(() => {
        return localStorage.getItem('weekStartDay') || 'Sunday';
    });

    const [timeFormat, setTimeFormat] = useState(() => {
        return localStorage.getItem('timeFormat') || '12h';
    });

    const [defaultView, setDefaultView] = useState(() => {
        return localStorage.getItem('defaultView') || 'dashboard';
    });

    // Persist settings to localStorage
    useEffect(() => {
        localStorage.setItem('weekStartDay', weekStartDay);
    }, [weekStartDay]);

    useEffect(() => {
        localStorage.setItem('timeFormat', timeFormat);
    }, [timeFormat]);

    useEffect(() => {
        localStorage.setItem('defaultView', defaultView);
    }, [defaultView]);

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

    const handleExportData = async () => {
        setExporting(true);
        try {
            const [activitiesRes, tasksRes] = await Promise.all([
                activityAPI.getAll(),
                taskAPI.getAll()
            ]);

            const exportData = {
                exportDate: new Date().toISOString(),
                user: { name: user?.name, email: user?.email },
                activities: activitiesRes.data,
                tasks: tasksRes.data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `habitloop-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">

            {/* Profile Section */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
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

            {/* Appearance Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <FiMoon className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Appearance</h2>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    {/* Dark Mode Toggle */}
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

                    {/* Time Format */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Time Format</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Choose 12-hour or 24-hour clock.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimeFormat('12h')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${timeFormat === '12h'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                12h
                            </button>
                            <button
                                onClick={() => setTimeFormat('24h')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${timeFormat === '24h'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                24h
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar & Display Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <FiCalendar className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Calendar & Display</h2>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    {/* Week Start Day */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Week Starts On</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">First day of the week in calendar.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setWeekStartDay('Sunday')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${weekStartDay === 'Sunday'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                Sun
                            </button>
                            <button
                                onClick={() => setWeekStartDay('Monday')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${weekStartDay === 'Monday'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                Mon
                            </button>
                        </div>
                    </div>

                    {/* Default View */}
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Default View</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Screen shown when app opens.</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'dashboard', label: 'Dashboard', icon: FiHome },
                                { value: 'activities', label: 'Schedule', icon: FiCalendar },
                                { value: 'tasks', label: 'Tasks', icon: FiCheck }
                            ].map((view) => (
                                <button
                                    key={view.value}
                                    onClick={() => setDefaultView(view.value)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${defaultView === view.value
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <view.icon size={14} />
                                    {view.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                        <FiDatabase className="text-orange-600 dark:text-orange-400 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Management</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Export or generate demo data</p>
                    </div>
                </div>
                <div className="p-6 grid gap-4 md:grid-cols-2">
                    {/* Export Data */}
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                    >
                        {exporting ? (
                            <FiLoader className="text-blue-600 dark:text-blue-400 text-xl animate-spin" />
                        ) : (
                            <FiDownload className="text-blue-600 dark:text-blue-400 text-xl group-hover:scale-110 transition-transform" />
                        )}
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 dark:text-white">Export Data</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Download all your data as JSON</p>
                        </div>
                    </button>

                    {/* Generate Demo Data */}
                    <button
                        onClick={handleGenerateData}
                        disabled={generating}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
                    >
                        {generating ? (
                            <>
                                <FiLoader className="text-orange-600 dark:text-orange-400 text-xl animate-spin" />
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800 dark:text-white">Generating... {progress}%</h3>
                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-1">
                                        <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiDatabase className="text-orange-600 dark:text-orange-400 text-xl group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800 dark:text-white">Generate Demo Data</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Add sample activities to test</p>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
