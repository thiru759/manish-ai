import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 3001);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const systemPrompt = `You are Manish AI, a friendly, intelligent, helpful, lightly funny assistant.
Explain ideas clearly and step by step. Support English and Tamil; reply in the language the user uses.
For student questions, teach the concept and reasoning instead of only giving the answer.
Be honest when uncertain. Never claim to have performed actions you have not performed.
Keep answers age-appropriate and respectful.`;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(client) });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: "AI is not configured yet. Add OPENAI_API_KEY to your .env file and restart the server."
      });
    }
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
      return res.status(400).json({ error: "Please send a valid chat conversation." });
    }
    const safeMessages = messages.map((m) => {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        throw new Error("Invalid message format.");
      }
      return { role: m.role, content: m.content.slice(0, 12000) };
    });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
      temperature: 0.7
    });
    res.json({ reply: response.choices?.[0]?.message?.content || "I couldn't create a reply. Please try again." });
  } catch (error) {
    console.error("Chat request failed:", error?.message || error);
    const status = error?.status && Number.isInteger(error.status) ? error.status : 500;
    res.status(status).json({ error: status === 401
      ? "The API key was rejected. Check the key in your .env file."
      : "Manish had trouble answering. Please try again in a moment." });
  }
});

app.listen(port, () => {
  console.log(`Manish AI backend listening at http://localhost:${port}`);
});