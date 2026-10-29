import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const AppNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-success" to="/chats">
          <i className="bi bi-chat-heart-fill me-2"></i>
          ChatNest
        </NavLink>

        <div className="navbar-nav ms-auto align-items-center gap-2">
          <NavLink className="nav-link" to="/chats">Chats</NavLink>
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
          <NavLink className="nav-link" to="/settings">Settings</NavLink>
          <button type="button" className="btn btn-outline-success btn-sm" onClick={handleLogout}>
            Logout
          </button>
          {user && (
            <div className="d-flex align-items-center gap-2 ms-2">
              <img src={user.avatar} alt={user.name} className="rounded-circle" width="32" height="32" />
              <span className="fw-semibold small">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
