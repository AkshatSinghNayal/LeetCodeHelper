import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

export function getProblems() {
  return api.get("/api/problems");
}

export function addProblem(data) {
  return api.post("/api/problems", data);
}

export function reviewProblem(id) {
  return api.post(`/api/problems/${id}/review`);
}

export function getDueProblems() {
  return api.get("/api/problems/due");
}
