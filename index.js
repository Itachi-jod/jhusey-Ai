import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL;

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return res.status(500).json({ error: "No response from Gemini." });

    res.json({ response: text });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Something went wrong with Gemini." });
  }
});

app.listen(port, () => console.log(`Gemini bot running on port ${port}`));
