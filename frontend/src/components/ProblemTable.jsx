import { reviewProblem } from "../api/problemApi";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function difficultyClass(level) {
  switch (level) {
    case "Easy":
      return "badge badge-easy";
    case "Medium":
      return "badge badge-medium";
    case "Hard":
      return "badge badge-hard";
    default:
      return "badge";
  }
}

function ProblemTable({ problems, onRefresh }) {
  const handleReview = async (id) => {
    try {
      await reviewProblem(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to mark as revised:", err);
    }
  };

  return (
    <section className="table-card">
      <h2>Your Problems</h2>

      {problems.length === 0 ? (
        <p className="empty-state">
          No problems added yet. Start by adding one above!
        </p>
      ) : (
        <table className="problem-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Difficulty</th>
              <th>Pattern</th>
              <th>Solved Date</th>
              <th>Next Review</th>
              <th>Reviews</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p._id || p.id}>
                <td data-label="Name">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </td>
                <td data-label="Difficulty">
                  <span className={difficultyClass(p.difficulty)}>
                    {p.difficulty}
                  </span>
                </td>
                <td data-label="Pattern">{p.pattern || "—"}</td>
                <td data-label="Solved Date">{formatDate(p.solvedDate)}</td>
                <td data-label="Next Review">{formatDate(p.nextReviewDate)}</td>
                <td data-label="Reviews">{p.reviewCount ?? 0}</td>
                <td data-label="Action">
                  <button
                    className="btn-review"
                    onClick={() => handleReview(p._id || p.id)}
                  >
                    Mark as Revised
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ProblemTable;
