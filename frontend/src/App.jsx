import { useEffect, useState } from "react";
import { getProblems } from "./api/problemApi";
import AddProblemForm from "./components/AddProblemForm";
import ProblemTable from "./components/ProblemTable";
import AuthForm from "./components/AuthForm";
import "./App.css";

function App() {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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
    if (user) {
      fetchProblems();
    }
  }, [user]);

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProblems([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 DSA Revision Reminder</h1>
        <p>Track your LeetCode progress and never forget to revise</p>
        {user && (
          <div className="header-user">
            <span className="header-user-name">👤 {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Log out
            </button>
          </div>
        )}
      </header>

      {!user ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <AddProblemForm onSuccess={fetchProblems} />
          <ProblemTable problems={problems} onRefresh={fetchProblems} />
        </>
      )}

      <footer className="app-footer">
        <p>
          Built by Akshat Singh Nayal |{" "}
          <a
            href="https://github.com/AkshatSinghNayal/LeetCodeHelper"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
