const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  addProblem,
  getProblems,
  reviewProblem,
  getDueProblems,
} = require("../controllers/problemController");
const { protect } = require("../middleware/auth");
const { sendDueReminders } = require("../cron/scheduler");

const problemsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

router.use(problemsLimiter);
router.use(protect);

router.get("/due", getDueProblems);
router.post("/", addProblem);
router.get("/", getProblems);
router.post("/:id/review", reviewProblem);

router.post("/trigger-reminders", async (req, res) => {
  try {
    const result = await sendDueReminders();
    res.json(result);
  } catch (error) {
    console.error("Manual trigger error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
