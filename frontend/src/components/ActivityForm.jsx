import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSave, FiLoader, FiAlertTriangle, FiCheck, FiType, FiFolder, FiCalendar, FiClock, FiAlignLeft, FiActivity } from 'react-icons/fi';
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


    useEffect(() => {
        if (!activities) return;

        const checkConflict = () => {
            const isRec = Array.isArray(formData.day_of_week);

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
                    id: activity ? activity.id : null,
                    day_of_week: day,
                    is_recurring: isRec,
                    specific_date: specificDate
                };

                const conflictingAct = activities.find(existing => {

                    if (probe.id && existing.id === probe.id) return false;
                    return doActivitiesOverlap(probe, existing);
                });

                if (conflictingAct) {
                    setConflict({
                        title: conflictingAct.title,
                        time: conflictingAct.time_slot,
                        day: conflictingAct.day_of_week
                    });


                    const bestSlot = suggestNextAvailableSlot(probe, activities);
                    setSuggestion(bestSlot);
                    return;
                }
            }


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


            if (!Array.isArray(dataToSave.day_of_week) && weekDates) {
                const dayIndex = DAYS_OF_WEEK.indexOf(dataToSave.day_of_week);
                if (dayIndex !== -1) {
                    const specificDate = weekDates[dayIndex];
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

    return createPortal(
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 animate-slideUp relative overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            {activity ? 'Edit Activity' : 'New Activity'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {activity ? 'Update activity details below' : 'Schedule a new activity'}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-3 hover:bg-slate-100 rounded-lg transition-colors group"
                    >
                        <FiX className="text-xl text-slate-400 group-hover:text-slate-700 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    {/* Conflict Warning */}
                    {conflict && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4 animate-fadeIn">
                            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                                <FiAlertTriangle className="text-amber-600 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-amber-900">
                                    Time Conflict Detected
                                </h3>
                                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                    This overlaps with <span className="font-semibold">"{conflict.title}"</span> on {conflict.day} at {conflict.time}.
                                </p>

                                {suggestion && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-xs text-amber-800 font-medium uppercase tracking-wide">Suggested Slot:</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, time_slot: suggestion }))}
                                            className="px-4 py-2 bg-white border-2 border-amber-200 rounded-lg text-sm font-bold text-amber-800 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            Use {suggestion} <FiCheck className="text-lg" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Activity Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FiType /> Activity Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium placeholder:text-slate-400"
                            placeholder="What are you doing?"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FiFolder /> Category
                        </label>
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border-2 border-slate-100 rounded-lg">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.category === cat
                                        ? 'bg-white text-blue-600 shadow-md scale-100 ring-2 ring-blue-100'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FiCalendar /> Day / Frequency
                                </label>
                                <label className="flex items-center cursor-pointer gap-2 group">
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Repeat</span>
                                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-slate-200 rounded-full cursor-pointer group-hover:bg-slate-300">
                                        <input
                                            type="checkbox"
                                            className="absolute w-full h-full opacity-0 cursor-pointer"
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
                                            className={`absolute left-1 top-1 inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${Array.isArray(formData.day_of_week) ? 'translate-x-4 bg-blue-600' : 'translate-x-0'}`}
                                        ></span>
                                    </div>
                                </label>
                            </div>

                            {Array.isArray(formData.day_of_week) ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => {
                                                    const currentDays = prev.day_of_week;
                                                    if (currentDays.includes(day)) {
                                                        if (currentDays.length === 1) return prev;
                                                        return { ...prev, day_of_week: currentDays.filter(d => d !== day) };
                                                    } else {
                                                        return { ...prev, day_of_week: [...currentDays, day] };
                                                    }
                                                });
                                            }}
                                            className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border-2 ${formData.day_of_week.includes(day)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        name="day_of_week"
                                        value={formData.day_of_week}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-lg appearance-none focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                                    >
                                        {DAYS_OF_WEEK.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FiClock /> Start Time
                                </label>
                                <input
                                    type="time"
                                    name="time_slot"
                                    value={formData.time_slot}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 justify-between">
                                    <span>Duration</span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">{formData.duration} min</span>
                                </label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border-2 border-slate-100">
                                    <input
                                        type="range"
                                        min="15"
                                        max="180"
                                        step="15"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FiAlignLeft /> Notes
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-600"
                            rows="2"
                            placeholder="Add locations, notes, or details..."
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-4 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm uppercase tracking-wide"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!conflict}
                            className={`flex-[2] px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? <FiLoader className="animate-spin text-lg" /> : <FiSave className="text-lg" />}
                            <span>{isSubmitting ? 'Saving...' : (activity ? 'Save Changes' : 'Schedule Activity')}</span>
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ActivityForm;
