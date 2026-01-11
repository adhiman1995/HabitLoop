import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { CATEGORIES, DAYS_OF_WEEK } from '../utils/helpers';

const ActivityForm = ({ activity, initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Work',
        day_of_week: 'Monday',
        time_slot: '09:00',
        duration: 60,
        ...initialData
    });

    useEffect(() => {
        if (activity) {
            setFormData(activity);
        }
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const categories = CATEGORIES.map(c => c.name);

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">
                        {activity ? 'Edit Activity' : 'New Activity'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Activity Name
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full text-lg font-medium px-0 py-2 border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors bg-transparent placeholder-slate-300"
                                placeholder="What are you doing?"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Category Selection Pill Grid */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${formData.category === cat
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date & Time Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Day
                                </label>
                                <select
                                    name="day_of_week"
                                    value={formData.day_of_week}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100"
                                >
                                    {DAYS_OF_WEEK.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    name="time_slot"
                                    value={formData.time_slot}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Duration Slider/Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Duration ({formData.duration} min)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="15"
                                    max="180"
                                    step="15"
                                    value={formData.duration}
                                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-20 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-center font-medium focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all"
                                rows="2"
                                placeholder="Add optional notes..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <FiSave />
                                <span>{activity ? 'Save Changes' : 'Add to Schedule'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ActivityForm;
