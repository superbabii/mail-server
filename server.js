const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  credentials: true,
  origin: "https://nazar-babii.vercel.app",
};

app.use(cors(corsOptions));

// Handle form submission
app.post("/submit-form", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic input validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  // Set up Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL, 
    subject: subject,
    text: `From: ${name} \n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send message." });
    }
    res.status(200).json({ message: "Message sent successfully!" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
