const cron = require("node-cron");
const Problem = require("../models/Problem");
const User = require("../models/User");
const { sendReminderEmail } = require("../services/emailService");

const startCron = () => {
  // Run every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
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

      // Find all due problems and group them by userId
      const dueProblems = await Problem.find({
        nextReviewDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (dueProblems.length === 0) {
        console.log("No problems due for review today.");
        return;
      }

      // Group problems by userId
      const problemsByUser = dueProblems.reduce((acc, problem) => {
        const uid = problem.userId.toString();
        if (!acc[uid]) acc[uid] = [];
        acc[uid].push(problem);
        return acc;
      }, {});

      // Send one reminder email per user
      const userIds = Object.keys(problemsByUser);
      const users = await User.find({ _id: { $in: userIds } }).select(
        "_id email"
      );

      for (const user of users) {
        const userProblems = problemsByUser[user._id.toString()];
        if (userProblems && userProblems.length > 0) {
          await sendReminderEmail(user.email, userProblems);
          console.log(
            `Reminder email sent to ${user.email} for ${userProblems.length} problem(s).`
          );
        }
      }
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });

  console.log("Cron job scheduled: daily at 8:00 AM");
};

module.exports = { startCron };
