# Component Architecture Overview

## Pages & Views
- **`App.jsx`**: The main container. It manages global state (user, activity data, theme), handles routing between views (Dashboard, Schedule, Tasks, Settings), and integrates the main layout components.
- **`DashboardView.jsx`**: The command center. Displays high-level analytics, streak widgets, heatmap, and recent activity logs.
- **`ScheduleView.jsx`**: The "My Schedule" page. Contains the `WeeklyCalendar` and `FilterBar` for managing your weekly schedule.
- **`TasksPage.jsx`**: A dedicated workspace for managing granular tasks linked to your activities.
- **`Login.jsx` / `Register.jsx`**: The authentication screens for user access.

## Core Components
- **`AppHeader.jsx`**: The top section of the main content area. Displays the page title, subtitle, and the **Week Navigator** controls (Previous/Next week, Today, New Activity).
- **`Navbar.jsx`**: The floating navigation bar at the top (desktop) or bottom (mobile) for switching between application views.
- **`WeeklyCalendar.jsx`**: The heart of the schedule view. It renders the 7-day grid and manages the placement of `ActivityCard` components.
- **`ActivityCard.jsx`**: The individual block representing an activity on the calendar. Handles interactions like clicking to view details.

## Forms & Modals
- **`ActivityForm.jsx`**: The modal used to create or edit activities (set time, day, recurrence, category, etc.).
- **`ActivityDetails.jsx`**: A read-only popup that shows full details when you click an activity. Allows you to complete, edit, or delete it.
- **`TaskFormModal.jsx`**: A popup for creating specific tasks (e.g., "Read Chapter 1") linked to a broader activity (e.g., "Reading").

## Widgets & Analytics
- **`StatsOverview.jsx`**: The row of summary cards at the top of the dashboard (e.g., "Total Activities", "Completion Rate").
- **`StreakWidget.jsx`**: Displays your current streak flame and motivational text.
- **`HeatmapWidget.jsx`**: A GitHub-style visual grid showing your activity density over time.
- **`AnalyticsChart.jsx`**: Graphs visualizing your progress (e.g., Activity vs Completed).
- **`CategoryBreakdown.jsx`**: A chart showing how you spend your time across different categories (Work, Health, Learning, etc.).
- **`RecentActivityLog.jsx`**: A scrolling list of your latest completed actions.

## Utilities & Layout
- **`FilterBar.jsx`**: The scrollable list of category "pills" used to filter the schedule view.
- **`Settings.jsx`**: The user preferences screen (Dark Mode toggle, Data Management).
- **`Logo.jsx`**: The SVG component for your application's logo (Dual-tone Infinity symbol).
- **`SplashScreen.jsx`**: The initial "HabitLoop" animation seen on load.
- **`Footer.jsx`**: Simple footer information.
- **`api.js`**: Handles all communication with your backend server (Axios instance).
- **`helpers.js`**: Helper functions for date math (start of week, week dates), formatting, overlapping checks, and color palettes.
