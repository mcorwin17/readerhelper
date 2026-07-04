// maxwell corwin 2025
// lib/parse.js — pure helpers shared by the service worker, unit-testable in node

export function buildPrompt(question, meta, spans) {
  const context = spans.map(s => `[${s.id}] ${s.text}`).join('\n\n');
  return `question: ${question}

page: ${meta.title || 'unknown'}
url: ${meta.url || 'unknown'}

text content:
${context}

please analyze the above text and answer the question.`;
}

export function safeParseJSON(s) {
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
