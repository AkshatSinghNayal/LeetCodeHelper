const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { register, login } = require("../controllers/authController");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
