export const getDaysOfWeek = () => {
    // Default to Monday start
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
    { name: 'Work', color: 'bg-[#5C6BC0]', textColor: 'text-white', neoColor: 'bg-indigo-100 text-indigo-800 border-none', softBg: 'bg-indigo-50', borderClass: 'border-l-indigo-500', pastelBg: 'bg-indigo-50 dark:bg-indigo-900/40', pastelBorder: 'border-indigo-200 dark:border-indigo-800', pastelText: 'text-indigo-700 dark:text-indigo-300', pastelIcon: 'text-indigo-500 dark:text-indigo-400', hoverBg: 'hover:bg-[#3F51B5]' },
    { name: 'Personal', color: 'bg-[#AB47BC]', textColor: 'text-white', neoColor: 'bg-purple-100 text-purple-800 border-none', softBg: 'bg-purple-50', borderClass: 'border-l-purple-500', pastelBg: 'bg-purple-50 dark:bg-purple-900/40', pastelBorder: 'border-purple-200 dark:border-purple-800', pastelText: 'text-purple-700 dark:text-purple-300', pastelIcon: 'text-purple-500 dark:text-purple-400', hoverBg: 'hover:bg-[#8E24AA]' },
    { name: 'Fitness', color: 'bg-[#26A69A]', textColor: 'text-white', neoColor: 'bg-teal-100 text-teal-800 border-none', softBg: 'bg-teal-50', borderClass: 'border-l-teal-500', pastelBg: 'bg-teal-50 dark:bg-teal-900/40', pastelBorder: 'border-teal-200 dark:border-teal-800', pastelText: 'text-teal-700 dark:text-teal-300', pastelIcon: 'text-teal-500 dark:text-teal-400', hoverBg: 'hover:bg-[#00897B]' },
    { name: 'Learning', color: 'bg-[#FF7043]', textColor: 'text-white', neoColor: 'bg-orange-100 text-orange-800 border-none', softBg: 'bg-orange-50', borderClass: 'border-l-orange-500', pastelBg: 'bg-orange-50 dark:bg-orange-900/40', pastelBorder: 'border-orange-200 dark:border-orange-800', pastelText: 'text-orange-800 dark:text-orange-300', pastelIcon: 'text-orange-500 dark:text-orange-400', hoverBg: 'hover:bg-[#F4511E]' },
    { name: 'Social', color: 'bg-[#EC407A]', textColor: 'text-white', neoColor: 'bg-pink-100 text-pink-800 border-none', softBg: 'bg-pink-50', borderClass: 'border-l-pink-500', pastelBg: 'bg-pink-50 dark:bg-pink-900/40', pastelBorder: 'border-pink-200 dark:border-pink-800', pastelText: 'text-pink-700 dark:text-pink-300', pastelIcon: 'text-pink-500 dark:text-pink-400', hoverBg: 'hover:bg-[#D81B60]' },
    { name: 'Health', color: 'bg-[#29B6F6]', textColor: 'text-white', neoColor: 'bg-sky-100 text-sky-800 border-none', softBg: 'bg-sky-50', borderClass: 'border-l-sky-500', pastelBg: 'bg-sky-50 dark:bg-sky-900/40', pastelBorder: 'border-sky-200 dark:border-sky-800', pastelText: 'text-sky-700 dark:text-sky-300', pastelIcon: 'text-sky-500 dark:text-sky-400', hoverBg: 'hover:bg-[#039BE5]' },
    { name: 'Other', color: 'bg-[#78909C]', textColor: 'text-white', neoColor: 'bg-slate-100 text-slate-700 border-none', softBg: 'bg-slate-50', borderClass: 'border-l-slate-400', pastelBg: 'bg-slate-50 dark:bg-slate-700/50', pastelBorder: 'border-slate-300 dark:border-slate-600', pastelText: 'text-slate-700 dark:text-slate-300', pastelIcon: 'text-slate-500 dark:text-slate-400', hoverBg: 'hover:bg-[#546E7A]' },
    { name: 'Creative', color: 'bg-[#8D6E63]', textColor: 'text-white', neoColor: 'bg-stone-100 text-stone-800 border-none', softBg: 'bg-stone-50', borderClass: 'border-l-stone-500', pastelBg: 'bg-stone-50 dark:bg-stone-900/40', pastelBorder: 'border-stone-200 dark:border-stone-800', pastelText: 'text-stone-700 dark:text-stone-300', pastelIcon: 'text-stone-500 dark:text-stone-400', hoverBg: 'hover:bg-[#6D4C41]' },
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

    // Monday start: adjust to find Monday
    // If Sunday (0), go back 6 days. Else go back (day - 1) days.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);

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
