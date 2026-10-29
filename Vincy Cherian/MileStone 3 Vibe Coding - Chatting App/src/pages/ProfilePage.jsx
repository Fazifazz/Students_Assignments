import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateProfile } from '../features/auth/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    name: user?.name || '',
    status: user?.status || '',
    avatar: user?.avatar || '',
  });

  if (!user) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateProfile(form));
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="mb-4">Your profile</h3>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={user.avatar} alt={user.name} className="rounded-circle" width="80" height="80" />
              <div>
                <h5 className="mb-1">{user.name}</h5>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Display name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.avatar}
                  onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-success">Save profile</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
