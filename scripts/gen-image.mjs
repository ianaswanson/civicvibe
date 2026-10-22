// Generate one image with Gemini. Key comes from the environment via op run:
//   op run --env-file=.env.op -- node scripts/gen-image.mjs <out.png> <aspect> "<prompt>" [model]
// aspect: 1:1, 3:4, 4:3, 9:16, 16:9, 21:9
import { writeFileSync } from "node:fs";

const [out, aspect = "1:1", prompt, model = "gemini-3-pro-image"] = process.argv.slice(2);
if (!out || !prompt) {
  console.error("usage: gen-image.mjs <out.png> <aspect> <prompt> [model]");
  process.exit(1);
}

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: aspect } },
    }),
  },
);
const data = await res.json();
if (data.error) {
  console.error(data.error.code, data.error.message);
  process.exit(1);
}
const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) {
  console.error("no image returned", JSON.stringify(data).slice(0, 300));
  process.exit(1);
}
writeFileSync(out, Buffer.from(part.inlineData.data, "base64"));
console.log("wrote", out);
