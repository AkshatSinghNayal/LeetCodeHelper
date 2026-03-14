const express = require("express");
const router = express.Router();
const {
  addProblem,
  getProblems,
  reviewProblem,
  getDueProblems,
} = require("../controllers/problemController");

router.get("/due", getDueProblems);
router.post("/", addProblem);
router.get("/", getProblems);
router.post("/:id/review", reviewProblem);

module.exports = router;
