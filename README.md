# Weekly Activity Tracker 📅

A modern, full-stack web application for tracking your weekly activities. Built with Node.js, Express, React, and TailwindCSS with a beautiful glassmorphism design.

![Activity Tracker](https://img.shields.io/badge/Status-Ready-success)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## ✨ Features

- 📊 **Weekly Calendar View** - Visualize your activities across the entire week
- ✅ **Activity Management** - Create, edit, delete, and mark activities as complete
- 🎨 **Category System** - Organize activities by Work, Personal, Fitness, Learning, Social, Health, or Other
- 🔍 **Smart Filtering** - Filter activities by category
- 📱 **Mobile Responsive** - Fully optimized for mobile, tablet, and desktop
- 🎭 **Modern UI** - Glassmorphism design with vibrant gradients and smooth animations
- ⚡ **Real-time Updates** - Instant synchronization with the backend

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd ActvityTracker
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (in the `backend` directory):
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend dev server** (in the `frontend` directory):
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
ActvityTracker/
├── backend/
│   ├── routes/
│   │   └── activities.js      # API routes
│   ├── database.js             # SQLite database setup
│   ├── server.js               # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── WeeklyCalendar.jsx
    │   │   ├── ActivityCard.jsx
    │   │   └── ActivityForm.jsx
    │   ├── services/
    │   │   └── api.js          # API service
    │   ├── utils/
    │   │   └── helpers.js      # Utility functions
    │   ├── App.jsx             # Main app component
    │   └── index.css           # Styles
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## 🎯 Usage

### Creating an Activity

1. Click the **"Add Activity"** button in the header
2. Fill in the activity details:
   - **Title** (required): Name of the activity
   - **Description** (optional): Additional details
   - **Category** (required): Choose from 7 categories
   - **Day** (required): Select day of the week
   - **Time** (required): Set the start time
   - **Duration** (required): Duration in minutes
3. Click **"Create Activity"**

### Managing Activities

- **Complete**: Click the checkmark icon to mark as complete/incomplete
- **Edit**: Click the pencil icon to modify activity details
- **Delete**: Click the trash icon to remove an activity

### Filtering Activities

Click on any category button in the filter bar to show only activities in that category. Click **"All"** to show all activities.

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library

## 🎨 Design Features

- **Glassmorphism UI** - Frosted glass effect with backdrop blur
- **Gradient Backgrounds** - Vibrant purple-blue gradients
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Color-Coded Categories** - Visual distinction for different activity types
- **Responsive Grid** - 7 columns on desktop, stacks on mobile
- **Modern Typography** - Inter font from Google Fonts

## 📡 API Endpoints

### Activities

- `GET /api/activities` - Get all activities (supports filtering)
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `PATCH /api/activities/:id/toggle` - Toggle completion status
- `DELETE /api/activities/:id` - Delete activity

### Health Check

- `GET /api/health` - Server health status

## 🔧 Configuration

### Backend Port

The backend runs on port `3001` by default. To change it, set the `PORT` environment variable:

```bash
PORT=4000 npm start
```

### Frontend API URL

The frontend connects to `http://localhost:3001/api` by default. To change this, edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:

- **Mobile** (320px - 767px): Single column layout
- **Tablet** (768px - 1023px): Optimized grid layout
- **Desktop** (1024px+): Full 7-column weekly view

## 🚧 Future Enhancements

- [ ] User authentication and personal accounts
- [ ] Recurring activities
- [ ] Activity templates
- [ ] Statistics and analytics dashboard
- [ ] Calendar export (iCal format)
- [ ] Drag-and-drop rescheduling
- [ ] Push notifications for reminders
- [ ] Dark/light theme toggle

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you have any questions or need help, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and TailwindCSS**
