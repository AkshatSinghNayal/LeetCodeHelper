const cron = require("node-cron");
const Problem = require("../models/Problem");
const User = require("../models/User");
const CronLog = require("../models/CronLog");
const { sendReminderEmail } = require("../services/emailService");

const sendDueReminders = async () => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const cronLog = await CronLog.findOne({ name: "daily-reminder" });
  if (cronLog && cronLog.lastRun >= startOfToday) {
    console.log("Reminders already sent today, skipping.");
    return { sent: false, reason: "already-sent-today" };
  }

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
    nextReviewDate: { $gte: startOfToday, $lte: endOfDay },
  });

  if (dueProblems.length === 0) {
    console.log("No problems due for review today.");
    await CronLog.findOneAndUpdate(
      { name: "daily-reminder" },
      { lastRun: now },
      { upsert: true }
    );
    return { sent: false, reason: "no-due-problems" };
  }

  const problemsByUser = dueProblems.reduce((acc, problem) => {
    const uid = problem.userId.toString();
    if (!acc[uid]) acc[uid] = [];
    acc[uid].push(problem);
    return acc;
  }, {});

  const userIds = Object.keys(problemsByUser);
  const users = await User.find({ _id: { $in: userIds } }).select("_id email");

  let sentCount = 0;
  for (const user of users) {
    const userProblems = problemsByUser[user._id.toString()];
    if (userProblems && userProblems.length > 0) {
      await sendReminderEmail(user.email, userProblems);
      sentCount++;
      console.log(
        `Reminder email sent to ${user.email} for ${userProblems.length} problem(s).`
      );
    }
  }

  await CronLog.findOneAndUpdate(
    { name: "daily-reminder" },
    { lastRun: now },
    { upsert: true }
  );

  return { sent: true, userCount: sentCount, problemCount: dueProblems.length };
};

const startCron = () => {
  cron.schedule("0 8 * * *", async () => {
    try {
      const result = await sendDueReminders();
      if (result.sent) {
        console.log(
          `Cron: Sent reminders to ${result.userCount} user(s) for ${result.problemCount} problem(s).`
        );
      }
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  console.log("Cron job scheduled: daily at 8:00 AM IST (Asia/Kolkata)");
};

module.exports = { startCron, sendDueReminders };
