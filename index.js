const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// IMPORTANT: Pass version "v1beta" explicitly for Gemini
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.API_KEY,
  apiVersion: "v1beta"
});

app.post("/chat", async (req, res) => {
  const prompt = req.body.message;
  if (!prompt) return res.status(400).json({ error: "Missing message" });

  try {
    // Use the full model name with "models/"
    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    res.json({ response: responseText });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong with Jhusey." });
  }
});

app.listen(port, () => {
  console.log(`Jhusey AI running on http://localhost:${port}`);
});
