// tests for lib/parse.js — run with: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, safeParseJSON } from "../lib/parse.js";

test("buildPrompt includes question, page meta, and span ids", () => {
  const prompt = buildPrompt(
    "what is this about?",
    { title: "Example Page", url: "https://example.com/a" },
    [
      { id: "p0", text: "first paragraph" },
      { id: "p1", text: "second paragraph" },
    ]
  );
  assert.match(prompt, /question: what is this about\?/);
  assert.match(prompt, /page: Example Page/);
  assert.match(prompt, /url: https:\/\/example\.com\/a/);
  assert.match(prompt, /\[p0\] first paragraph/);
  assert.match(prompt, /\[p1\] second paragraph/);
});

test("buildPrompt falls back to 'unknown' for missing meta", () => {
  const prompt = buildPrompt("q", {}, []);
  assert.match(prompt, /page: unknown/);
  assert.match(prompt, /url: unknown/);
});

test("safeParseJSON passes through a well-formed response", () => {
  const out = safeParseJSON(JSON.stringify({
    answer_bullets: ["a", "b"],
    citations: [{ span_id: "p0" }],
    uncertainty: 0.2,
  }));
  assert.deepEqual(out.answer_bullets, ["a", "b"]);
  assert.equal(out.citations.length, 1);
  assert.equal(out.uncertainty, 0.2);
});

test("safeParseJSON repairs valid JSON with missing fields", () => {
  const out = safeParseJSON(JSON.stringify({ answer: "not the right shape" }));
  assert.ok(Array.isArray(out.answer_bullets));
  assert.deepEqual(out.citations, []);
  assert.equal(out.uncertainty, 0.5);
});

test("safeParseJSON falls back gracefully on non-JSON model output", () => {
  const out = safeParseJSON("Sure! Here are the main points:\n- one\n- two");
  assert.equal(out.answer_bullets.length, 1);
  assert.match(out.answer_bullets[0], /Sure! Here are the main points/);
  assert.deepEqual(out.citations, []);
  assert.equal(out.uncertainty, 0.8);
});

test("safeParseJSON truncates oversized fallback output to 200 chars", () => {
  const out = safeParseJSON("x".repeat(5000));
  assert.equal(out.answer_bullets[0].length, 203); // 200 + "..."
});
