const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if you have any)
app.use(express.static('public'));

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email service provider
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-email-password'   // Your email password or app password
        }
    });

    const mailOptions = {
        from: email,
        to: 'your-email@example.com', // Where you want to receive the emails
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send message.' });
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
