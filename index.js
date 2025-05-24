const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Use the available model name, for example, "models/text-bison-001"
const model = genAI.getGenerativeModel({ model: "models/text-bison-001" });

app.post("/chat", async (req, res) => {
  const prompt = req.body.message;
  if (!prompt) return res.status(400).json({ error: "Missing message" });

  try {
    // Use generateContent() to get text generation
    const response = await model.generateContent({
      prompt: {
        text: prompt,
      },
    });

    const text = response.candidates[0].content;
    res.json({ response: text });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Something went wrong with Jhusey." });
  }
});

app.listen(port, () => console.log(`Jhusey AI running on port ${port}`));
