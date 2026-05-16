const GENERATE_MODEL = process.env.GEMINI_GENERATE_MODEL || "gemini-2.5-flash";
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

function getGeminiKey() {
  return process.env.GEMINI_API_KEY || "";
}

function geminiUrl(model, action) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}`;
}

export function hasGeminiKey() {
  return Boolean(getGeminiKey());
}

export async function generateText(prompt, { json = false, temperature = 0.35 } = {}) {
  const key = getGeminiKey();

  if (!key) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await fetch(geminiUrl(GENERATE_MODEL, "generateContent"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        responseMimeType: json ? "application/json" : "text/plain",
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Gemini request failed with ${response.status}`);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export async function generateJson(prompt) {
  const text = await generateText(prompt, { json: true });
  return parseJsonResponse(text);
}

export async function embedText(text, taskType = "RETRIEVAL_DOCUMENT") {
  const key = getGeminiKey();

  if (!key) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await fetch(geminiUrl(EMBEDDING_MODEL, "embedContent"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: text.slice(0, 9000) }] },
      taskType,
      output_dimensionality: EMBEDDING_DIMENSIONS,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Gemini embedding failed with ${response.status}`);
  }

  const values = payload?.embedding?.values;
  if (!Array.isArray(values) || values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error("Gemini returned an invalid embedding");
  }

  return normalizeVector(values);
}

export async function embedQuery(text) {
  return embedText(text, "RETRIEVAL_QUERY");
}

export function parseJsonResponse(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function normalizeVector(values) {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) {
    return values;
  }

  return values.map((value) => value / magnitude);
}
