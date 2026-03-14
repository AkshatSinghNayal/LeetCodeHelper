const Problem = require("../models/Problem");

const REVIEW_INTERVALS = [3, 10, 30, 90];

const addProblem = async (req, res) => {
  try {
    const { name, link, difficulty, pattern, solvedDate } = req.body;

    const problem = new Problem({
      userId: req.user.id,
      name,
      link,
      difficulty,
      pattern,
      solvedDate,
    });

    const solved = new Date(solvedDate);
    problem.nextReviewDate = new Date(
      solved.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    const savedProblem = await problem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user.id }).sort({ nextReviewDate: 1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    problem.reviewCount += 1;

    const intervalIndex = Math.min(
      problem.reviewCount - 1,
      REVIEW_INTERVALS.length - 1
    );
    const daysToAdd = REVIEW_INTERVALS[intervalIndex];

    const now = new Date();
    problem.nextReviewDate = new Date(
      now.getTime() + daysToAdd * 24 * 60 * 60 * 1000
    );

    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDueProblems = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const problems = await Problem.find({
      userId: req.user.id,
      nextReviewDate: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProblem, getProblems, reviewProblem, getDueProblems };
