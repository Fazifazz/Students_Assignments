import { useState } from "react";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event) {
    event.preventDefault();
    onLogin(email);
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <a className="brand login-brand" href="/" aria-label="Bistro POS home">
          <span className="brand-mark">B</span>
          <span><strong>Bistro POS</strong><small>Restaurant billing</small></span>
        </a>
        <div className="showcase-copy">
          <span className="showcase-label">WELCOME TO BISTRO</span>
          <h1>Good food.<br />Great service.</h1>
          <p>Everything you need to make every order a little more memorable.</p>
        </div>
        <img className="login-dish" src="/menu/hero-dish.svg" alt="" />
        <span className="showcase-caption">Your restaurant, beautifully in order.</span>
      </section>

      <section className="login-content">
        <form className="login-card" onSubmit={submit}>
          <span className="login-icon" aria-hidden="true">✦</span>
          <p className="eyebrow">STAFF ACCESS</p>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to open your billing workspace.</p>

          <label className="login-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="username"
              placeholder="name@restaurant.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button className="login-submit" type="submit">Continue to billing <span>→</span></button>
          <p className="demo-notice">
            Demo login only. Credentials are not verified and this screen does not secure billing data.
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
