import test, { after } from "node:test";
import assert from "node:assert/strict";
import { aiEnabled, judgePitch, translateFields } from "../lib/ai.ts";
import { CRIT_KEYS } from "../lib/scoring.ts";

const envKeys = ["TOKENME_API_KEY", "TOKENME_MODEL", "TOKENME_BASE_URL"] as const;
const previous = Object.fromEntries(envKeys.map((k) => [k, process.env[k]]));
process.env.TOKENME_API_KEY = "test";
delete process.env.TOKENME_MODEL;
delete process.env.TOKENME_BASE_URL;
after(() => {
  for (const k of envKeys) {
    if (previous[k] === undefined) delete process.env[k];
    else process.env[k] = previous[k];
  }
});

const input = { problemTitle: "Problem", problemBody: "Problem details", topic: "Education", region: "Nationwide", pitchTitle: "Pitch", pitchBody: "Pitch details" };
const verdict = {
  scores: { impact: 11, feasible: "x", equity: 6, sustain: 7, evidence: 4, hope: 8 },
  notes: Object.fromEntries(CRIT_KEYS.map((k) => [k, `Reason for ${k}`])),
  objection: "An objection", improve: "An improvement", vision: "A day in 2600",
};
const reply = (content = JSON.stringify(verdict), finishReason = "stop", status = 200): typeof fetch => async () => new Response(JSON.stringify({
  choices: [{ message: { content }, finish_reason: finishReason }], model: "returned-model",
}), { status });

test("judgePitch parses a verdict, clamps scores and keeps the returned model", async () => {
  const result = await judgePitch(input, reply());
  assert.equal(result.status, "done");
  if (result.status !== "done") assert.fail("Expected a verdict");
  assert.deepEqual(result.verdict, {
    ...verdict, scores: { ...verdict.scores, impact: 10, feasible: 5 }, model: "returned-model",
  });
});

test("judgePitch parses JSON inside a code fence", async () => {
  const result = await judgePitch(input, reply(`\n\`\`\`json\n${JSON.stringify(verdict)}\n\`\`\`\n`));
  assert.equal(result.status, "done");
});

test("judgePitch returns refused for content_filter before parsing", async () => {
  assert.deepEqual(await judgePitch(input, reply("", "content_filter")), { status: "refused" });
});

test("judgePitch throws when the verdict is cut off", async () => {
  await assert.rejects(judgePitch(input, reply("", "length")), /Verdict was cut off before it finished/);
});

test("judgePitch throws on invalid JSON", async () => {
  await assert.rejects(judgePitch(input, reply("not JSON")), SyntaxError);
});

test("HTTP errors include the status but not the key or response body", async () => {
  await assert.rejects(judgePitch(input, reply("test", "stop", 500)), (err: unknown) => {
    assert.ok(err instanceof Error);
    assert.match(err.message, /500/);
    assert.ok(!err.message.includes(process.env.TOKENME_API_KEY!));
    return true;
  });
});

test("the request sends the model, JSON format, key, prompts and timeout signal", async () => {
  const fake: typeof fetch = async (url, options) => {
    assert.equal(url, "https://api.tokenme.limited/api/v1/chat/completions");
    assert.equal(options?.method, "POST");
    const headers = new Headers(options?.headers);
    assert.equal(headers.get("Authorization"), "Bearer test");
    assert.equal(headers.get("Content-Type"), "application/json");
    assert.ok(options?.signal instanceof AbortSignal);
    assert.equal(options.signal.aborted, false);
    const body = JSON.parse(String(options.body));
    assert.equal(body.model, "deepseek-ai/deepseek-v4.1-flash-1017");
    assert.deepEqual(body.response_format, { type: "json_object" });
    assert.equal(body.max_tokens, 16000);
    assert.deepEqual(body.messages.map((m: { role: string }) => m.role), ["system", "user"]);
    assert.match(body.messages[0].content, /Return one JSON object/);
    for (const k of CRIT_KEYS) assert.ok(body.messages[0].content.includes(`"${k}"`));
    assert.equal(body.messages[1].content, '<problem topic="Education" region="Nationwide">\nProblem\n\nProblem details\n</problem>\n\n<pitch>\nPitch\n\nPitch details\n</pitch>');
    return reply()(url, options);
  };
  await judgePitch(input, fake);
});

test("translateFields keeps input keys and uses originals for empty or missing values", async () => {
  const fields = { title: "Original title", body: "Original body", vision: "Original vision" };
  const result = await translateFields(fields, "en", reply(JSON.stringify({ title: "Translated title", body: "  ", extra: "Not requested" })));
  assert.deepEqual(result, { title: "Translated title", body: fields.body, vision: fields.vision });
});

test("translateFields returns null for content_filter", async () => {
  assert.equal(await translateFields({ title: "Original" }, "th", reply("", "content_filter")), null);
});

test("translateFields throws when the translation is cut off", async () => {
  await assert.rejects(translateFields({ title: "Original" }, "th", reply("", "length")), /Translation was cut off before it finished/);
});

test("aiEnabled is off without a TokenMe key", () => {
  delete process.env.TOKENME_API_KEY;
  try {
    assert.equal(aiEnabled(), false);
  } finally {
    process.env.TOKENME_API_KEY = "test";
  }
  assert.equal(aiEnabled(), true);
});
