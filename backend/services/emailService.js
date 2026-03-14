const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (to, problems) => {
  const problemRows = problems
    .map(
      (p) =>
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.difficulty}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.pattern}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <a href="${p.link}" target="_blank">Solve</a>
          </td>
        </tr>`
    )
    .join("");

  const html = `
    <h2>DSA Revision Reminder</h2>
    <p>You have <strong>${problems.length}</strong> problem(s) due for review today:</p>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f4f4f4;">
          <th style="padding: 8px; border: 1px solid #ddd;">Problem</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Difficulty</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Pattern</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Link</th>
        </tr>
      </thead>
      <tbody>
        ${problemRows}
      </tbody>
    </table>
    <p style="margin-top: 16px;">Happy coding! 🚀</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "DSA Revision Reminder",
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendReminderEmail };
