import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import FilterBar from './components/FilterBar';
import WeeklyCalendar from './components/WeeklyCalendar';
import ActivityForm from './components/ActivityForm';
import ActivityDetails from './components/ActivityDetails';
import TaskFormModal from './components/TaskFormModal';
import { activityAPI } from './services/api';
import { FiAlertCircle, FiLoader, FiChevronLeft, FiChevronRight, FiCalendar, FiList, FiCheckSquare, FiPlus } from 'react-icons/fi';

import Navbar from './components/Navbar';
import RecentActivityLog from './components/RecentActivityLog';
import Settings from './components/Settings';
import StatsOverview from './components/StatsOverview';
// import StreakRewardWidget from './components/StreakRewardWidget'; // Removed
import StreakWidget from './components/StreakWidget';
import HeatmapWidget from './components/HeatmapWidget';
import TasksPage from './pages/TasksPage';
import CategoryBreakdown from './components/CategoryBreakdown';
import AnalyticsChart from './components/AnalyticsChart';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import {
  DAYS_OF_WEEK,
  getStartOfWeek,
  getWeekDates,
  getCategoryStyle,
  formatDate,
  formatTimeRange,
  doActivitiesOverlap
} from './utils/helpers';

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [preselectedActivityId, setPreselectedActivityId] = useState(null);
  const [formInitialData, setFormInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Date State for Navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [isLoadingWeek, setIsLoadingWeek] = useState(false);

  // Derived state for the displayed week's dates
  const weekDates = getWeekDates(currentWeekStart);

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

  const refreshActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data);
    } catch (err) {
      console.error("Silent refresh failed", err);
    }
  };

  // View State logic
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('defaultView') || 'dashboard';
  });

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Manage Splash Screen Timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Show splash for at least 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, []);



  // ... (existing helper functions)

  const changeWeek = (offset) => {
    setIsLoadingWeek(true);
    setTimeout(() => {
      const newDate = new Date(currentWeekStart);
      if (offset === 0) {
        // Reset to today
        setCurrentWeekStart(getStartOfWeek(new Date()));
      } else {
        newDate.setDate(newDate.getDate() + offset);
        setCurrentWeekStart(newDate);
      }
      setIsLoadingWeek(false);
    }, 500); // 500ms delay to simulate loading
  };

  const handlePrevWeek = () => changeWeek(-7);
  const handleNextWeek = () => changeWeek(7);
  const handleToday = () => changeWeek(0);

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
      /* Conflict Check Moved to ActivityForm */

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
      // Refresh user stats (streak/points)
      await refreshUser();
      // No need to refreshActivities() if successful, as local state is already correct
    } catch (err) {
      // 3. Revert on failure
      console.error('Error toggling activity:', err);
      setActivities(previousActivities);
      alert('Failed to update activity. Please try again.');
    }
  };

  const handleDeleteActivity = async (id) => {
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

  const handleCreateTaskFromActivity = () => {
    if (viewingActivity) {
      setPreselectedActivityId(viewingActivity.id);
      setViewingActivity(null);
      setShowTaskModal(true);
    }
  };



  if (showSplash) {
    return <SplashScreen />;
  }

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
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 max-w-md text-center">
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
      case 'tasks': return 'Task Management';
      case 'activities': return 'My Schedule';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  }

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Overview of your performance and statistics.';
      case 'tasks': return 'Track specific tasks linked to your activities.';
      case 'activities': return 'Manage your weekly activity schedule.';
      case 'settings': return 'Manage your account and preferences.';
      default: return '';
    }
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden transition-colors duration-300">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-slate-900 flex flex-col">
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-md text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                {getPageSubtitle()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {/* Week Navigation - Only Show in Activities Tab */}
              {currentView === 'activities' && (
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 shadow-sm transition-colors">
                  <button
                    onClick={handlePrevWeek}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
                    title="Previous Week"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <div className="px-6 flex items-center gap-3 font-bold text-slate-700 dark:text-white min-w-[200px] justify-center text-sm uppercase tracking-wide">
                    <FiCalendar className="text-blue-500 dark:text-blue-400 text-lg" />
                    <span>{formatDate(weekDates[0])} - {formatDate(weekDates[6])}</span>
                  </div>
                  <button
                    onClick={handleNextWeek}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
                    title="Next Week"
                  >
                    <FiChevronRight className="text-xl" />
                  </button>

                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 mx-2"></div>

                  <button
                    onClick={handleToday}
                    className="px-4 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95"
                  >
                    Today
                  </button>
                </div>
              )}

              {currentView === 'activities' && (
                <button
                  onClick={handleAddActivity}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group whitespace-nowrap"
                >
                  <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
                  <span>New Activity</span>
                </button>
              )}
            </div>
          </div>

          {currentView === 'dashboard' ? (
            <div className="space-y-8">
              {/* Dashboard View: Analytics & Overview */}

              <StatsOverview activities={activities} />

              {/* Side-by-Side Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StreakWidget streak={user?.streak} />
                <HeatmapWidget />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart activities={activities} />

                <CategoryBreakdown activities={activities} />
              </div>

              <RecentActivityLog activities={activities} />
            </div>
          ) : currentView === 'tasks' ? (
            <TasksPage />
          ) : currentView === 'settings' ? (
            <Settings
              user={user}
              onRefresh={refreshActivities}
              isDarkMode={darkMode}
              toggleTheme={toggleDarkMode}
            />
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
                isLoading={isLoadingWeek}
              />
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* Forms & Modals */}
      {
        showForm && (
          <ActivityForm
            activity={editingActivity}
            initialData={formInitialData}
            weekDates={weekDates}
            activities={activities}
            onSave={handleSaveActivity}
            onCancel={handleCancelForm}
          />
        )
      }

      {
        viewingActivity && (
          <ActivityDetails
            activity={viewingActivity}
            onClose={() => setViewingActivity(null)}
            onEdit={() => {
              setViewingActivity(null);
              handleEditActivity(viewingActivity);
            }}
            onDelete={() => {
              setViewingActivity(null);
              handleDeleteActivity(viewingActivity.id);
            }}
            onCreateTask={handleCreateTaskFromActivity}
          />
        )
      }

      {
        showTaskModal && (
          <TaskFormModal
            isOpen={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            activities={activities}
            initialActivityId={preselectedActivityId}
            onTaskSaved={() => {
              setShowTaskModal(false);
              // Optimistic or real refresh if needed, but tasks are on another page
            }}
          />
        )
      }
    </div >
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
