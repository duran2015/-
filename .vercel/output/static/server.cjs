var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/aiGuard.ts
function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isOptionalStringWithin(value, maximumLength) {
  return value === void 0 || typeof value === "string" && Array.from(value).length <= maximumLength;
}
function validateSessionSummaryBody(body) {
  if (!isJsonObject(body)) {
    return { ok: false, errors: ["request body must be a JSON object"] };
  }
  const errors = [];
  if (!isOptionalStringWithin(body.clientName, 100)) {
    errors.push("clientName must be a string with at most 100 characters");
  }
  if (!isOptionalStringWithin(body.rawNotes, 1e4)) {
    errors.push("rawNotes must be a string with at most 10000 characters");
  }
  if (!isOptionalStringWithin(body.sessionTopic, 200)) {
    errors.push("sessionTopic must be a string with at most 200 characters");
  }
  if (body.sessionNumber !== void 0 && (!Number.isInteger(body.sessionNumber) || Number(body.sessionNumber) < 1 || Number(body.sessionNumber) > 999)) {
    errors.push("sessionNumber must be an integer from 1 through 999");
  }
  if (errors.length > 0) return { ok: false, errors };
  const value = {};
  if (body.clientName !== void 0) value.clientName = body.clientName;
  if (body.rawNotes !== void 0) value.rawNotes = body.rawNotes;
  if (body.sessionTopic !== void 0) value.sessionTopic = body.sessionTopic;
  if (body.sessionNumber !== void 0) value.sessionNumber = body.sessionNumber;
  return { ok: true, value };
}
function validateQuoteBody(body) {
  if (!isJsonObject(body)) {
    return { ok: false, errors: ["request body must be a JSON object"] };
  }
  const errors = [];
  if (!isOptionalStringWithin(body.topic, 500)) {
    errors.push("topic must be a string with at most 500 characters");
  }
  if (!isOptionalStringWithin(body.consultantName, 100)) {
    errors.push("consultantName must be a string with at most 100 characters");
  }
  if (errors.length > 0) return { ok: false, errors };
  const value = {};
  if (body.topic !== void 0) value.topic = body.topic;
  if (body.consultantName !== void 0) value.consultantName = body.consultantName;
  return { ok: true, value };
}
var FixedWindowRateLimiter = class {
  constructor(maximumRequests, windowMilliseconds) {
    this.maximumRequests = maximumRequests;
    this.windowMilliseconds = windowMilliseconds;
    this.entries = /* @__PURE__ */ new Map();
    if (!Number.isInteger(maximumRequests) || maximumRequests < 1) {
      throw new Error("maximumRequests must be a positive integer");
    }
    if (!Number.isFinite(windowMilliseconds) || windowMilliseconds <= 0) {
      throw new Error("windowMilliseconds must be positive");
    }
  }
  check(key, now = Date.now()) {
    for (const [storedKey, entry2] of this.entries) {
      if (now - entry2.windowStartedAt >= this.windowMilliseconds) {
        this.entries.delete(storedKey);
      }
    }
    const entry = this.entries.get(key);
    if (!entry) {
      this.entries.set(key, { count: 1, windowStartedAt: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (entry.count >= this.maximumRequests) {
      const remainingMilliseconds = this.windowMilliseconds - (now - entry.windowStartedAt);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(remainingMilliseconds / 1e3))
      };
    }
    entry.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
};

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT || 3001);
app.use(import_express.default.json({ limit: "32kb" }));
app.use(((error, _req, res, next) => {
  const requestError = error;
  if (requestError.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }
  if (requestError instanceof SyntaxError && requestError.status === 400) {
    return res.status(400).json({ error: "Malformed JSON" });
  }
  return next(error);
}));
var aiRateLimiter = new FixedWindowRateLimiter(10, 6e4);
app.use("/api/ai", (req, res, next) => {
  const result = aiRateLimiter.check(req.ip || req.socket.remoteAddress || "unknown");
  if (!result.allowed) {
    res.setHeader("Retry-After", String(result.retryAfterSeconds));
    return res.status(429).json({ error: "Too many AI requests" });
  }
  return next();
});
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/ai/session-summary", async (req, res) => {
  try {
    const validation = validateSessionSummaryBody(req.body);
    if (validation.ok === false) {
      return res.status(400).json({ error: "Invalid request", details: validation.errors });
    }
    const { clientName, rawNotes, sessionTopic, sessionNumber } = validation.value;
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u4E14\u6E29\u6696\u7684\u5FC3\u7406\u54A8\u8BE2\u5E08\u52A9\u624B\u3002\u8BF7\u6839\u636E\u54A8\u8BE2\u5E08\u5728\u7B2C ${sessionNumber || 1} \u6B21\u54A8\u8BE2\u4E2D\u8BB0\u5F55\u7684\u8349\u7A3F\u4FE1\u606F\uFF0C\u6574\u7406\u4E00\u4EFD\u7ED3\u6784\u4E25\u8C28\u3001\u5BCC\u6709\u5171\u60C5\u529B\u7684\u3010\u54A8\u8BE2\u7ED3\u6848\u5C0F\u7ED3\u3011\u3002

\u6765\u8BBF\u8005\uFF1A${clientName || "\u6765\u8BBF\u8005"}
\u54A8\u8BE2\u4E3B\u9898\uFF1A${sessionTopic || "\u60C5\u7EEA\u758F\u5BFC"}
\u54A8\u8BE2\u5E08\u968F\u624B\u8BB0\u5F55\uFF1A${rawNotes || "\u804A\u5230\u4E86\u5DE5\u4F5C\u538B\u529B\u3001\u5931\u7720\u60C5\u51B5\u3001\u4E0E\u4E0A\u53F8\u6C9F\u901A\u969C\u788D\u3002\u60C5\u7EEA\u6709\u6240\u91CA\u653E\u3002"}

\u8BF7\u8F93\u51FA JSON \u683C\u5F0F\uFF08\u4E25\u683C\u9075\u5B88 JSON \u8BED\u6CD5\uFF09\uFF1A
{
  "clientMood": "\u60C5\u7EEA\u72B6\u6001\u7B80\u8FF0\uFF08\u4F8B\u5982\uFF1A\u521D\u6BB5\u7126\u8651\u4F34\u6291\u90C1\uFF0C\u4E2D\u540E\u6BB5\u547C\u5438\u653E\u7F13\u3001\u60C5\u7EEA\u6E10\u8D8B\u5E73\u7A33\uFF09",
  "mainComplaint": "\u4E3B\u8BC9\u4E0E\u6838\u5FC3\u8BAE\u9898\u6982\u62EC\uFF082-3\u53E5\uFF09",
  "interventions": ["\u4F7F\u7528\u7684\u6280\u672F/\u5E72\u9884\u7B56\u75651", "\u5E72\u9884\u7B56\u75652", "\u5E72\u9884\u7B56\u75653"],
  "insights": "\u6765\u8BBF\u8005\u89C9\u5BDF\u4E0E\u7A81\u7834",
  "homework": "\u8BFE\u540E\u89C9\u5BDF\u7EC3\u4E60/\u5BB6\u5EAD\u4F5C\u4E1A\u5EFA\u8BAE",
  "nextPlan": "\u4E0B\u4E00\u6B21\u54A8\u8BE2\u65B9\u5411\u5EFA\u8BAE"
}`
      });
      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.json({ success: true, summary: JSON.parse(jsonMatch[0]) });
      }
    }
    res.json({
      success: true,
      summary: {
        clientMood: "\u4F1A\u8C08\u524D\u534A\u6BB5\u4F34\u6709\u660E\u663E\u8EAF\u4F53\u5316\u7D27\u7EF7\uFF08\u80A9\u9888\u53D1\u7D27\uFF09\uFF0C\u4F34\u968F\u5BF9\u7B54\u8282\u594F\u52A0\u5FEB\uFF1B\u540E\u534A\u6BB5\u901A\u8FC7\u547C\u5438\u7EC3\u4E60\uFF0C\u60C5\u7EEA\u964D\u6E29\u81F3 4/10 \u7A33\u5B9A\u6C34\u5E73\u3002",
        mainComplaint: `\u6765\u8BBF\u8005 ${clientName || "\u6765\u8BBF\u8005"} \u4E3B\u8981\u56F4\u7ED5\u3010${sessionTopic || "\u804C\u573A\u7126\u8651\u4E0E\u4EBA\u9645\u6C9F\u901A"}\u3011\u5C55\u5F00\uFF0C\u8868\u8FBE\u4E86\u8FD1\u671F\u5728\u5DE5\u4F5C\u51B3\u7B56\u4E2D\u7684\u4E0D\u786E\u5B9A\u611F\u4E0E\u5BF9\u8D1F\u9762\u8BC4\u4EF7\u7684\u8FC7\u5EA6\u62C5\u5FE7\u3002`,
        interventions: [
          "\u5E94\u7528\u4EBA\u672C\u4E3B\u4E49\u5171\u60C5\u6280\u672F\uFF0C\u65E0\u6761\u4EF6\u79EF\u6781\u5173\u6CE8\u5E76\u786E\u8BA4\u5176\u60C5\u7EEA\u5408\u7406\u6027",
          "\u5F15\u5BFC\u505A 4-7-8 \u8179\u5F0F\u547C\u5438\u8EAF\u4F53\u653E\u677E\uFF0C\u89C2\u5BDF\u8EAF\u4F53\u7D27\u7EF7\u90E8\u4F4D",
          "\u91C7\u7528 CBT \u8BA4\u77E5\u91CD\u5EFA\uFF0C\u8BC6\u522B\u201C\u975E\u9ED1\u5373\u767D\u201D\u7684\u707E\u96BE\u5316\u8BA4\u77E5\u601D\u7EF4"
        ],
        insights: "\u6765\u8BBF\u8005\u9996\u6B21\u610F\u8BC6\u5230\u201C\u5FC5\u987B\u5B8C\u7F8E\u201D\u7684\u8981\u6C42\u6E90\u4E8E\u7AE5\u5E74\u671F\u5BF9\u8BA4\u53EF\u7684\u6E34\u671B\uFF0C\u5B66\u4F1A\u5EFA\u7ACB\u5FC3\u7406\u8FB9\u754C\u3002",
        homework: "\u6BCF\u65E5\u8BB0\u5F55 1 \u6B21\u3010\u60C5\u7EEA\u89E6\u53D1\u4E8B\u4EF6\u70B9\u4E0E\u8EAB\u4F53\u611F\u53D7\u3011\uFF0C\u4E0B\u6B21\u5E26\u56DE\u8BA8\u8BBA\u3002",
        nextPlan: "\u5DE9\u56FA\u81EA\u6211\u5173\u6000\u4E60\u60EF\uFF0C\u6DF1\u5165\u63A2\u7D22\u4EB2\u5BC6\u5173\u7CFB/\u804C\u573A\u4E2D\u7684\u8FB9\u754C\u5EFA\u7ACB\u3002"
      }
    });
  } catch (error) {
    console.error("Error generating session summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});
app.post("/api/ai/generate-quote", async (req, res) => {
  try {
    const validation = validateQuoteBody(req.body);
    if (validation.ok === false) {
      return res.status(400).json({ error: "Invalid request", details: validation.errors });
    }
    const { topic, consultantName } = validation.value;
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `\u8BF7\u4E3A\u5FC3\u7406\u54A8\u8BE2\u5E08 ${consultantName || "\u54A8\u8BE2\u5E08"} \u751F\u6210 3 \u53E5\u6E29\u6696\u3001\u6CBB\u6108\u3001\u5177\u6709\u793E\u4EA4\u88C2\u53D8\u4F20\u64AD\u529B\u7684\u3010\u670B\u53CB\u5708\u5FC3\u7406\u5B66\u91D1\u53E5\u3011\u3002
\u4E3B\u9898\u65B9\u5411\uFF1A${topic || "\u5141\u8BB8\u81EA\u5DF1\u4E0D\u5B8C\u7F8E/\u7F13\u89E3\u7126\u8651/\u4EB2\u5BC6\u5173\u7CFB\u8FB9\u754C/\u81EA\u6211\u5173\u6000"}

\u8F93\u51FA JSON \u683C\u5F0F\uFF1A
{
  "quotes": [
    { "title": "\u77ED\u6807\u98981", "quote": "\u6E29\u6696\u91D1\u53E5\u5185\u5BB91", "tag": "\u4E3B\u9898\u6807\u7B7E1" },
    { "title": "\u77ED\u6807\u98982", "quote": "\u6E29\u6696\u91D1\u53E5\u5185\u5BB92", "tag": "\u4E3B\u9898\u6807\u7B7E2" },
    { "title": "\u77ED\u6807\u98983", "quote": "\u6E29\u6696\u91D1\u53E5\u5185\u5BB93", "tag": "\u4E3B\u9898\u6807\u7B7E3" }
  ]
}`
      });
      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.json({ success: true, data: JSON.parse(jsonMatch[0]) });
      }
    }
    res.json({
      success: true,
      data: {
        quotes: [
          {
            title: "\u5141\u8BB8\u60C5\u7EEA\u5982\u4E91\u98D8\u8FC7",
            quote: "\u60C5\u7EEA\u4E0D\u662F\u9700\u8981\u88AB\u89E3\u51B3\u7684\u654C\u4EBA\uFF0C\u800C\u662F\u5185\u5FC3\u7406\u6240\u5F53\u7136\u7684\u4FE1\u4F7F\u3002\u5141\u8BB8\u81EA\u5DF1\u60B2\u4F24\uFF0C\u5C31\u50CF\u5141\u8BB8\u9634\u96E8\u81EA\u7136\u843D\u4E0B\u3002",
            tag: "\u60C5\u7EEA\u63A5\u7EB3"
          },
          {
            title: "\u6536\u56DE\u5411\u5916\u7D22\u6C42\u7684\u76EE\u5149",
            quote: "\u6700\u6DF1\u6C89\u7684\u5173\u6000\uFF0C\u5F80\u5F80\u6765\u81EA\u4F60\u7B2C\u4E00\u6B21\u5BF9\u81EA\u5DF1\u8BF4\uFF1A\u5373\u4F7F\u4ECA\u5929\u4EC0\u4E48\u90FD\u6CA1\u505A\u597D\uFF0C\u6211\u4E5F\u503C\u5F97\u88AB\u6E29\u67D4\u5BF9\u5F85\u3002",
            tag: "\u81EA\u6211\u5173\u6000"
          },
          {
            title: "\u6E29\u67D4\u800C\u575A\u5B9A\u7684\u8FB9\u754C",
            quote: "\u62D2\u7EDD\u522B\u4EBA\u5E76\u4E0D\u610F\u5473\u7740\u4F60\u51B7\u6F20\uFF0C\u800C\u662F\u4F60\u5728\u4E3A\u81EA\u5DF1\u7684\u5FC3\u7406\u80FD\u91CF\u7B51\u8D77\u4E00\u5EA7\u6E29\u6696\u7684\u82B1\u56ED\u3002",
            tag: "\u8FB9\u754C\u63A2\u7D22"
          }
        ]
      }
    });
  } catch (error) {
    console.error("Error generating quote:", error);
    res.status(500).json({ error: "Failed to generate quote" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : void 0
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
