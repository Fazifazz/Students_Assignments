import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="page-shell" id="top">
        <main>
          <Outlet />
        </main>
        <footer className="page-footer">
          <Link className="footer-brand" to="/">FITTRACK <span>LITE</span></Link>
          <p>Move with intention. Progress at your own pace.</p>
          <span className="footer-note">BUILT FOR YOUR NEXT REP</span>
        </footer>
      </div>
    </>
  );
}

export default AppLayout;
