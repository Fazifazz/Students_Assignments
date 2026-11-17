# 🎓 EduTrack — Modern Course Learning Tracker

A responsive, feature-packed **Course Learning Tracker** web application built with **React 19**, **Tailwind CSS v4**, **React Router v7**, and **Lucide Icons**. EduTrack empowers learners to manage their course catalog, track lesson progress with animated progress bars, log daily study hours, maintain learning streaks, analyze subject distribution with visual charts, and set deadlines.

All user data persists seamlessly using **Local Storage**, with backup export and JSON restoration capabilities.

---

## 🌟 Key Features

### 1. 📊 Central Dashboard
- **Key Metrics KPI Cards**: Total enrolled courses, completed lessons, overall completion percentage, and cumulative learning hours.
- **Continue Learning Carousel**: Quick resume cards with course thumbnails, lesson progress, play button, and deadline indicators.
- **Today's Goal Tracker**: Real-time progress bar toward daily study target minutes.
- **Weekly Activity Chart**: 7-day study breakdown showing actual vs. target hours.
- **Streak Counter**: Animated flame badge showing consecutive days of study.
- **Recent Sessions Feed**: Timeline of recently completed milestones and logged study periods.

### 2. 🎬 Embedded YouTube Video Player & Course Details (`/courses/:id`)
- **Native Embedded YouTube Player**:
  - Embedded 16:9 YouTube video player powered by YouTube iframe embeds (`https://www.youtube-nocookie.com/embed/...`).
  - **Zero API Keys & Zero Backend Required**: works seamlessly out-of-the-box.
  - Playlist navigation buttons (**Previous Lesson** & **Next Lesson**) right under the player.
  - Prominent **"Mark as Completed"** toggle button directly below the video player.
  - External YouTube playlist button opening the full playlist on YouTube in a new tab.
- **Interactive Playlist & Lesson List**:
  - Displays video thumbnails (`https://img.youtube.com/vi/{id}/hqdefault.jpg`), durations, and completion checkmarks.
  - Clicking any lesson switches the active video immediately in the embedded player.
  - "Playing Now" indicator with highlight ring.
  - Adding a completed lesson automatically logs study session minutes for today and triggers celebration confetti upon completing 100% of the course!
  - Add, edit, or delete individual lessons with YouTube video links/IDs.
  - Filter curriculum by *All*, *Remaining*, or *Done* lessons.
- **Course Notes & Insights**:
  - Integrated rich notes editor with auto-save for technical summaries, code snippets, and takeaways.

### 3. 📚 Course Management (My Courses)
- **Course Library**: View all enrolled courses in responsive **Grid** or **List** views with real course thumbnails and play overlays.
- **1-Click YouTube Playlist Auto-Importer**:
  - Paste any YouTube playlist link or ID (`https://www.youtube.com/playlist?list=...`).
  - **Zero Manual Input Required**: Automatically extracts the Course Title, Channel/Instructor, Cover Thumbnail, Category, Estimated Hours, and **ALL individual video lessons** with their titles, YouTube IDs, and durations!
  - Instantly previews the course card and scrollable lesson list with a single **"Add Course with X Lessons & Start Learning"** button.
  - Multi-tier extraction engine (public Invidious instances, Piped APIs, CORS scraping, and optional YouTube Data API v3).
- **Curated Ready-to-Study Presets**: Hand-picked popular complete developer courses (React 19, TypeScript, Next.js 15, Python) importable in 1 click.
- **Search & Filter**: Real-time search by title, instructor, or description; filter by category (*Web Development*, *Data Science & AI*, *UI/UX Design*, *Cloud & DevOps*, *Mobile Apps*, *Cybersecurity*) and completion status (*In Progress*, *Completed*, *Not Started*).
- **Multi-criteria Sorting**: Sort by Recently Added, Progress (High-to-Low / Low-to-High), Upcoming Deadlines, or Alphabetical.
- **Delete Confirmation Modal**: Safeguard against accidental deletion.

### 4. 🏆 Learning Goals & Habit Tracker (`/goals`)
- **Daily & Weekly Target Setting**: Customize daily study minutes and weekly target hours.
- **Daily Habit Checklist**: Daily checklist (*Complete 1 lesson*, *Hands-on coding*, *Write summary notes*, *Read docs*) with one-click toggles.
- **Course Deadlines Radar**: Chronological radar showing courses ordered by urgency with color-coded warning chips (*Overdue*, *Due today*, *7 days left*, *On track*).
- **Quick Study Logger**: Presets (25m, 45m, 60m, 90m) or custom duration with course selection.

### 5. 📈 Progress & Analytics (`/statistics`)
- **Interactive Visual Charts**:
  - **7-Day Activity Bar Chart**: Hover tooltips, target benchmark line, dynamic gradient heights.
  - **Subject Distribution Donut Chart**: SVG breakdown of courses and percentages across categories with hover highlighting.
  - **Course Progress Comparison Chart**: Horizontal comparative ranking across all active courses.
- **Milestones & Badges Showcase**: Unlockable achievement badges (*First Step*, *Week Warrior*, *The Finisher*, *Polymath*, *Scholar*, *Goal Crusher*).
- **Study Sessions Log**: Complete table log of study sessions, courses, dates, and accomplishments.

### 6. ⚙️ Settings & Data Control (`/settings`)
- **Profile Customization**: Name, role headline, email, and avatar URL.
- **Notification Preferences**: Toggles for daily reminders, deadline warnings, and streak alerts.
- **Local Storage Management**:
  - **Export JSON**: Download your entire courses, sessions, and habits database as a `.json` backup file.
  - **Import JSON**: Restore a previous JSON backup at any time.
  - **Restore Sample Data**: Reset to preloaded realistic dataset containing 5 courses across disciplines.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & Polish**: `canvas-confetti`
- **State & Persistence**: React Context (`CourseContext`, `ToastContext`) synced with browser `localStorage`
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Space Grotesk*)

---

## 🚀 Running Locally

1. Navigate to the project directory:
   ```bash
   cd sreejesh-mohan/milestone-3
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
milestone-3/
├── public/
│   ├── favicon.svg
│   └── _redirects              # Netlify SPA client-side routing fallback
├── src/
│   ├── components/
│   │   ├── charts/             # WeeklyStudyBarChart, CategoryPieChart, CourseProgressBarChart
│   │   ├── common/             # Modal, ConfirmDialog, ProgressBar, Badge, EmptyState
│   │   ├── courses/            # CourseCard, CourseFormModal, LessonItem, LessonFormModal
│   │   ├── goals/              # LogStudyModal, GoalFormModal
│   │   └── layout/             # Layout, Sidebar, Header, MobileNav
│   ├── context/
│   │   ├── CourseContext.jsx   # Global course state, study sessions, streak logic, LocalStorage sync
│   │   └── ToastContext.jsx    # Toast notification system
│   ├── data/
│   │   └── initialData.js      # 5 rich sample courses, past 7-day study logs, and daily habits
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── MyCoursesPage.jsx
│   │   ├── CourseDetailsPage.jsx
│   │   ├── LearningGoalsPage.jsx
│   │   ├── StatisticsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/
│   │   ├── dateUtils.js        # Formatters, deadline urgency calculator, time conversions
│   │   └── storage.js          # Safe localStorage JSON wrapper
│   ├── App.jsx                 # Routes & layout definition
│   ├── main.jsx
│   └── index.css               # Tailwind CSS v4 & custom design tokens
├── package.json
└── vite.config.js
```
