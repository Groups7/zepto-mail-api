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

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await client.sendMail({
      from: {
        address: 'noreply@thegroup7.in',
        name: 'Group7 Website'
      },
      to: [
        {
          email_address: {
            address: 'group7website1@gmail.com',
            name: 'Group7 Admin'
          }
        }
      ],
      subject: `New Contact Form Submission from ${name}`,
      htmlbody: `
        <div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `
    });

    console.log('Email sent:', response);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('ZeptoMail Error:', error);
    res.status(500).json({ error: 'Email failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
