const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro", 
  generationConfig: { temperature: 0.7 }
});

app.post("/chat", async (req, res) => {
  const prompt = req.body.message;
  if (!prompt) return res.status(400).json({ error: "Missing message" });

  try {
    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ response: text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong with Jhusey." });
  }
});

app.listen(port, () => console.log(`Jhusey AI running on port ${port}`));
