import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import CurrentlyReading from "./pages/CurrentlyReading";
import Wishlist from "./pages/Wishlist";
import CompletedBooks from "./pages/CompletedBooks";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import NotFound from "./pages/NotFound";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-area">
        <div className="mobile-topbar">
          <button
            className="icon-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <strong>PageTurn</strong>
        </div>

        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/reading" element={<CurrentlyReading />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/completed" element={<CompletedBooks />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <span>PageTurn</span>
          <span>Every book, a new journey.</span>
        </footer>
      </div>
    </div>
  );
}