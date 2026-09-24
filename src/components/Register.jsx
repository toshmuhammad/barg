import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api";

function Register() {
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
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: data.message });
        return;
      }

      setStatus({ type: "success", message: data.message });
      setForm({ username: "", password: "" });

      setTimeout(() => navigate("/login"), 1200);
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
      <main className="auth-shell auth-shell-register">
        <section
          className="auth-visual register-visual"
          aria-label="Ro‘yxatdan o‘tish sahifasi bezagi"
        >
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
            <p className="eyebrow">Yangi boshlanish</p>
            <h1>Kichik qadamdan katta natija.</h1>
            <p>
              Hisob yarating va rejalaringizni bugundan tartibga solishni
              boshlang.
            </p>
          </div>

          <div className="auth-leaves" aria-hidden="true">
            <div className="auth-sun register-sun" />
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
              <p className="eyebrow">Yangi hisob</p>
              <h2>Ro‘yxatdan o‘ting.</h2>
              <p>Boshlash uchun username va password yarating.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  placeholder="Username yarating"
                  autoComplete="username"
                  minLength="3"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <small>Kamida 3 ta belgidan iborat bo‘lsin.</small>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Password yarating"
                  autoComplete="new-password"
                  minLength="6"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <small>Kamida 6 ta belgidan iborat bo‘lsin.</small>
              </div>

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
                {isSubmitting ? "Saqlanmoqda..." : "Ro‘yxatdan o‘tish"}
              </button>
            </form>

            <p className="form-switch">
              Hisobingiz bormi? <Link to="/login">Kirish</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;