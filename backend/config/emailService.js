// const nodemailer = require("nodemailer");

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: smtp.gmail.com,
//   port : 465,
//   secure: true,  
//   auth: {
//     user: process.env.EMAIL_USER,  
//     pass: process.env.EMAIL_PASS, 
//   },
// });

// // Function to send email
// const sendEmail = async (to, subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     });
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = sendEmail;

// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async ({ to, subject, text }) => {
//   try {
//     await sgMail.send({
//       // from: process.env.EMAIL_USER,
//       from: "Helpinghands@example.com", 
//       to,
//       subject,
//       text,
//     });

//     console.log(" Email sent via SendGrid");
//   } catch (error) {
//     console.error(" SendGrid error:", error.response?.body || error);
//   }
// };

// module.exports = sendEmail;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({
  from,
  to,
  subject,
  text,
  html,
  replyTo,
}) => {
  try {
    await sgMail.send({
      from,        // must be verified in SendGrid
      to,
      subject,
      text,
      html,
      replyTo,
    });

    console.log("Email sent via SendGrid");
  } catch (error) {
    console.error(
      "SendGrid error:",
      error.response?.body || error
    );
  }
};

module.exports = sendEmail;