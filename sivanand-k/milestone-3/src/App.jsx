import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import WorkoutsPage from "./pages/WorkoutsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
