import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: 'aisha@chatnest.app', password: 'demo123' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password.trim()) nextErrors.password = 'Password is required.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch(login({ email: form.email, password: form.password }));
    navigate('/chats');
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '440px' }}>
      <div className="text-center mb-4">
        <div className="rounded-circle bg-success-subtle d-inline-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <i className="bi bi-chat-heart-fill text-success fs-3"></i>
        </div>
        <h2 className="mt-3 mb-1">Welcome back</h2>
        <p className="text-muted mb-0">Mock sign-in for the ChatNest prototype</p>
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
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((value) => !value)}>
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        </div>
        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
      </div>

      <button type="submit" className="btn btn-success w-100">
        Log in
      </button>

      <div className="text-center mt-3 small text-muted">
        Need an account? <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => navigate('/register')}>Register</button>
      </div>
    </form>
  );
};

export default LoginForm;
