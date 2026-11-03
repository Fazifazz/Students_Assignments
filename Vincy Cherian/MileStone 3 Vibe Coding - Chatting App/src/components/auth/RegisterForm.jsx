import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Your name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    if (form.password && form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch(register({ name: form.name, email: form.email, password: form.password }));
    navigate('/chats');
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '440px' }}>
      <div className="text-center mb-4">
        <h2 className="mb-1">Create account</h2>
        <p className="text-muted mb-0">This is a demo app with mock auth storage only.</p>
      </div>

      {authError && <div className="alert alert-danger">{authError}</div>}

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Confirm password</label>
        <input
          type="password"
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          value={form.confirmPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        />
        {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
      </div>

      <button type="submit" className="btn btn-success w-100">Create account</button>

      <div className="text-center mt-3 small text-muted">
        Already have an account? <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => navigate('/login')}>Log in</button>
      </div>
    </form>
  );
};

export default RegisterForm;
