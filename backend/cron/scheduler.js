const cron = require("node-cron");
const Problem = require("../models/Problem");
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

      const dueProblems = await Problem.find({
        nextReviewDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (dueProblems.length > 0) {
        await sendReminderEmail(process.env.EMAIL_USER, dueProblems);
        console.log(
          `Reminder email sent for ${dueProblems.length} problem(s).`
        );
      } else {
        console.log("No problems due for review today.");
      }
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });

  console.log("Cron job scheduled: daily at 8:00 AM");
};

module.exports = { startCron };
