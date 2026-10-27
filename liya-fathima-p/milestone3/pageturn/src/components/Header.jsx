
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Dashboard",
  "/library": "My Library",
  "/reading": "Currently Reading",
  "/wishlist": "Want to Read",
  "/completed": "Completed Books",
};

export default function Header() {
  const location = useLocation();

  const title =
    titles[location.pathname] ||
    (location.pathname === "/add-book" ? "Add a Book" : "PageTurn");

  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">YOUR PERSONAL LIBRARY</span>
        <h1>{title}</h1>
      </div>
    </header>
  );
}
