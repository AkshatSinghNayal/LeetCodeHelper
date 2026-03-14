import { useState } from "react";
import { addProblem } from "../api/problemApi";

const INITIAL_FORM = {
  name: "",
  link: "",
  difficulty: "Easy",
  pattern: "",
  solvedDate: new Date().toISOString().split("T")[0],
};

function AddProblemForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.pattern.trim() || !form.link.trim()) {
      setStatus({
        type: "error",
        message: "Please fill Problem Name, Link, and Pattern before submitting.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "", message: "" });
      await addProblem(form);
      setForm(INITIAL_FORM);
      setStatus({ type: "success", message: "Problem added successfully." });
      if (onSuccess) onSuccess();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to add problem. Please check backend URL/env and try again.";
      setStatus({ type: "error", message });
      console.error("Failed to add problem:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-card">
      <h2>Add New Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Problem Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Two Sum"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Problem Link</label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={form.link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pattern">Pattern</label>
            <input
              id="pattern"
              name="pattern"
              type="text"
              placeholder="e.g. Two Pointers"
              value={form.pattern}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="solvedDate">Solved Date</label>
            <input
              id="solvedDate"
              name="solvedDate"
              type="date"
              value={form.solvedDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Problem"}
        </button>

        {status.message ? (
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
        ) : null}
      </form>
    </section>
  );
}

export default AddProblemForm;
