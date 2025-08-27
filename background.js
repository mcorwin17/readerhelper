// maxwell corwin 2025
// background.js (mv3 service worker)

const SYSTEM_PROMPT = `you are a helpful reading assistant. answer questions about the provided text content concisely and accurately.

respond with a json object containing:
- answer_bullets: array of 2-4 concise bullet points
- citations: array of relevant text spans (with their span ids)
- uncertainty: number 0-1 indicating confidence (0=very confident, 1=uncertain)

keep answers brief and focused on the specific question asked.`;

const DEFAULTS = {
  provider: "openai", // "openai" | "ollama"
  model: "gpt-4o-mini",
  openaiKey: "",
  localEndpoint: "http://localhost:11434",
  localOnly: false
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "ASK_LLM") {
    handleAsk(msg.payload)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: err.message || String(err) }));
    return true; // keep the message channel open for async
  }
});

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...settings };
}

function buildPrompt(question, meta, spans) {
  const context = spans.map(s => `[${s.id}] ${s.text}`).join('\n\n');
  return `question: ${question}

page: ${meta.title || 'unknown'}
url: ${meta.url || 'unknown'}

text content:
${context}

please analyze the above text and answer the question.`;
}

async function handleAsk(payload) {
  const { question, meta, spans } = payload;
  const settings = await getSettings();

  const prompt = buildPrompt(question, meta, spans);
  const systemPrompt = SYSTEM_PROMPT;

  if (settings.localOnly && settings.provider !== "ollama") {
    settings.provider = "ollama";
  }

  if (settings.provider === "openai") {
    if (!settings.openaiKey) throw new Error("missing openai api key. set it in the extension options page.");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openaiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`openai error ${res.status}: ${t}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return safeParseJSON(content);
  }

  // local: ollama simple /api/generate (single-shot, non-streaming)
  const url = (settings.localEndpoint || DEFAULTS.localEndpoint).replace(/\/$/, "") + "/api/generate";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1", // change to your local model tag
      prompt: SYSTEM_PROMPT + "\n\n" + prompt,
      stream: false
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`ollama error ${res.status}: ${t}`);
  }

  const data = await res.json();
  return safeParseJSON(data?.response || "");
}

function safeParseJSON(s) {
  try {
    const j = JSON.parse(s);
    // basic shape guard
    if (!Array.isArray(j.answer_bullets)) j.answer_bullets = String(s).split(/\n+/).slice(0, 6);
    if (!Array.isArray(j.citations)) j.citations = [];
    if (typeof j.uncertainty !== "number") j.uncertainty = 0.5;
    return j;
  } catch (e) {
    // fallback response if json parsing fails
    return {
      answer_bullets: [String(s).substring(0, 200) + "..."],
      citations: [],
      uncertainty: 0.8
    };
  }
}