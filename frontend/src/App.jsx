import { useEffect, useState } from "react";
import { getProblems } from "./api/problemApi";
import AddProblemForm from "./components/AddProblemForm";
import ProblemTable from "./components/ProblemTable";
import "./App.css";

function App() {
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const { data } = await getProblems();
      const newestFirst = [...data].sort(
        (a, b) =>
          new Date(b.createdAt || b.solvedDate || 0) -
          new Date(a.createdAt || a.solvedDate || 0)
      );
      setProblems(newestFirst);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 DSA Revision Reminder</h1>
        <p>Track your LeetCode progress and never forget to revise</p>
      </header>

      <AddProblemForm onSuccess={fetchProblems} />
      <ProblemTable problems={problems} onRefresh={fetchProblems} />
    </div>
  );
}

export default App;
