const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Problem = require("../models/Problem");

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo123456";
const DEMO_NAME = "Demo User";

const DEMO_PROBLEMS = [
  {
    name: "Two Sum",
    link: "https://leetcode.com/problems/two-sum/",
    difficulty: "Easy",
    pattern: "Hash Map",
    solvedDate: new Date("2026-06-01"),
    reviewCount: 1,
    nextReviewDate: new Date("2026-06-04"),
  },
  {
    name: "Valid Parentheses",
    link: "https://leetcode.com/problems/valid-parentheses/",
    difficulty: "Easy",
    pattern: "Stack",
    solvedDate: new Date("2026-06-02"),
    reviewCount: 0,
    nextReviewDate: new Date("2026-06-05"),
  },
  {
    name: "Merge Two Sorted Lists",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    difficulty: "Easy",
    pattern: "Linked List",
    solvedDate: new Date("2026-06-03"),
    reviewCount: 0,
    nextReviewDate: new Date("2026-06-06"),
  },
  {
    name: "Maximum Subarray",
    link: "https://leetcode.com/problems/maximum-subarray/",
    difficulty: "Medium",
    pattern: "Kadane's Algorithm",
    solvedDate: new Date("2026-05-28"),
    reviewCount: 2,
    nextReviewDate: new Date("2026-06-27"),
  },
  {
    name: "Binary Tree Level Order Traversal",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    difficulty: "Medium",
    pattern: "BFS",
    solvedDate: new Date("2026-05-20"),
    reviewCount: 1,
    nextReviewDate: new Date("2026-05-30"),
  },
  {
    name: "Longest Substring Without Repeating Characters",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    difficulty: "Medium",
    pattern: "Sliding Window",
    solvedDate: new Date("2026-06-01"),
    reviewCount: 0,
    nextReviewDate: new Date("2026-06-04"),
  },
  {
    name: "LRU Cache",
    link: "https://leetcode.com/problems/lru-cache/",
    difficulty: "Medium",
    pattern: "Design",
    solvedDate: new Date("2026-05-25"),
    reviewCount: 1,
    nextReviewDate: new Date("2026-06-04"),
  },
  {
    name: "Number of Islands",
    link: "https://leetcode.com/problems/number-of-islands/",
    difficulty: "Medium",
    pattern: "DFS",
    solvedDate: new Date("2026-05-30"),
    reviewCount: 0,
    nextReviewDate: new Date("2026-06-02"),
  },
  {
    name: "Median of Two Sorted Arrays",
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    difficulty: "Hard",
    pattern: "Binary Search",
    solvedDate: new Date("2026-05-15"),
    reviewCount: 3,
    nextReviewDate: new Date("2026-08-13"),
  },
  {
    name: "Trapping Rain Water",
    link: "https://leetcode.com/problems/trapping-rain-water/",
    difficulty: "Hard",
    pattern: "Two Pointers",
    solvedDate: new Date("2026-05-10"),
    reviewCount: 2,
    nextReviewDate: new Date("2026-06-09"),
  },
];

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const demoLogin = async (req, res) => {
  try {
    let user = await User.findOne({ email: DEMO_EMAIL });

    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);
      user = await User.create({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: hashedPassword,
      });

      const problemsWithUser = DEMO_PROBLEMS.map((p) => ({
        ...p,
        userId: user._id,
      }));
      await Problem.insertMany(problemsWithUser);
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, demoLogin };
