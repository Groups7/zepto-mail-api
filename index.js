import express from 'express';
import cors from 'cors';
import { SendMailClient } from 'zeptomail';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new SendMailClient({
  url: "https://api.zeptomail.in/",
  token: "PHtE6r1cEb3j3WYq9hcE4vbsRJP1NNkq/LwyKFFA494TWP4GFk0BrNt6kmPk/UwqUvUQEfGawYk+su7I5+jRIT7rMj5MWmqyqK3sx/VYSPOZsbq6x00YuV8Td0bcUI7rcd5o0CDestndNA=="
});
app.post('/api/send-mail', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await client.sendMail({
      from: { address: "noreply@thegroup7.in", name: "Group7 Website" },
      to: [{ email_address: { address: "group7website1@gmail.com", name: "Group7 Admin" } }],
      subject: `New Contact Form Submission from ${name}`,
      htmlbody: `
        <div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Email failed', details: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
