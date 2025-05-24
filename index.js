const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getModel() {
  // Replace "your-correct-model-name" with the model name you got from listModels()
  return genAI.getGenerativeModel({ model: "your-correct-model-name" });
}

app.post("/chat", async (req, res) => {
  const prompt = req.body.message;
  if (!prompt) return res.status(400).json({ error: "Missing message" });

  try {
    const model = await getModel();

    // Use generateText() or generateContent() depending on model support
    const result = await model.generateText({
      prompt: {
        text: prompt
      }
    });

    // For most models, the response text is inside `result.candidates[0].output`
    const text = result.candidates[0].output;

    res.json({ response: text });
  } catch (err) {
    console.error("Gemini error:", err.message || err);
    res.status(500).json({ error: "Something went wrong with Jhusey." });
  }
});

app.listen(port, () => console.log(`Jhusey AI running on port ${port}`));
