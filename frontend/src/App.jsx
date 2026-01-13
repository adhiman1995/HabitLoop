import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import { activityAPI } from './services/api';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

import Navbar from './components/Navbar';
import Settings from './components/Settings';
import TasksPage from './pages/TasksPage';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ActivityForm from './components/ActivityForm';
import ActivityDetails from './components/ActivityDetails';
import TaskFormModal from './components/TaskFormModal';

// New Components
import AppHeader from './components/AppHeader';
import DashboardView from './pages/DashboardView';
import ScheduleView from './pages/ScheduleView';

import {
  getStartOfWeek,
  getWeekDates,
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

  // Listen for Week Start Day changes from Settings
  useEffect(() => {
    const handleWeekStartChange = () => {
      // Re-calculate the start of the week relative to today based on the new setting
      setCurrentWeekStart(getStartOfWeek(new Date()));
    };

    window.addEventListener('settings:weekStartChanged', handleWeekStartChange);
    return () => {
      window.removeEventListener('settings:weekStartChanged', handleWeekStartChange);
    };
  }, []);

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

    // Find the new completed state
    const activityToUpdate = activities.find(a => a.id === id);
    const newCompletedState = !activityToUpdate?.completed;

    setActivities(currentActivities =>
      currentActivities.map(activity =>
        activity.id === id ? { ...activity, completed: newCompletedState } : activity
      )
    );

    // Also update viewingActivity if it's the one currently open
    if (viewingActivity && viewingActivity.id === id) {
      setViewingActivity(prev => ({ ...prev, completed: newCompletedState }));
    }

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
      // Revert viewingActivity if needed
      if (viewingActivity && viewingActivity.id === id) {
        setViewingActivity(prev => ({ ...prev, completed: !newCompletedState }));
      }
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

          {/* Refactored Header Component */}
          <AppHeader
            currentView={currentView}
            currentWeekStart={currentWeekStart}
            weekDates={weekDates}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
            onAddActivity={handleAddActivity}
          />

          {/* Dynamic Content Views */}
          {currentView === 'dashboard' ? (
            <DashboardView
              activities={activities}
              user={user}
            />
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
            <ScheduleView
              activities={filteredActivities}
              weekDates={weekDates}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onToggle={handleToggleComplete}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
              onCreate={handleCreateActivity}
              onView={setViewingActivity}
              isLoading={isLoadingWeek}
            />
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
            onToggle={handleToggleComplete}
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
