import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiLoader, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { CATEGORIES, DAYS_OF_WEEK, doActivitiesOverlap, suggestNextAvailableSlot } from '../utils/helpers';

const ActivityForm = ({ activity, initialData, weekDates, activities, onSave, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [conflict, setConflict] = useState(null);
    const [suggestion, setSuggestion] = useState(null);

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

    // Real-time conflict detection
    useEffect(() => {
        if (!activities) return;

        const checkConflict = () => {
            const isRec = Array.isArray(formData.day_of_week);

            // Construct probe(s)
            // If recurring (array), we need to check EACH day.
            // If single, check provided day.
            const daysToCheck = isRec ? formData.day_of_week : [formData.day_of_week];

            for (const day of daysToCheck) {
                let specificDate = null;
                if (!isRec && weekDates) {
                    const dayIndex = DAYS_OF_WEEK.indexOf(day);
                    if (dayIndex !== -1) {
                        specificDate = weekDates[dayIndex].toISOString();
                    }
                }

                const probe = {
                    ...formData,
                    id: activity ? activity.id : null, // Exclude self
                    day_of_week: day,
                    is_recurring: isRec,
                    specific_date: specificDate
                };

                const conflictingAct = activities.find(existing => {
                    // Skip self
                    if (probe.id && existing.id === probe.id) return false;
                    return doActivitiesOverlap(probe, existing);
                });

                if (conflictingAct) {
                    setConflict({
                        title: conflictingAct.title,
                        time: conflictingAct.time_slot,
                        day: conflictingAct.day_of_week
                    });

                    // Generate Suggestion based on this conflict
                    const bestSlot = suggestNextAvailableSlot(probe, activities);
                    setSuggestion(bestSlot);
                    return; // Stop at first conflict
                }
            }

            // No conflict found
            setConflict(null);
            setSuggestion(null);
        };

        checkConflict();
    }, [formData, activities, weekDates, activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSave = { ...formData };

            // Logic for Specific Date vs Recurring
            // If it's a single day (string) and we have weekDates context
            if (!Array.isArray(dataToSave.day_of_week) && weekDates) {
                const dayIndex = DAYS_OF_WEEK.indexOf(dataToSave.day_of_week);
                if (dayIndex !== -1) {
                    const specificDate = weekDates[dayIndex];
                    // Format as YYYY-MM-DD to stay consistent or just send ISO string
                    dataToSave.specific_date = specificDate.toISOString();
                }
            }

            await onSave(dataToSave);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
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

                        {/* Conflict Warning */}
                        {conflict && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200">
                                <FiAlertTriangle className="text-amber-500 text-xl mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-amber-800">
                                        Time Conflict
                                    </h3>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Overlaps with <span className="font-semibold">"{conflict.title}"</span> on {conflict.day} at {conflict.time}.
                                    </p>

                                    {suggestion && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs text-amber-700 font-medium">Suggestion:</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, time_slot: suggestion }))}
                                                className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-sm"
                                            >
                                                Use {suggestion} <FiCheck />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Day / Frequency
                                    </label>
                                    <label className="flex items-center cursor-pointer gap-2">
                                        <span className="text-xs font-medium text-slate-500">Repeat</span>
                                        <div className="relative inline-block w-8 h-4 transition duration-200 ease-in-out bg-slate-200 rounded-full cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="absolute w-8 h-4 opacity-0 cursor-pointer"
                                                checked={Array.isArray(formData.day_of_week)}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        day_of_week: isChecked ? [prev.day_of_week] : prev.day_of_week[0] || 'Monday'
                                                    }));
                                                }}
                                            />
                                            <span
                                                className={`absolute left-0 inline-block w-4 h-4 bg-white border border-slate-300 rounded-full shadow transition-transform duration-200 ease-in-out ${Array.isArray(formData.day_of_week) ? 'translate-x-4 bg-blue-600 border-blue-600' : 'translate-x-0'}`}
                                            ></span>
                                        </div>
                                    </label>
                                </div>

                                {Array.isArray(formData.day_of_week) ? (
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS_OF_WEEK.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => {
                                                        const currentDays = prev.day_of_week;
                                                        if (currentDays.includes(day)) {
                                                            // Prevent removing the last day
                                                            if (currentDays.length === 1) return prev;
                                                            return { ...prev, day_of_week: currentDays.filter(d => d !== day) };
                                                        } else {
                                                            return { ...prev, day_of_week: [...currentDays, day] };
                                                        }
                                                    });
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${formData.day_of_week.includes(day)
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                                                    }`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
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
                                )}
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
                                disabled={isSubmitting || !!conflict}
                                className={`flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${(isSubmitting || conflict) ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                                <span>{isSubmitting ? 'Saving...' : (activity ? 'Save Changes' : 'Add to Schedule')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ActivityForm;
