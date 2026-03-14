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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProblem(form);
      setForm(INITIAL_FORM);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to add problem:", err);
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

        <button type="submit" className="btn-submit">
          Add Problem
        </button>
      </form>
    </section>
  );
}

export default AddProblemForm;
