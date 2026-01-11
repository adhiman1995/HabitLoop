import React, { useState } from 'react';
import { FiUser, FiDatabase, FiCheck, FiLoader, FiAlertTriangle, FiMoon } from 'react-icons/fi';
import { generateDummyData } from '../utils/dummyGenerator';

const Settings = ({ user, onRefresh }) => {
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Profile Section - Full Width */}
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                        <FiUser className="text-primary-600 text-xl" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
                        <p className="text-slate-500 text-sm">Your account information</p>
                    </div>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            disabled
                            value={user?.name || ''}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            disabled
                            value={user?.email || ''}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Developer Tools */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <FiDatabase className="text-amber-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Developer Tools</h2>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="font-semibold text-slate-800 mb-2">Generate Demo Data</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Populate your schedule with realistic sample activities.
                    </p>
                    <button
                        onClick={handleGenerateData}
                        disabled={generating}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${generating
                            ? 'bg-slate-100 text-slate-400 cursor-wait'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20'
                            }`}
                    >
                        {generating ? (
                            <>
                                <FiLoader className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Populate Data'
                        )}
                    </button>
                </div>
            </div>

            {/* Appearance (Coming Soon) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-70 h-full relative">
                <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase">Coming Soon</div>
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <FiMoon className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Appearance</h2>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="font-semibold text-slate-800 mb-2">Dark Mode</h3>
                    <p className="text-sm text-slate-500 mb-4">Switch between light and dark themes.</p>
                    <div className="w-11 h-6 bg-slate-200 rounded-full cursor-not-allowed relative opacity-50">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
