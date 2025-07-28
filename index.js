import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { SendMailClient } from 'zeptomail';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Zepto client
const client = new SendMailClient({
  url: 'https://api.zeptomail.in/',
  token: process.env.ZEPTO_TOKEN
});
app.post('/api/send-mail', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Check if all fields are present
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await client.sendMail({
      from: {
        address: "noreply@thegroup7.in",
        name: "Group7 Website"
      },
      to: [{
        email_address: {
          address: "group7website1@gmail.com",
          name: "Group7 Admin"
        }
      }],
      subject: `New Contact Form Submission from ${name}`,
      htmlbody: `
        <div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
      bounce_address: "bounce@thegroup7.in" 
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Email failed', details: error.message });
  }
})