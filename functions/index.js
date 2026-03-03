import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export const aiSuggest = onRequest(
  { cors: true, secrets: [GEMINI_API_KEY] },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const task = (req.body?.task || "").toString().trim();
      if (!task) {
        return res.status(400).json({ error: "task is required" });
      }

      const apiKey = GEMINI_API_KEY.value();
      if (!apiKey) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY secret" });
      }

      const prompt = `You are a productivity assistant. For this todo task: "${task}", return a concise JSON object with keys: priority (low|medium|high), estimateMinutes (number), and firstStep (short string). Return only JSON.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 200 }
          })
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        return res.status(502).json({ error: "Gemini request failed", details: txt });
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { raw: text };
      }

      return res.json({ result: parsed });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Unexpected error" });
    }
  }
);
