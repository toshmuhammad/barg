import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: data.message });
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setStatus({ type: "success", message: data.message });

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Serverga ulanib bo‘lmadi. Server ishlayotganini tekshiring.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-shell">
        <section className="auth-visual" aria-label="Kirish sahifasi bezagi">
          <Link
            className="brand auth-brand"
            to="/"
            aria-label="Barg bosh sahifasiga qaytish"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>Barg</span>
          </Link>

          <div className="auth-message">
            <p className="eyebrow">Xush kelibsiz</p>
            <h1>Rejalaringiz sizni kutmoqda.</h1>
            <p>
              Hisobingizga kiring va ishlaringizni qolgan joyidan davom
              ettiring.
            </p>
          </div>

          <div className="auth-leaves" aria-hidden="true">
            <div className="auth-sun" />
            <div className="leaf auth-leaf-one" />
            <div className="leaf auth-leaf-two" />
            <div className="leaf auth-leaf-three" />
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-form-wrap">
            <Link className="back-link" to="/">
              Bosh sahifaga
            </Link>

            <div className="form-heading">
              <p className="eyebrow">Hisobingizga kirish</p>
              <h2>Qaytganingiz yaxshi.</h2>
              <p>Davom etish uchun ma’lumotlaringizni kiriting.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="Username kiriting"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="login-password">Password</label>
                  <a href="#forgot-password">Parolni unutdingizmi?</a>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Password kiriting"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="checkbox-row">
                <input type="checkbox" name="remember" />
                <span>Meni eslab qol</span>
              </label>

              {status.message && (
                <p className={`form-message ${status.type}`} role="status">
                  {status.message}
                </p>
              )}

              <button
                className="button form-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Kirilmoqda..." : "Kirish"}
              </button>
            </form>

            <p className="form-switch">
              Hisobingiz yo‘qmi? <Link to="/register">Ro‘yxatdan o‘tish</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;