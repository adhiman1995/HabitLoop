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
    { name: 'Work', color: 'bg-orange-500', textColor: 'text-white', neoColor: 'bg-orange-100 text-orange-800 border-none', softBg: 'bg-orange-50', borderClass: 'border-l-orange-500', pastelBg: 'bg-[#FFF8F0]', pastelBorder: 'border-orange-200', pastelText: 'text-orange-900', pastelIcon: 'text-orange-500', hoverBg: 'hover:bg-[#FFF0E0]' },
    { name: 'Personal', color: 'bg-violet-500', textColor: 'text-white', neoColor: 'bg-violet-100 text-violet-800 border-none', softBg: 'bg-violet-50', borderClass: 'border-l-violet-500', pastelBg: 'bg-[#F5F3FF]', pastelBorder: 'border-violet-200', pastelText: 'text-violet-900', pastelIcon: 'text-violet-500', hoverBg: 'hover:bg-[#EDE9FE]' },
    { name: 'Fitness', color: 'bg-emerald-500', textColor: 'text-white', neoColor: 'bg-emerald-100 text-emerald-800 border-none', softBg: 'bg-emerald-50', borderClass: 'border-l-emerald-500', pastelBg: 'bg-[#ECFDF5]', pastelBorder: 'border-emerald-200', pastelText: 'text-emerald-900', pastelIcon: 'text-emerald-600', hoverBg: 'hover:bg-[#D1FAE5]' },
    { name: 'Learning', color: 'bg-amber-500', textColor: 'text-white', neoColor: 'bg-amber-100 text-amber-800 border-none', softBg: 'bg-amber-50', borderClass: 'border-l-amber-500', pastelBg: 'bg-[#FFFBEB]', pastelBorder: 'border-amber-200', pastelText: 'text-amber-900', pastelIcon: 'text-amber-500', hoverBg: 'hover:bg-[#FEF3C7]' },
    { name: 'Social', color: 'bg-rose-500', textColor: 'text-white', neoColor: 'bg-rose-100 text-rose-800 border-none', softBg: 'bg-rose-50', borderClass: 'border-l-rose-500', pastelBg: 'bg-[#FFF1F2]', pastelBorder: 'border-rose-200', pastelText: 'text-rose-900', pastelIcon: 'text-rose-500', hoverBg: 'hover:bg-[#FFE4E6]' },
    { name: 'Health', color: 'bg-cyan-500', textColor: 'text-white', neoColor: 'bg-cyan-100 text-cyan-800 border-none', softBg: 'bg-cyan-50', borderClass: 'border-l-cyan-500', pastelBg: 'bg-[#ECFEFF]', pastelBorder: 'border-cyan-200', pastelText: 'text-cyan-900', pastelIcon: 'text-cyan-600', hoverBg: 'hover:bg-[#CFFAFE]' },
    { name: 'Other', color: 'bg-slate-500', textColor: 'text-white', neoColor: 'bg-slate-100 text-slate-700 border-none', softBg: 'bg-slate-50', borderClass: 'border-l-slate-500', pastelBg: 'bg-[#F8FAFC]', pastelBorder: 'border-slate-200', pastelText: 'text-slate-800', pastelIcon: 'text-slate-500', hoverBg: 'hover:bg-[#F1F5F9]' },
];

export const getCategoryStyle = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category || CATEGORIES[CATEGORIES.length - 1];
};

export const formatTime = (timeSlot) => {
    if (!timeSlot) return '';
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime, durationMinutes) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Format Start
    const startStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Add duration
    date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
    const endStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return `${startStr} - ${endStr}`;
};

export const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
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
