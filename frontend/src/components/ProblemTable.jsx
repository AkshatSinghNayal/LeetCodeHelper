import { useEffect, useMemo, useState } from "react";
import { reviewProblem } from "../api/problemApi";

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(problems.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedProblems = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return problems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [page, problems]);

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

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
        <>
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
              {paginatedProblems.map((p) => (
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

          <div className="pagination" aria-label="Problems pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            {pageItems.map((item, index) =>
              item === "..." ? (
                <span className="pagination-ellipsis" key={`ellipsis-${index}`}>
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  className={`pagination-btn ${page === item ? "is-active" : ""}`}
                  onClick={() => setPage(item)}
                  aria-current={page === item ? "page" : undefined}
                >
                  {item}
                </button>
              )
            )}

            <button
              className="pagination-btn"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ProblemTable;
