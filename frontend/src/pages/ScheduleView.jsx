import React from 'react';
import FilterBar from '../components/FilterBar';
import WeeklyCalendar from '../components/WeeklyCalendar';

const ScheduleView = ({
    activities,
    weekDates,
    selectedCategory,
    onCategoryChange,
    onToggle,
    onEdit,
    onDelete,
    onCreate,
    onView,
    isLoading
}) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Schedule View: Calendar & Filters */}
            <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
            />
            <WeeklyCalendar
                activities={activities}
                weekDates={weekDates}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreate={onCreate}
                onView={onView}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ScheduleView;
