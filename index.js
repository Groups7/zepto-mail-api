const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { SendMailClient } = require('zeptomail');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Required for Render to detect the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ZeptoMail client
const client = new SendMailClient({
  url: "https://api.zeptomail.in/",
  token: process.env.ZEPTO_TOKEN
});

// Route
app.post('/api/send-mail', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await client.sendMail({
      from: { address: "noreply@thegroup7.in", name: "Group7 Website" },
      to: [{ email_address: { address: "group7website1@gmail.com", name: "Group7" } }],
      subject: `New Contact Form Submission from ${name}`,
      htmlbody: `
        <div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>`,
      bounce_address: "bounce@thegroup7.in"
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ ZeptoMail Error:", error.message);
    res.status(500).json({ error: 'Email failed', details: error.message });
  }
});

// ✅ Bind the app to the port (required by Render)
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
