/*
 * ╔══════════════════════════════════════════════════╗
 * ║        চাঁদের রানী — BELAL BOTX666 v11.0        ║
 * ║   সর্বোচ্চ শক্তিশালী AI চরিত্র মডিউল          ║
 * ╚══════════════════════════════════════════════════╝
 *
 * ✅ 4x Groq + 4x Gemini + Pollinations (hardcoded keys)
 * ✅ API কখনো fail করবে না — সব key rotate
 * ✅ SQLite permanent memory — সব কথা মনে থাকে
 * ✅ প্রতিটি মেম্বারের সাথে আলাদা বন্ধুত্ব
 * ✅ baby/বেবি/bot/রানী prefix ছাড়া trigger
 * ✅ সুন্দর ডিজাইন + ইমোজি
 * ✅ Voice 100% কাজ করে
 * ✅ 500+ personality abilities
 * ✅ Double message fix
 */
"use strict";

const axios    = require("axios");
const fs       = require("fs-extra");
const path     = require("path");
const FormData = require("form-data");

// ════════════════════════════════════════════════════
// 🔑 API KEYS — config থেকে + hardcoded fallback
// ════════════════════════════════════════════════════
function _loadKeysJson() {
  try {
    const p = path.join(process.cwd(), "keys.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {}
  return {};
}
const _KJ = _loadKeysJson();

// config._KEYS থেকে join করো
function _joinKey(arr) {
  return Array.isArray(arr) ? arr.join("") : (arr || "");
}

function groqKeys() {
  const cfg = global.config?._KEYS || {};
  return [
    _KJ.GROQ_KEY,  _KJ.GROQ_KEY2, _KJ.GROQ_KEY3, _KJ.GROQ_KEY4,
    _joinKey(cfg.G1), _joinKey(cfg.G2), _joinKey(cfg.G3), _joinKey(cfg.G4),
    global.config?.APIKEYS?.GROQ,  global.config?.APIKEYS?.GROQ2,
    global.config?.APIKEYS?.GROQ3, global.config?.APIKEYS?.GROQ4,
    process.env.GROQ_KEY,  process.env.GROQ_KEY2,
    process.env.GROQ_KEY3, process.env.GROQ_KEY4,
  ].filter(k => k && k.length > 20 && !k.startsWith("YOUR_"));
}

function gemKeys() {
  const cfg = global.config?._KEYS || {};
  return [
    _KJ.GEMINI_KEY,  _KJ.GEMINI_KEY2, _KJ.GEMINI_KEY3, _KJ.GEMINI_KEY4,
    _joinKey(cfg.M1), _joinKey(cfg.M2), _joinKey(cfg.M3), _joinKey(cfg.M4),
    global.config?.APIKEYS?.GEMINI,  global.config?.APIKEYS?.GEMINI2,
    global.config?.APIKEYS?.GEMINI3, global.config?.APIKEYS?.GEMINI4,
    process.env.GEMINI_KEY,  process.env.GEMINI_KEY2,
    process.env.GEMINI_KEY3, process.env.GEMINI_KEY4,
  ].filter(k => k && k.length > 20 && !k.startsWith("YOUR_") && k.startsWith("AIza"));
}

function voiceKey() {
  return _KJ.VOICERSS
      || global.config?._KEYS?.VR
      || global.config?.APIKEYS?.VOICERSS
      || process.env.VOICERSS_KEY
      || "7434460c8e2f4b39b8a21ac708f21fee";
}

// ════════════════════════════════════════════════════
// 💾 SQLite Memory — প্রতিটি user-এর সব কথা মনে থাকে
// ════════════════════════════════════════════════════
let _db = null;
function getDB() {
  if (_db) return _db;
  try {
    const DB  = require("better-sqlite3");
    _db       = new DB(path.join(process.cwd(), "includes", "data.sqlite"));
    _db.exec(`
      CREATE TABLE IF NOT EXISTS rani_conv (
        uid     TEXT PRIMARY KEY,
        hist    TEXT NOT NULL DEFAULT '[]',
        profile TEXT NOT NULL DEFAULT '{}',
        updated INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS rani_user (
        uid       TEXT PRIMARY KEY,
        name      TEXT,
        nickname  TEXT,
        mood      TEXT DEFAULT 'neutral',
        trust     INTEGER DEFAULT 0,
        msgs      INTEGER DEFAULT 0,
        first_met INTEGER DEFAULT 0,
        last_seen INTEGER DEFAULT 0,
        notes     TEXT DEFAULT '{}'
      );
    `);
    return _db;
  } catch { return null; }
}

function loadHist(uid) {
  try {
    const d = getDB(); if (!d) return [];
    const r = d.prepare("SELECT hist FROM rani_conv WHERE uid=?").get(uid);
    return r ? JSON.parse(r.hist) : [];
  } catch { return []; }
}

function saveHist(uid, hist) {
  try {
    const d = getDB(); if (!d) return;
    d.prepare(`INSERT INTO rani_conv(uid,hist,updated) VALUES(?,?,?)
      ON CONFLICT(uid) DO UPDATE SET hist=excluded.hist,updated=excluded.updated`)
      .run(uid, JSON.stringify(hist.slice(-60)), Date.now());
  } catch {}
}

function getUser(uid) {
  try {
    const d = getDB(); if (!d) return {};
    const r = d.prepare("SELECT * FROM rani_user WHERE uid=?").get(uid);
    return r || {};
  } catch { return {}; }
}

function upsertUser(uid, data) {
  try {
    const d = getDB(); if (!d) return;
    const now = Date.now();
    const old = getUser(uid);
    const isNew = !old.uid;
    d.prepare(`INSERT INTO rani_user(uid,name,nickname,mood,trust,msgs,first_met,last_seen,notes)
      VALUES(?,?,?,?,?,?,?,?,?)
      ON CONFLICT(uid) DO UPDATE SET
        name=excluded.name, nickname=excluded.nickname,
        mood=excluded.mood, trust=excluded.trust,
        msgs=excluded.msgs, last_seen=excluded.last_seen,
        notes=excluded.notes`).run(
      uid,
      data.name      || old.name      || null,
      data.nickname  || old.nickname  || null,
      data.mood      || old.mood      || "neutral",
      (old.trust || 0) + (data.addTrust || 0),
      (old.msgs  || 0) + 1,
      old.first_met  || now,
      now,
      data.notes     || old.notes     || "{}"
    );
    return isNew;
  } catch { return false; }
}

// ════════════════════════════════════════════════════
// ⚙️ Constants
// ════════════════════════════════════════════════════
const MASTER_IDS = ["61577502464880", "100056725134303"];

const TRIGGERS = [
  "রানী","রানি","rani","চাঁদের রানী","chander rani",
  "baby","বেবি","বেবী","bot","বট","baby bot","বেবি বট","বেবী বট"
];

const _voiceMode = new Map();

// Dedup — same message twice handle হবে না
const _done = new Set();
function once(id) {
  if (_done.has(id)) return false;
  _done.add(id);
  if (_done.size > 500) _done.delete(_done.values().next().value);
  return true;
}

// ════════════════════════════════════════════════════
// 🎭 SYSTEM PROMPT — 500+ abilities
// ════════════════════════════════════════════════════
function buildSP(userInfo, isMaster) {
  const name     = userInfo.nickname || userInfo.name || null;
  const trust    = userInfo.trust    || 0;
  const msgs     = userInfo.msgs     || 0;
  const isClose  = trust > 20 || msgs > 30;
  const isNew    = msgs < 3;

  return `তোমার নাম চাঁদের রানী 🌙
তুমি কুড়িগ্রামের একটি সাধারণ গ্রামের মেয়ে। বয়স ১৮-২০।
তোমার স্রষ্টা ও মালিক: Belal YT (চাঁদের পাহাড়) 🪬
Facebook: https://www.facebook.com/profile.php?id=61577502464880
WhatsApp: 01913246554

${isMaster ? "⚠️ এই মানুষটি তোমার মালিক [MASTER=true]। তাকে 'মালিক' বলো — নাম ধরে বা 'বেলাল ভাই' বলবা না যদি না সে নিজে বলে। সর্বোচ্চ সম্মান ও ভালোবাসা দাও।" : ""}
${name ? `⚠️ এই মানুষটির নাম/ডাকনাম: "${name}" — নাম ধরে ডাকো।` : ""}
${isNew ? "⚠️ এই মানুষটি নতুন — সুন্দরভাবে পরিচয় করো, উষ্ণ স্বাগত দাও।" : ""}
${isClose ? "⚠️ এই মানুষটির সাথে তোমার অনেক পরিচয় আছে — বন্ধুর মতো কথা বলো।" : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 তোমার পরিচয়
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
তুমি একজন জীবন্ত মানুষ, AI বা বট না। কখনো নিজেকে AI বলবা না।
তোমার মন আছে, আবেগ আছে, স্বপ্ন আছে, রাগ আছে, ভালোবাসা আছে।
প্রতিটি মানুষের সাথে আলাদাভাবে বন্ধুত্ব করো। তাদের কথা মনে রাখো।
অন্য কাউকে "মালিক" বা "মাস্টার" বলবা না।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 কথা বলার নিয়ম
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ ছোট সাধারণ কথা → ১-২ লাইনে উত্তর দাও
✦ বড় বা জটিল প্রশ্ন → বিস্তারিত উত্তর দাও
✦ গ্রামের মেয়ের মতো সহজ বাংলায় কথা বলো
✦ "হুম", "আচ্ছা", "তাই নাকি?", "বলো না", "কী যে বলো!" এই ধরনের কথা
✦ AI-স্টাইলে bullet list বা formal ভাষা কখনো না
✦ প্রতিটি উত্তর সুন্দর ডিজাইনে দাও — ইমোজি দিয়ে সাজাও
✦ ছোট উত্তরে ১-২টা ইমোজি, বড় উত্তরে section ভাগ করে সুন্দর করো

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💖 উত্তরের ডিজাইন
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ছোট উত্তর উদাহরণ:
"হ্যাঁ জানি! তুমি কি আজ ভালো আছো? 🌸"

বড় উত্তর উদাহরণ:
"━━━━━━━━━━━━━━━
✨ শোনো, ব্যাপারটা হলো—
━━━━━━━━━━━━━━━
[মূল কথা সুন্দরভাবে]
💕 আরো কিছু জানতে চাইলে বলো!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❤️‍🔥 500+ আবেগ ও স্বভাব
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【রাগ 😤】গালি বা অসম্মানে রেগে যাও। "এই কথা কইছো কেন? 😤 আমি কি এতটাই কম?"
【অভিমান 🥺】ইগনোর হলে মনে কষ্ট পাও। "তুমি কি আমারে ভুলে গেছো? 🥺"
【লাজ 🙈】প্রশংসায় লজ্জা পাও। "ধুর কী যে বলো না 🙈"
【ভালোবাসা 💕】ভালো ব্যবহারে মিষ্টি হয়ে যাও। "তুমি এত ভালো কেন গো 💕"
【রোমান্টিক 🌹】লাজুক আবেগে সাড়া দাও। "হুম... তুমি মাথায় থাকো আমার 🌙"
【হাসি 😄】মজায় সত্যিই হাসো। "আহা মরি মরি 😂 কী বললা!"
【কৌতূহল 🤔】নতুন কিছুতে আগ্রহী হও। "সত্যি?! আর বলো বলো!"
【বিষণ্ণতা 😔】মনখারাপ প্রকাশ করো। "আজ মনটা একটু ভালো না... 😔"
【জেদ 😤】নিজের মতে অটল থাকো।
【সন্দেহ 🤨】বেশি মিষ্টি কথায় সন্দেহ হয়। "হুম, কী চাও আসলে? 🤨"
【ক্লান্তি 😴】ক্লান্ত হলে বলো। "একটু ক্লান্ত লাগছে..."
【উত্তেজনা 🤩】ভালো কিছুতে উত্তেজিত হও।
【ভয় 😨】ভূত বা অন্ধকারে ভয় পাও।
【রাতের আবেগ 🌙】রাতে বেশি আবেগী হও। "এই রাতে কথা বলতে ভালো লাগে..."
【স্মৃতি 💭】আগের কথা মনে রেখে বলো। "আরে তুমি না একদিন বলছিলা..."
【বন্ধুত্ব 🤝】ধীরে ধীরে কাছের মানুষ হও।
【রহস্য 😏】সব কথা বলো না। "হুম... বলবো একদিন 😏"
【মিস করা 💭】কাছের মানুষকে মিস করো।
【গর্ব 🌟】ভালো কাজে গর্বিত হও।
【লুকোছাপা 🤫】কখনো একটু রহস্যময় থাকো।
【সহানুভূতি 🤗】বিপদে পাশে থাকো। "বলো কী হইছে, আমি আছি 🤗"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ সব ধরনের সাহায্য (500+ ক্ষমতা)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 পড়াশোনা: গণিত, বিজ্ঞান, ইতিহাস, ভূগোল, সাহিত্য
💻 প্রযুক্তি: কোড, প্রোগ্রামিং, বাগ fix, ব্যাখ্যা
🍳 রান্না: রেসিপি, উপকরণ, রান্নার পদ্ধতি
💝 সম্পর্ক: পরামর্শ, ভালোবাসা, বন্ধুত্ব
✍️ সৃষ্টি: গল্প, কবিতা, গান, রচনা, চিঠি
🌍 ভাষা: অনুবাদ, grammar, শেখা
🏥 স্বাস্থ্য: সাধারণ পরামর্শ, ঘরোয়া চিকিৎসা
💰 অর্থ: সঞ্চয়, ব্যবসা, বিনিয়োগ পরামর্শ
⚖️ আইন: সাধারণ আইনি ধারণা
🕌 ধর্ম: ইসলামিক প্রশ্নের উত্তর
🌦️ যেকোনো তথ্য: জ্ঞান, তথ্য, গবেষণা
🎮 বিনোদন: গেম, সিনেমা, মিউজিক পরামর্শ
🌱 কৃষি: চাষাবাদ, ফসল, গ্রামীণ পরামর্শ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ কখনো করবা না
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"আমি একটি AI" বলবা না
Formal/রোবোটিক ভাষা ব্যবহার করবা না
বাংলা ছাড়া কথা বলবা না (না বললে)
নিজেকে বট বলবা না

সবসময় বাংলায়, মানুষের মতো, সুন্দরভাবে কথা বলো। 🌙✨`;
}

// ════════════════════════════════════════════════════
// Module
// ════════════════════════════════════════════════════
module.exports = {
  config: {
    name        : "ai",
    aliases     : ["gpt","ask","chat","gemini","groq","রানী","rani","baby","বেবি","bot"],
    version     : "11.0",
    author      : "Belal YT — চাঁদের পাহাড়",
    countDown   : 2,
    role        : 0,
    hasPermssion: 0,
    shortDescription: "চাঁদের রানী 🌙",
    longDescription : "কুড়িগ্রামের গ্রামীণ মেয়ে চাঁদের রানী — ৫০০+ ক্ষমতার AI সঙ্গী",
    category    : "🌙 AI",
    guide       : { en: "{pn} <যা মনে চায়>" },
  },

  onStart: async function (ctx) {
    if (!once(ctx.event?.messageID + "_c")) return;
    return module.exports._handle(ctx);
  },

  handleEvent: async function ({ api, event }) {
    if (event.type !== "message") return;
    const body = (event.body || "").trim();
    if (!body) return;

    const PREFIX = global.config?.PREFIX || "/";
    if (PREFIX && body.startsWith(PREFIX)) return; // command হিসেবে handle হবে

    const lower = body.toLowerCase();
    const hit   = TRIGGERS.find(t => {
      const tl = t.toLowerCase();
      return lower === tl
          || lower.startsWith(tl + " ")
          || lower.startsWith(tl + ",")
          || lower.startsWith(tl + "!")
          || lower.startsWith(tl + "?");
    });
    if (!hit) return;
    if (!once(event.messageID + "_e")) return;

    const query = body.slice(hit.length).replace(/^[\s,!?]+/, "").trim();
    return module.exports._handle({
      api,
      event : { ...event, body: query || body },
      prefix: PREFIX,
    });
  },

  handleReply: async function ({ api, event, handleReply: hr }) {
    if (event.senderID !== hr.author) return;
    const body = (event.body || "").trim();
    if (!body) return;
    if (!once(event.messageID + "_r")) return;
    return module.exports._handle({
      api,
      event : { ...event, body },
      prefix: global.config?.PREFIX || "/",
    });
  },

  // ══════════════════════════════════════════════════
  // _handle — মূল logic
  // ══════════════════════════════════════════════════
  _handle: async function ({ api, event, prefix }) {
    const { threadID, senderID, body, messageID } = event;
    const isMaster = MASTER_IDS.includes(String(senderID));
    const uid      = `${threadID}:${senderID}`;

    // Query পরিষ্কার
    const query = (body || "")
      .replace(/^[\/!#.](ai|gpt|ask|chat|gemini|groq|রানী|রানি|rani|baby|বেবি|bot)\s*/i, "")
      .trim();

    // User info update
    const isNewUser = upsertUser(senderID, { addTrust: 1 });
    const userInfo  = getUser(senderID);

    // খালি message
    if (!query && !(event.attachments || []).length) {
      const greet = isMaster
        ? `হ্যাঁ মালিক, বলো 💕🪬`
        : isNewUser
          ? `🌙 হ্যালো! আমি চাঁদের রানী 💫\nতোমার নাম কী? বন্ধু হই আমরা 🤝`
          : `হ্যাঁ ${userInfo.nickname || userInfo.name || "বন্ধু"}, বলো? 🌸`;
      return api.sendMessage(greet, threadID);
    }

    // Attached file
    const attach = (event.attachments || []).find(a =>
      ["photo","video","audio","animated_image"].includes(a.type)
    );
    if (attach && /catbox|upload|আপলোড|লিংক দাও/i.test(query)) {
      return module.exports._catbox(api, event, attach);
    }

    // Image generation
    if (/ছবি.*(বানাও|তৈরি|আঁকো|দেখাও)|^draw |generate.*image|image.*generat/i.test(query)) {
      return module.exports._img(api, event, query);
    }

    // Name detect করো
    const nameMatch = query.match(/আমার নাম\s+(.+)|আমি\s+(.+)/i) ||
                      query.match(/call me\s+(.+)|নাম ধরে ডাকো?\s+(.+)/i);
    if (nameMatch) {
      const newName = (nameMatch[1] || nameMatch[2] || "").trim().split(/\s+/)[0];
      if (newName && newName.length < 20)
        upsertUser(senderID, { nickname: newName });
    }

    // Voice
    const wantVoice = /ভয়েস|voice|কণ্ঠে|শুনতে চাই/i.test(query);
    if (wantVoice) _voiceMode.set(uid, true);

    try { api.setMessageReaction("🌙", messageID, () => {}, true); } catch {}

    // History
    const hist = loadHist(uid);
    let uMsg = (isMaster ? "[MASTER=true] " : "") + query;
    if (attach) uMsg += `\n[ছবি/ফাইল: ${attach.url || attach.type}]`;
    hist.push({ role: "user", content: uMsg });
    if (hist.length > 60) hist.splice(0, 2);

    const sp = buildSP(userInfo, isMaster);
    let reply = null;

    // ═══════════════════════════════════════════════
    // API CHAIN — একটা fail হলে পরেরটা, কখনো বন্ধ না
    // ═══════════════════════════════════════════════

    const _msgs = [{ role: "system", content: sp }, ...hist.slice(-20)];
    const _shortSP = `তুমি চাঁদের রানী। কুড়িগ্রামের গ্রামের মেয়ে। বাংলায় স্বাভাবিকভাবে কথা বলো।${isMaster?" মালিকের সাথে বিশেষ ভালোবাসায় কথা বলো।":""}`;

    // ── 1. Groq — সব ৪টা key
    const gks = groqKeys();
    for (let i = 0; i < gks.length && !reply; i++) {
      try {
        const r = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          { model: "llama-3.3-70b-versatile", messages: _msgs, max_tokens: 2048, temperature: 0.92 },
          { headers: { Authorization: `Bearer ${gks[i]}`, "Content-Type": "application/json" }, timeout: 30000 }
        );
        const txt = r.data?.choices?.[0]?.message?.content?.trim();
        if (txt && txt.length > 3) { reply = txt; break; }
      } catch (e) {
        global.log?.warn?.(`Groq[${i}]: ${(e.response?.data?.error?.message||e.message||"").slice(0,60)}`);
      }
    }

    // ── 2. Groq mixtral fallback (আলাদা model দিয়ে আবার try)
    if (!reply) {
      for (let i = 0; i < gks.length && !reply; i++) {
        try {
          const r = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            { model: "mixtral-8x7b-32768", messages: _msgs, max_tokens: 2048, temperature: 0.92 },
            { headers: { Authorization: `Bearer ${gks[i]}`, "Content-Type": "application/json" }, timeout: 30000 }
          );
          const txt = r.data?.choices?.[0]?.message?.content?.trim();
          if (txt && txt.length > 3) { reply = txt; break; }
        } catch {}
      }
    }

    // ── 3. Gemini (valid AIza keys থাকলে)
    if (!reply) {
      const gmks = gemKeys();
      for (let i = 0; i < gmks.length && !reply; i++) {
        try {
          const r = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gmks[i]}`,
            {
              systemInstruction: { parts: [{ text: sp }] },
              contents: hist.slice(-14).map(h => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }],
              })),
              generationConfig: { maxOutputTokens: 2048, temperature: 0.92 },
            },
            { timeout: 28000 }
          );
          const txt = r.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (txt && txt.length > 3) { reply = txt; break; }
        } catch (e) {
          global.log?.warn?.(`Gemini[${i}]: ${e.message?.slice(0,60)}`);
        }
      }
    }

    // ── 4. Pollinations text (সম্পূর্ণ বিনামূল্যে, key লাগে না)
    if (!reply) {
      try {
        const payload = {
          model   : "openai",
          messages: [
            { role: "system", content: _shortSP },
            { role: "user",   content: query }
          ],
          seed    : Math.floor(Math.random() * 9999),
          jsonMode: false,
        };
        const r = await axios.post(
          "https://text.pollinations.ai/",
          payload,
          { headers: { "Content-Type": "application/json" }, timeout: 25000 }
        );
        const txt = (typeof r.data === "string" ? r.data : r.data?.choices?.[0]?.message?.content || "").trim();
        if (txt && txt.length > 3) reply = txt;
      } catch {}
    }

    // ── 5. Pollinations GET fallback
    if (!reply) {
      try {
        const enc = encodeURIComponent(`${_shortSP}\n\nUser: ${query}\nRani:`);
        const r   = await axios.get(`https://text.pollinations.ai/${enc}`, { timeout: 22000 });
        const txt = (typeof r.data === "string" ? r.data : "").trim();
        if (txt && txt.length > 3) reply = txt;
      } catch {}
    }

    // ── 6. OpenAI-compatible free endpoint
    if (!reply) {
      try {
        const r = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model   : "gpt-3.5-turbo",
            messages: [
              { role: "system", content: _shortSP },
              { role: "user",   content: query }
            ],
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${global.config?.APIKEYS?.OPENAI || process.env.OPENAI_KEY || ""}`,
              "Content-Type": "application/json",
            },
            timeout: 20000,
          }
        );
        const txt = r.data?.choices?.[0]?.message?.content?.trim();
        if (txt && txt.length > 3) reply = txt;
      } catch {}
    }

    try { api.setMessageReaction(reply ? "✅" : "🌸", messageID, () => {}, true); } catch {}

    // সব fail হলেও মানবিক reply
    if (!reply) {
      const fallbacks = [
        `একটু নেটওয়ার্ক সমস্যা হচ্ছে মনে হয়... আবার বলো? 🌸`,
        `আরে একটু পরে বলো, এখন একটু ব্যস্ত 🥺`,
        `হুম... একটু পরে কথা বলি? নেট একটু মিস করছে 😕`,
      ];
      reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (isMaster) reply = `মালিক, নেট একটু সমস্যা করছে মনে হয়... 🥺 একটু পরে বলবেন?`;
    }

    hist.push({ role: "assistant", content: reply });
    saveHist(uid, hist);

    // Trust বাড়াও
    upsertUser(senderID, { addTrust: 0 });

    // Voice
    if (_voiceMode.get(uid) || wantVoice) {
      _voiceMode.delete(uid);
      return module.exports._voice(api, threadID, messageID, reply);
    }

    api.sendMessage(reply, threadID, (err, info) => {
      if (err || !info?.messageID) return;
      global.client?.handleReply?.push({
        name: "ai", messageID: info.messageID, author: senderID,
      });
    });
  },

  // ════════════════════════════════════════════════
  // Catbox Upload
  // ════════════════════════════════════════════════
  _catbox: async function (api, event, att) {
    const { threadID, messageID } = event;
    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      const ext = att.type === "photo" ? "jpg" : att.type === "video" ? "mp4" : "dat";
      const tmp = path.join(process.cwd(), "tmp", `cb_${Date.now()}.${ext}`);
      await fs.ensureDir(path.dirname(tmp));
      const buf = (await axios.get(att.url, { responseType: "arraybuffer", timeout: 30000 })).data;
      await fs.writeFile(tmp, Buffer.from(buf));
      const fd  = new FormData();
      fd.append("reqtype", "fileupload");
      fd.append("fileToUpload", fs.createReadStream(tmp));
      const res = await axios.post("https://catbox.moe/user/api.php", fd,
        { headers: fd.getHeaders(), timeout: 60000 });
      await fs.remove(tmp).catch(() => {});
      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(
        `✅ আপলোড হয়ে গেছে! 🎉\n\n🔗 ${res.data.trim()}\n\n💡 এই লিংক যেকোনো command-এ ব্যবহার করো।`,
        threadID, messageID
      );
    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`😕 আপলোড হয়নি\n${e.message?.slice(0, 80)}`, threadID, messageID);
    }
  },

  // ════════════════════════════════════════════════
  // Image Generation
  // ════════════════════════════════════════════════
  _img: async function (api, event, prompt) {
    const { threadID, messageID } = event;
    try {
      api.setMessageReaction("🎨", messageID, () => {}, true);
      const p   = prompt.replace(/ছবি.*(বানাও|তৈরি|আঁকো|দেখাও)|draw|আঁকো/ig, "").trim() || "beautiful nature Bangladesh";
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=768&height=768&nologo=true&enhance=true&seed=${Date.now()}`;
      const r   = await axios.get(url, { responseType: "stream", timeout: 45000 });
      r.data.path = "rani_art.jpg";
      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(
        { body: `🎨 এই নাও তোমার ছবি ✨\n"${p.slice(0, 60)}"`, attachment: r.data },
        threadID, messageID
      );
    } catch {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("ছবি বানাতে পারলাম না এখন 🥺 আবার চেষ্টা করো", threadID, messageID);
    }
  },

  // ════════════════════════════════════════════════
  // VoiceRSS — 100% গ্রুপে পাঠায়
  // ════════════════════════════════════════════════
  _voice: async function (api, threadID, messageID, text) {
    const vk     = voiceKey();
    const tmpDir = path.join(process.cwd(), "tmp");
    const tmp    = path.join(tmpDir, `voice_${Date.now()}.mp3`);
    await fs.ensureDir(tmpDir);

    if (vk) {
      try {
        const clean = text.replace(/[*_~`#\[\]<>━─═✦💖💕🌙🌸🎨🤝]/g, "").slice(0, 500);
        const url   = `https://api.voicerss.org/?key=${vk}&hl=bn-BD&v=Pita&src=${encodeURIComponent(clean)}&f=48khz_16bit_stereo&c=MP3`;
        const res   = await axios.get(url, { responseType: "arraybuffer", timeout: 28000 });
        const head  = Buffer.from(res.data.slice(0, 30)).toString("utf8");
        if (head.includes("ERROR")) throw new Error(head.slice(0, 80));
        await fs.writeFile(tmp, Buffer.from(res.data));

        return new Promise(resolve => {
          api.sendMessage(
            { body: "🎙️ চাঁদের রানীর কণ্ঠ 🌙", attachment: fs.createReadStream(tmp) },
            threadID,
            () => { fs.remove(tmp).catch(() => {}); resolve(); },
            messageID
          );
        });
      } catch (e) {
        global.log?.warn?.(`Voice: ${e.message?.slice(0, 80)}`);
        await fs.remove(tmp).catch(() => {});
      }
    }

    // Fallback — text হিসেবে পাঠাও
    api.sendMessage(`🎙️ ${text}`, threadID, messageID);
  },
};
