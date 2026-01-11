import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import FilterBar from './components/FilterBar';
import WeeklyCalendar from './components/WeeklyCalendar';
import ActivityForm from './components/ActivityForm';
import ActivityDetails from './components/ActivityDetails';
import { activityAPI } from './services/api';
import { FiAlertCircle, FiLoader, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

import Navbar from './components/Navbar';
import RecentActivityLog from './components/RecentActivityLog';
import Settings from './components/Settings';
import StatsOverview from './components/StatsOverview';
import CategoryBreakdown from './components/CategoryBreakdown';
import AnalyticsChart from './components/AnalyticsChart';
import Footer from './components/Footer';
import { getStartOfWeek, getWeekDates, formatDate } from './utils/helpers';

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [formInitialData, setFormInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date State for Navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

  // Derived state for the displayed week's dates
  const weekDates = getWeekDates(currentWeekStart);

  // View State logic
  const [currentView, setCurrentView] = useState('dashboard');

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter activities when category changes
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter(activity => activity.category === selectedCategory)
      );
    }
  }, [activities, selectedCategory]);

  const fetchActivities = async () => {
    try {
      setLoading(true); // Initial load only
      setError(null);
      const response = await activityAPI.getAll();
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Reload without full spinner
  const refreshActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data);
    } catch (err) {
      console.error("Silent refresh failed", err);
    }
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setFormInitialData(null);
    setShowForm(true);
  };

  const handleCreateActivity = (initialData) => {
    setEditingActivity(null);
    setFormInitialData(initialData);
    setShowForm(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setFormInitialData(null);
    setShowForm(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      // Check for conflicts (same day and time)
      const conflictingActivity = activities.find(a =>
        a.day_of_week === activityData.day_of_week &&
        a.time_slot === activityData.time_slot &&
        a.id !== (editingActivity ? editingActivity.id : null)
      );

      if (conflictingActivity) {
        const confirmReplace = window.confirm(
          `An activity "${conflictingActivity.title}" already exists at this time. Do you want to replace it?`
        );

        if (!confirmReplace) {
          return; // User cancelled
        }

        // Delete the conflicting activity first
        await activityAPI.delete(conflictingActivity.id);
      }

      if (editingActivity) {
        // Update existing activity
        await activityAPI.update(editingActivity.id, activityData);
      } else {
        // Create new activity
        await activityAPI.create(activityData);
      }

      await refreshActivities();
      setShowForm(false);
      setEditingActivity(null);
      setFormInitialData(null);
    } catch (err) {
      console.error('Error saving activity:', err);
      alert('Failed to save activity. Please try again.');
    }
  };

  const handleToggleComplete = async (id) => {
    // 1. Optimistic Update: Update UI immediately
    const previousActivities = [...activities];
    setActivities(currentActivities =>
      currentActivities.map(activity =>
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      )
    );

    try {
      // 2. Make API call
      await activityAPI.toggleComplete(id);
      // No need to refreshActivities() if successful, as local state is already correct
    } catch (err) {
      // 3. Revert on failure
      console.error('Error toggling activity:', err);
      setActivities(previousActivities);
      alert('Failed to update activity. Please try again.');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityAPI.delete(id);
      await refreshActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    setFormInitialData(null);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <FiLoader className="text-blue-600 text-6xl animate-spin mx-auto mb-4" />
          <p className="text-slate-700 text-xl font-medium">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <FiAlertCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-slate-800 text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchActivities}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'activities': return 'My Schedule';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  }

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Overview of your performance and statistics.';
      case 'activities': return 'Manage your weekly activity schedule.';
      case 'settings': return 'Manage your account and preferences.';
      default: return '';
    }
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-slate-50/50 flex flex-col">
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {getPageTitle()}
              </h1>
              <p className="text-slate-500 mt-1">
                {getPageSubtitle()}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Week Navigation - Only Show in Activities Tab */}
              {currentView === 'activities' && (
                <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                  <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <div className="px-4 flex items-center gap-2 font-medium text-slate-700 min-w-[180px] justify-center">
                    <FiCalendar />
                    <span>{formatDate(weekDates[0])} - {formatDate(weekDates[6])}</span>
                  </div>
                  <button onClick={handleNextWeek} className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
                    <FiChevronRight className="text-xl" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <button onClick={handleToday} className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    Today
                  </button>
                </div>
              )}

              {currentView === 'activities' && (
                <button
                  onClick={handleAddActivity}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all whitespace-nowrap"
                >
                  Add New Activity
                </button>
              )}
            </div>
          </div>

          {currentView === 'dashboard' ? (
            <div className="space-y-8">
              {/* Dashboard View: Analytics & Overview */}
              <StatsOverview activities={activities} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart activities={activities} />

                <CategoryBreakdown activities={activities} />
              </div>

              <RecentActivityLog activities={activities} />
            </div>
          ) : currentView === 'settings' ? (
            <Settings user={user} onRefresh={refreshActivities} />
          ) : (
            <div className="space-y-6">
              {/* Schedule View: Calendar & Filters */}
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <WeeklyCalendar
                activities={filteredActivities}
                weekDates={weekDates}
                onToggle={handleToggleComplete}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                onCreate={handleCreateActivity}
                onView={setViewingActivity}
              />
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* Forms & Modals */}
      {showForm && (
        <ActivityForm
          activity={editingActivity}
          initialData={formInitialData}
          onSave={handleSaveActivity}
          onCancel={handleCancelForm}
        />
      )}

      {viewingActivity && (
        <ActivityDetails
          activity={viewingActivity}
          onClose={() => setViewingActivity(null)}
        />
      )}
    </div>
  );
};

// Authentication Wrapper
const AppContent = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FiLoader className="text-blue-600 text-4xl animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (view === 'login') {
      return <Login onSwitchToRegister={() => setView('register')} />;
    } else {
      return <Register onSwitchToLogin={() => setView('login')} />;
    }
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
