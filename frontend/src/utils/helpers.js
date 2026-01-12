// Dynamic DAYS_OF_WEEK based on user preference
export const getDaysOfWeek = () => {
    const weekStartDay = typeof window !== 'undefined' ? localStorage.getItem('weekStartDay') : 'Sunday';
    if (weekStartDay === 'Monday') {
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

// Keep static version for backward compatibility
export const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

export const CATEGORIES = [
    { name: 'Work', color: 'bg-blue-600', textColor: 'text-white', neoColor: 'bg-blue-100 text-blue-800 border-none', softBg: 'bg-blue-50', borderClass: 'border-l-blue-600', pastelBg: 'bg-blue-50 dark:bg-blue-900/40', pastelBorder: 'border-blue-200 dark:border-blue-800', pastelText: 'text-blue-700 dark:text-blue-300', pastelIcon: 'text-blue-600 dark:text-blue-400', hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/60' },
    { name: 'Personal', color: 'bg-purple-600', textColor: 'text-white', neoColor: 'bg-purple-100 text-purple-800 border-none', softBg: 'bg-purple-50', borderClass: 'border-l-purple-600', pastelBg: 'bg-purple-50 dark:bg-purple-900/40', pastelBorder: 'border-purple-200 dark:border-purple-800', pastelText: 'text-purple-700 dark:text-purple-300', pastelIcon: 'text-purple-600 dark:text-purple-400', hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/60' },
    { name: 'Fitness', color: 'bg-emerald-500', textColor: 'text-white', neoColor: 'bg-emerald-100 text-emerald-800 border-none', softBg: 'bg-emerald-50', borderClass: 'border-l-emerald-500', pastelBg: 'bg-emerald-50 dark:bg-emerald-900/40', pastelBorder: 'border-emerald-200 dark:border-emerald-800', pastelText: 'text-emerald-700 dark:text-emerald-300', pastelIcon: 'text-emerald-600 dark:text-emerald-400', hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/60' },
    { name: 'Learning', color: 'bg-amber-500', textColor: 'text-white', neoColor: 'bg-amber-100 text-amber-800 border-none', softBg: 'bg-amber-50', borderClass: 'border-l-amber-500', pastelBg: 'bg-amber-50 dark:bg-amber-900/40', pastelBorder: 'border-amber-200 dark:border-amber-800', pastelText: 'text-amber-800 dark:text-amber-300', pastelIcon: 'text-amber-600 dark:text-amber-400', hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/60' },
    { name: 'Social', color: 'bg-rose-500', textColor: 'text-white', neoColor: 'bg-rose-100 text-rose-800 border-none', softBg: 'bg-rose-50', borderClass: 'border-l-rose-500', pastelBg: 'bg-rose-50 dark:bg-rose-900/40', pastelBorder: 'border-rose-200 dark:border-rose-800', pastelText: 'text-rose-700 dark:text-rose-300', pastelIcon: 'text-rose-600 dark:text-rose-400', hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900/60' },
    { name: 'Health', color: 'bg-cyan-500', textColor: 'text-white', neoColor: 'bg-cyan-100 text-cyan-800 border-none', softBg: 'bg-cyan-50', borderClass: 'border-l-cyan-500', pastelBg: 'bg-cyan-50 dark:bg-cyan-900/40', pastelBorder: 'border-cyan-200 dark:border-cyan-800', pastelText: 'text-cyan-700 dark:text-cyan-300', pastelIcon: 'text-cyan-600 dark:text-cyan-400', hoverBg: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/60' },
    { name: 'Other', color: 'bg-slate-500', textColor: 'text-white', neoColor: 'bg-slate-100 text-slate-700 border-none', softBg: 'bg-slate-50', borderClass: 'border-l-slate-500', pastelBg: 'bg-slate-50 dark:bg-slate-700/50', pastelBorder: 'border-slate-300 dark:border-slate-600', pastelText: 'text-slate-700 dark:text-slate-300', pastelIcon: 'text-slate-500 dark:text-slate-400', hoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-700/70' },
    { name: 'Creative', color: 'bg-fuchsia-500', textColor: 'text-white', neoColor: 'bg-fuchsia-100 text-fuchsia-800 border-none', softBg: 'bg-fuchsia-50', borderClass: 'border-l-fuchsia-500', pastelBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/40', pastelBorder: 'border-fuchsia-200 dark:border-fuchsia-800', pastelText: 'text-fuchsia-700 dark:text-fuchsia-300', pastelIcon: 'text-fuchsia-600 dark:text-fuchsia-400', hoverBg: 'hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60' },
];

export const getCategoryStyle = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category || CATEGORIES[CATEGORIES.length - 1];
};

export const formatTime = (timeSlot) => {
    if (!timeSlot) return '';
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);

    // Check user's time format preference
    const timeFormat = typeof window !== 'undefined' ? localStorage.getItem('timeFormat') : '12h';

    if (timeFormat === '24h') {
        return `${hours}:${minutes}`;
    }

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime, durationMinutes) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Check user's time format preference
    const timeFormat = typeof window !== 'undefined' ? localStorage.getItem('timeFormat') : '12h';
    const formatOptions = timeFormat === '24h'
        ? { hour: '2-digit', minute: '2-digit', hour12: false }
        : { hour: 'numeric', minute: '2-digit' };

    // Format Start
    const startStr = date.toLocaleTimeString('en-US', formatOptions);

    // Add duration
    date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
    const endStr = date.toLocaleTimeString('en-US', formatOptions);

    return `${startStr} - ${endStr}`;
};

// Helper: Convert "HH:MM" to minutes since midnight
export const minutesFromTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper: Check if two activities overlap
export const doActivitiesOverlap = (newActivity, existingActivity) => {
    // 1. Check Day
    if (newActivity.day_of_week !== existingActivity.day_of_week) return false;

    // 2. Check Specific Date vs Recurring Logic
    // If one is recurring, it conflicts with EVERYTHING on that day (recurring or specific)
    // If both are specific, they only conflict if dates match
    if (!newActivity.is_recurring && !existingActivity.is_recurring) {
        // Both specific: check date match
        const date1 = newActivity.specific_date ? newActivity.specific_date.split('T')[0] : null;
        const date2 = existingActivity.specific_date ? existingActivity.specific_date.split('T')[0] : null;
        if (date1 !== date2) return false;
    }
    // If either is recurring, we assume conflict on day match (which we checked in step 1)

    // 3. Check Time Overlap
    const start1 = minutesFromTime(newActivity.time_slot);
    const end1 = start1 + Number(newActivity.duration);

    const start2 = minutesFromTime(existingActivity.time_slot);
    const end2 = start2 + Number(existingActivity.duration);

    return (start1 < end2) && (start2 < end1);
};

// Helper: Convert minutes back to "HH:MM"
export const minutesToTimeSlot = (minutes) => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Helper: Suggest the next available slot after a conflict
export const suggestNextAvailableSlot = (newActivity, allActivities) => {
    const conflict = allActivities.find(existing => {
        if (newActivity.id && existing.id === newActivity.id) return false;
        return doActivitiesOverlap(newActivity, existing);
    });

    if (!conflict) return null;

    // Proposed new start time = End time of the conflicting activity
    const conflictEndMinutes = minutesFromTime(conflict.time_slot) + Number(conflict.duration);
    const suggestedTimeSlot = minutesToTimeSlot(conflictEndMinutes);

    // Create a temporary activity object with the suggested time to check validity
    const potentialActivity = { ...newActivity, time_slot: suggestedTimeSlot };

    // Check if this new time is also blocked
    const isBlocked = allActivities.some(existing => {
        if (newActivity.id && existing.id === newActivity.id) return false;
        return doActivitiesOverlap(potentialActivity, existing);
    });

    if (!isBlocked) {
        return suggestedTimeSlot;
    }

    // Recursively try one more time? Or just giving up for now to keep it simple.
    // Let's try one more jump if the first suggestion is blocked (e.g. back-to-back meetings)
    // Actually, finding the *conflicting activity at the suggested time* and jumping past THAT is better.
    const secondaryConflict = allActivities.find(existing => {
        if (newActivity.id && existing.id === newActivity.id) return false;
        return doActivitiesOverlap(potentialActivity, existing);
    });

    if (secondaryConflict) {
        const secondaryEndMinutes = minutesFromTime(secondaryConflict.time_slot) + Number(secondaryConflict.duration);
        const secondarySuggestion = minutesToTimeSlot(secondaryEndMinutes);

        // Check final validity
        const finalCheck = allActivities.some(existing => {
            if (newActivity.id && existing.id === newActivity.id) return false;
            return doActivitiesOverlap({ ...newActivity, time_slot: secondarySuggestion }, existing);
        });

        if (!finalCheck) return secondarySuggestion;
    }

    return null; // Could not find simple adjacent slot
};

export const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Check user's week start preference
    const weekStartDay = typeof window !== 'undefined' ? localStorage.getItem('weekStartDay') : 'Sunday';

    let diff;
    if (weekStartDay === 'Monday') {
        // Monday start: adjust to find Monday
        diff = d.getDate() - day + (day === 0 ? -6 : 1);
    } else {
        // Sunday start: day is already the offset from Sunday
        diff = d.getDate() - day;
    }

    const startDay = new Date(d.setDate(diff));
    startDay.setHours(0, 0, 0, 0);
    return startDay;
};

export const getWeekDates = (startDate) => {
    const start = new Date(startDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
};

export const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};
