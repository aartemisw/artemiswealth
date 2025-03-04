const express = require("express");
const cors = require("cors");  // ✅ Add this
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: true }));  // ✅ Allow CORS

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Chatbot API Error:", error);
        res.status(500).json({ error: "Internal chatbot error", details: error.message });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Chatbot API is Running! Try POST /chat");
});

app.listen(3000, () => console.log("Chatbot running on port 3000"));
