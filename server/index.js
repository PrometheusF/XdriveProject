const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // .env dosyasını yükler

const app = express();

// Cross-Origin isteklerine izin ver
app.use(cors());
// JSON body parsing
app.use(express.json());

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;

// Nodemailer transport ayarı
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },
});

// POST /send-email rotası
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    // Gönderilecek e-posta içeriği
    const mailOptions = {
        from: `"${name}" <${EMAIL_ADDRESS}>`,
        to: RECIPIENT_ADDRESS,
        subject: "New message from contact form",
        text: `
Name: ${name}
Email: ${email}
Message: ${message}
    `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
