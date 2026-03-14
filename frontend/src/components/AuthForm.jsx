import { useState } from "react";
import { login, register } from "../api/problemApi";

function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      setIsSubmitting(true);
      const payload =
        mode === "register"
          ? { name: form.name, email: form.email, password: form.password }
          : { email: form.email, password: form.password };

      const { data } = mode === "register" ? await register(payload) : await login(payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setStatus({ type: "", message: "" });
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="auth-card">
      <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="form-group">
            <label htmlFor="auth-name">Name</label>
            <input
              id="auth-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
            value={form.password}
            onChange={handleChange}
            required
            minLength={mode === "register" ? 6 : undefined}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>

        {status.message && (
          <p
            role="status"
            style={{
              marginTop: "12px",
              color: status.type === "error" ? "#b91c1c" : "#166534",
              fontWeight: 600,
            }}
          >
            {status.message}
          </p>
        )}
      </form>

      <p className="auth-toggle">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={toggleMode} className="auth-toggle-btn">
          {mode === "login" ? "Register" : "Sign In"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
