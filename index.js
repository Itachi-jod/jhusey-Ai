require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Basic moderation function
function isAllowed(text) {
  const bannedWords = ['badword1', 'badword2']; // Add your banned words here
  for (const word of bannedWords) {
    if (text.toLowerCase().includes(word)) return false;
  }
  return true;
}

app.post('/jhusey', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'No message provided.' });

  if (!isAllowed(message)) {
    return res.status(403).json({ error: 'Message blocked by moderator.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Jhusey, an AI created by Lord Itachi.' },
        { role: 'user', content: message }
      ],
    });

    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jhusey AI API running on port ${PORT}`);
});
