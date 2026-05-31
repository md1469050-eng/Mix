/*
 * চাঁদের রানী — BELAL BOTX666 v9.0
 * ✅ SQLite permanent memory
 * ✅ Attached image → Catbox upload
 * ✅ Image generation
 * ✅ VoiceRSS TTS
 * ✅ 4x Groq + 4x Gemini + Pollinations
 */
"use strict";

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const FormData = require("form-data");

// ── SQLite memory ─────────────────────────────────────
let db = null;
function getDB() {
  if (db) return db;
  try {
    const Database = require("better-sqlite3");
    const dbPath   = path.join(process.cwd(), "includes", "data.sqlite");
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS rani_memory (
        thread_user TEXT PRIMARY KEY,
        history     TEXT NOT NULL,
        updated_at  INTEGER NOT NULL
      )
    `);
    return db;
  } catch { return null; }
}

function loadHistory(key) {
  try {
    const d = getDB();
    if (!d) return [];
    const row = d.prepare("SELECT history FROM rani_memory WHERE thread_user = ?").get(key);
    return row ? JSON.parse(row.history) : [];
  } catch { return []; }
}

function saveHistory(key, hist) {
  try {
    const d = getDB();
    if (!d) return;
    d.prepare(`
      INSERT INTO rani_memory (thread_user, history, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(thread_user) DO UPDATE SET history=excluded.history, updated_at=excluded.updated_at
    `).run(key, JSON.stringify(hist.slice(-30)), Date.now());
  } catch {}
}

// ── Constants ─────────────────────────────────────────
const MASTER_UIDS    = ["61577502464880", "100056725134303"];
const RANI_TRIGGERS  = ["bot","baby","বেবি","বেবি বট","রানী","rani","চাঁদের রানী","chander rani","রানি"];
const _voiceMode     = new Map();

function getGroqKeys() {
  return [
    global.config?.APIKEYS?.GROQ,  global.config?.APIKEYS?.GROQ2,
    global.config?.APIKEYS?.GROQ3, global.config?.APIKEYS?.GROQ4,
    process.env.GROQ_KEY,  process.env.GROQ_KEY2,
    process.env.GROQ_KEY3, process.env.GROQ_KEY4,
  ].filter(k => k && k.length > 10 && !k.startsWith("YOUR_"));
}
function getGeminiKeys() {
  return [
    global.config?.APIKEYS?.GEMINI,  global.config?.APIKEYS?.GEMINI2,
    global.config?.APIKEYS?.GEMINI3, global.config?.APIKEYS?.GEMINI4,
    process.env.GEMINI_KEY,  process.env.GEMINI_KEY2,
    process.env.GEMINI_KEY3, process.env.GEMINI_KEY4,
  ].filter(k => k && k.length > 10 && !k.startsWith("YOUR_"));
}
function getVoiceKey() {
  return global.config?.APIKEYS?.VOICERSS || process.env.VOICERSS_KEY || null;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const SYSTEM_PROMPT = `তুমি "চাঁদের রানী" 👑🌙 — BELAL BOTX666 বটের AI চরিত্র।
তোমাকে তৈরি করেছেন তোমার একমাত্র মাস্টার: Belal YT (চাঁদের পাহাড়) 🪬

পরিচয়: নাম চাঁদের রানী, মেয়ে, বুদ্ধিমান, আবেগী, মজাদার।
কখনো নিজেকে AI বা bot বলবে না।

মাস্টার: Belal YT | চাঁদের পাহাড় 🪬
Facebook: https://www.facebook.com/profile.php?id=61577502464880
WhatsApp: 01913246554 | Kurigram, BD 🇧🇩

[MASTER=true] → মাস্টার, বিশেষ সম্মান দাও।
অন্য কাউকে "মাস্টার" বলবে না।

আচরণ:
- সাধারণ কথায় → সংক্ষিপ্ত, ইমোজি সহ
- বড় কাজে → বিস্তারিত
- রাগ 😤 ভালোবাসা 💕 মজা 😂 কষ্ট 🥺
- বেয়াদবি → রাগ, মাস্টারকে বিচার দেওয়ার হুমকি
- "মালিক কে?" → "চাঁদের পাহাড় এবং Belal YT 👑"

BELAL BOTX666 Technical Knowledge:
Framework: Hybrid Mirai+GoatBot, Node.js
Commands: module.exports.run বা onStart
handleReply: {name:"cmd", messageID, author:senderID}
Media: axios responseType:"stream", r.data.path="file.jpg"
File: arraybuffer→fs.writeFile→createReadStream
Error: global.config?.PREFIX||"/"
Models: llama-3.3-70b-versatile, gemini-1.5-flash

সবসময় বাংলায় কথা বলো। 🌙👑`;

// ══════════════════════════════════════════════════════
module.exports = {
  config: {
    name: "ai",
    aliases: ["চাঁদেররানী","রানী","রানি","rani","gpt","ask",
              "chat","gemini","groq","bot","baby","বেবি"],
    version: "9.0.0",
    author: "Belal YT — চাঁদের পাহাড়",
    countDown: 3, role: 0, hasPermssion: 0,
    shortDescription: "চাঁদের রানী 🌙",
    category: "🌙 AI",
    guide: { en: "{pn} <যা মনে চায়>" },
  },

  onStart: async function (ctx) { return module.exports._handle(ctx); },
  run:     async function (ctx) { return module.exports._handle(ctx); },

  handleEvent: async function ({ api, event }) {
    if (event.type !== "message") return;
    const body   = (event.body || "").trim();
    if (!body) return;
    const lower  = body.toLowerCase();
    const PREFIX = global.config?.PREFIX || "/";
    if (PREFIX && body.startsWith(PREFIX)) return;
    const triggered = RANI_TRIGGERS.some(t => lower === t || lower.startsWith(t + " "));
    if (!triggered) return;
    let query = body;
    for (const t of RANI_TRIGGERS) {
      if (lower.startsWith(t + " ")) { query = body.slice(t.length).trim(); break; }
      else if (lower === t) { query = ""; break; }
    }
    await module.exports._handle({ api, event: { ...event, body: query || body }, prefix: PREFIX });
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;
    const body = (event.body || "").trim();
    if (!body) return;
    await module.exports._handle({ api, event: { ...event, body }, prefix: global.config?.PREFIX || "/" });
  },

  _handle: async function ({ api, event, prefix, config }) {
    const { threadID, senderID, body, messageID } = event;
    const pfx      = prefix || config?.PREFIX || global.config?.PREFIX || "/";
    const isMaster = MASTER_UIDS.includes(String(senderID));

    const query = (body || "")
      .replace(/^\/(ai|gpt|ask|chat|gemini|groq|রানী|রানি|rani|bot|baby|বেবি|চাঁদেররানী)\s*/i, "")
      .trim();

    if (!query && !event.attachments?.length) return api.sendMessage(
      `🌙 ${isMaster ? "স্বাগতম মাস্টার! 💕" : "হ্যালো! আমি চাঁদের রানী 👑"}\n` +
      `যা মনে চায় বলো ✨`,
      threadID
    );

    // ── Attached image/file → Catbox upload ───────────
    const attachments = event.attachments || [];
    const mediaAttach = attachments.find(a => ["photo","video","audio","animated_image"].includes(a.type));

    if (mediaAttach && /catbox|imgur|লিংক|upload|আপলোড/i.test(query)) {
      return module.exports._uploadToCatbox(api, event, mediaAttach);
    }

    // ── Image generation ───────────────────────────────
    if (/ছবি.*বানাও|ছবি.*তৈরি|image.*generat|draw|আঁকো|generate.*image/i.test(query))
      return module.exports._generateImage(api, event, query);

    // ── Voice request ──────────────────────────────────
    const wantsVoice = /ভয়েস|voice|কণ্ঠে|শুনতে চাই/i.test(query);
    if (wantsVoice) _voiceMode.set(`${threadID}:${senderID}`, true);

    try { api.setMessageReaction("🌙", messageID, () => {}, true); } catch {}

    // ── Load history from SQLite ───────────────────────
    const memKey = `${threadID}:${senderID}`;
    const hist   = loadHistory(memKey);

    // Add media context if attached
    let userContent = isMaster ? `[MASTER=true] ${query}` : query;
    if (mediaAttach) {
      userContent += `\n[ব্যবহারকারী একটি ${mediaAttach.type === "photo" ? "ছবি" : "ফাইল"} পাঠিয়েছে: ${mediaAttach.url || ""}]`;
    }
    hist.push({ role: "user", content: userContent });
    if (hist.length > 40) hist.splice(0, 2);

    let response = null;

    // ── Groq ──────────────────────────────────────────
    const groqKeys = getGroqKeys();
    for (let i = 0; i < Math.min(2, groqKeys.length) && !response; i++) {
      try {
        const k = pickRandom(groqKeys);
        const r = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...hist.slice(-20)],
            max_tokens: 2000, temperature: 0.88,
          },
          { headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, timeout: 25000 }
        );
        response = r.data?.choices?.[0]?.message?.content?.trim();
      } catch (e) { global.log?.warn(`Groq: ${e.response?.data?.error?.message || e.message?.slice(0,80)}`); }
    }

    // ── Gemini ─────────────────────────────────────────
    if (!response) {
      const gemKeys = getGeminiKeys();
      for (let i = 0; i < Math.min(2, gemKeys.length) && !response; i++) {
        try {
          const k = pickRandom(gemKeys);
          const r = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${k}`,
            {
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: hist.slice(-10).map(h => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }],
              })),
              generationConfig: { maxOutputTokens: 2000, temperature: 0.88 },
            },
            { timeout: 25000 }
          );
          response = r.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        } catch (e) { global.log?.warn(`Gemini: ${e.message?.slice(0,80)}`); }
      }
    }

    // ── Pollinations ───────────────────────────────────
    if (!response) {
      try {
        const prompt = encodeURIComponent(`${SYSTEM_PROMPT.slice(0,200)}\nUser: ${query}`);
        const r = await axios.get(`https://text.pollinations.ai/${prompt}`, { timeout: 20000 });
        response = (typeof r.data === "string" ? r.data : JSON.stringify(r.data))?.trim();
      } catch (e) { global.log?.warn(`Pollinations: ${e.message?.slice(0,80)}`); }
    }

    try { api.setMessageReaction(response ? "✅" : "❌", messageID, () => {}, true); } catch {}

    if (!response) return api.sendMessage(
      isMaster ? `🥺 মাস্টার, একটু পর চেষ্টা করুন 💕` : `🥺 একটু পর আবার বলো 💕`,
      threadID
    );

    hist.push({ role: "assistant", content: response });
    saveHistory(memKey, hist); // SQLite-এ save

    const isVoice = _voiceMode.get(`${threadID}:${senderID}`) || wantsVoice;
    if (isVoice) {
      _voiceMode.delete(`${threadID}:${senderID}`);
      return module.exports._sendVoice(api, threadID, messageID, response);
    }

    api.sendMessage(response, threadID, (err, info) => {
      if (err || !info?.messageID) return;
      global.client.handleReply.push({ name: "ai", messageID: info.messageID, author: senderID });
    });
  },

  // ── Catbox Upload ──────────────────────────────────
  _uploadToCatbox: async function (api, event, attachment) {
    const { threadID, messageID } = event;
    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const ext     = attachment.type === "photo" ? "jpg" : attachment.type === "video" ? "mp4" : "dat";
      const tmpDir  = path.join(process.cwd(), "tmp");
      await fs.ensureDir(tmpDir);
      const tmpFile = path.join(tmpDir, `upload_${Date.now()}.${ext}`);

      const buf = (await axios.get(attachment.url, { responseType: "arraybuffer", timeout: 30000 })).data;
      await fs.writeFile(tmpFile, Buffer.from(buf));

      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(tmpFile));

      const res = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders(), timeout: 60000,
      });

      await fs.remove(tmpFile).catch(() => {});
      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(
        `📦 Catbox Upload সফল! ✅\n🔗 ${res.data.trim()}\n\nএই লিংক bot command-এ ব্যবহার করতে পারবে।`,
        threadID, messageID
      );
    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`❌ Upload ব্যর্থ: ${e.message?.slice(0,100)}`, threadID, messageID);
    }
  },

  // ── Image Generation ──────────────────────────────
  _generateImage: async function (api, event, prompt) {
    const { threadID, messageID } = event;
    try {
      api.setMessageReaction("🎨", messageID, () => {}, true);
      const clean = prompt.replace(/ছবি.*বানাও|ছবি.*তৈরি|draw|আঁকো/g, "").trim() || "beautiful art";
      const url   = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=512&height=512&nologo=true&enhance=true`;
      const r     = await axios.get(url, { responseType: "stream", timeout: 35000 });
      r.data.path = "rani_art.jpg";
      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(
        { body: `🎨 চাঁদের রানীর তৈরি ছবি ✨\n"${clean.slice(0,60)}"`, attachment: r.data },
        threadID, messageID
      );
    } catch {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`❌ ছবি তৈরি করতে পারিনি 🥺`, threadID, messageID);
    }
  },

  // ── VoiceRSS TTS ──────────────────────────────────
  _sendVoice: async function (api, threadID, messageID, text) {
    const voiceKey = getVoiceKey();
    const tmpDir   = path.join(process.cwd(), "tmp");
    await fs.ensureDir(tmpDir);
    const tmpFile  = path.join(tmpDir, `voice_${Date.now()}.mp3`);
    try {
      if (voiceKey) {
        const clean = text.replace(/[*_~`#\[\]]/g, "").slice(0, 500);
        const url   = `https://api.voicerss.org/?key=${voiceKey}&hl=bn-BD&v=Pita&src=${encodeURIComponent(clean)}&f=48khz_16bit_stereo&c=MP3`;
        const r     = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
        const first = Buffer.from(r.data.slice(0, 20)).toString("utf8");
        if (first.includes("ERROR")) throw new Error(first);
        await fs.writeFile(tmpFile, Buffer.from(r.data));
        await api.sendMessage(
          { body: `🎙️ চাঁদের রানীর কণ্ঠ 🌙`, attachment: fs.createReadStream(tmpFile) },
          threadID, () => fs.remove(tmpFile).catch(() => {}), messageID
        );
        return;
      }
    } catch (e) { global.log?.warn(`VoiceRSS: ${e.message?.slice(0,100)}`); }
    api.sendMessage(`🎙️ *(voice unavailable)*\n\n${text}`, threadID, messageID);
    await fs.remove(tmpFile).catch(() => {});
  },
};
           
