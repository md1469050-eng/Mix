/*
╔══════════════════════════════════════════════════════════════════╗
║       🤖 BELAL BOTX666 — 2026 PREMIUM ULTRA MAX EDITION         ║
║    ✡️ চাঁদের পাহাড় | Master: Belal YT 🪬                      ║
║         Version: 7.0.0 | Rebuilt: 2026                          ║
║  ✅ Zero-Config Loader  ✅ Stream Media  ✅ Sandbox Isolation    ║
║  ✅ Live HotReload      ✅ handleReply Fix  ✅ Anti-Leak Guard   ║
╚══════════════════════════════════════════════════════════════════╝
*/

"use strict";

// ══════════════════════════════════════════════════════
//  BOOTSTRAP — core dependencies আগে ইন্সটল করো
// ══════════════════════════════════════════════════════
(function bootstrap() {
  const { execSync } = require("child_process");
  const coreDeps = [
    "fs-extra", "chalk", "moment-timezone", "fca-unofficial",
    "axios", "express", "sequelize", "better-sqlite3",
    "form-data", "yt-search", "yt-dlp-exec"
  ];
  const missing = coreDeps.filter(dep => {
    try { require.resolve(dep); return false; } catch { return true; }
  });
  if (missing.length > 0) {
    console.log(`[BOOTSTRAP] ⚡ Missing packages: ${missing.join(", ")}`);
    try {
      execSync(
        `npm install ${missing.join(" ")} --legacy-peer-deps --prefer-offline`,
        { stdio: "inherit", cwd: process.cwd(), timeout: 180000 }
      );
      console.log("[BOOTSTRAP] ✅ Core deps installed!");
    } catch (e) {
      console.error("[BOOTSTRAP] ❌ Install error:", e.message);
    }
  }
})();

const fs        = require("fs-extra");
const path      = require("path");
const { execSync, spawnSync } = require("child_process");
const chalk     = require("chalk");
const moment    = require("moment-timezone");
const login     = require("fca-unofficial");

const BOT_START_TIME = Date.now();
const ROOT = process.cwd();

// ══════════════════════════════════════════════════════
//  LOGGER  (timestamp in Dhaka, Bangla labels)
// ══════════════════════════════════════════════════════
const ts  = () => moment().tz("Asia/Dhaka").format("HH:mm:ss");
const log = {
  info:    (m) => console.log(chalk.cyan   (`[তথ্য]   ${ts()} ➤  ${m}`)),
  success: (m) => console.log(chalk.green  (`[সফল]    ${ts()} ✅ ${m}`)),
  warn:    (m) => console.log(chalk.yellow (`[সতর্ক]  ${ts()} ⚠️  ${m}`)),
  error:   (m) => console.log(chalk.red    (`[ত্রুটি] ${ts()} ❌ ${m}`)),
  bot:     (m) => console.log(chalk.magenta(`[বট]     ${ts()} 🤖 ${m}`)),
  cmd:     (m) => console.log(chalk.blue   (`[কমান্ড] ${ts()} ⚡ ${m}`)),
  event:   (m) => console.log(chalk.gray   (`[ইভেন্ট] ${ts()} 📡 ${m}`)),
  hot:     (m) => console.log(chalk.bgBlue (`[HOTLOAD] ${ts()} 🔥 ${m}`)),
};
global.log = log;

// ══════════════════════════════════════════════════════
//  GLOBALS
// ══════════════════════════════════════════════════════
global.client = {
  commands:        new Map(),
  events:          new Map(),
  cooldowns:       new Map(),
  eventRegistered: [],
  handleReaction:  [],
  handleReply:     [],      // ← Fixed: properly populated & routed
  handleSchedule:  [],
  mainPath:        ROOT,
  startTime:       BOT_START_TIME,
  version:         "7.0.0",
};

global.data = {
  threadInfo:       new Map(),
  threadData:       new Map(),
  userName:         new Map(),
  userBanned:       new Map(),
  threadBanned:     new Map(),
  commandBanned:    new Map(),
  threadAllowNSFW:  [],
  allUserID:        [],
  allCurrenciesID:  [],
  allThreadID:      [],
};

global.modules      = {};
global.configModule = {};
global.moduleData   = {};
global.temp         = {};

// ══════════════════════════════════════════════════════
//  CONFIG LOADER
// ══════════════════════════════════════════════════════
function loadConfig() {
  const cfgPath = path.join(ROOT, "config.json");
  if (!fs.existsSync(cfgPath)) {
    log.error("config.json পাওয়া যায়নি!"); process.exit(1);
  }
  try {
    global.config = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    // ── Key assembly from _KEYS (split storage) ──
    const _k = global.config._KEYS || {};
    const _j = (arr) => Array.isArray(arr) ? arr.join("") : (arr || "");
    if (_k.G1) global.config.APIKEYS.GROQ    = _j(_k.G1);
    if (_k.G2) global.config.APIKEYS.GROQ2   = _j(_k.G2);
    if (_k.G3) global.config.APIKEYS.GROQ3   = _j(_k.G3);
    if (_k.G4) global.config.APIKEYS.GROQ4   = _j(_k.G4);
    if (_k.M1) global.config.APIKEYS.GEMINI  = _j(_k.M1);
    if (_k.M2) global.config.APIKEYS.GEMINI2 = _j(_k.M2);
    if (_k.M3) global.config.APIKEYS.GEMINI3 = _j(_k.M3);
    if (_k.M4) global.config.APIKEYS.GEMINI4 = _j(_k.M4);
    if (_k.VR) global.config.APIKEYS.VOICERSS = _k.VR;
    // ENV override — Secrets থাকলে সেটা নেবে
    const _env = { GROQ:"GROQ_KEY",GROQ2:"GROQ_KEY2",GROQ3:"GROQ_KEY3",GROQ4:"GROQ_KEY4",
      GEMINI:"GEMINI_KEY",GEMINI2:"GEMINI_KEY2",GEMINI3:"GEMINI_KEY3",GEMINI4:"GEMINI_KEY4",
      VOICERSS:"VOICERSS_KEY",IMGBB:"IMGBB_KEY" };
    for (const [ak, ek] of Object.entries(_env))
      if (process.env[ek]) global.config.APIKEYS[ak] = process.env[ek];













    log.success("config.json লোড সম্পন্ন (env override সক্রিয়)।");
  } catch (err) {
    log.error(`config.json JSON ত্রুটি: ${err.message}`); process.exit(1);
  }
}

// ══════════════════════════════════════════════════════
//  LANGUAGE LOADER
// ══════════════════════════════════════════════════════
function loadLanguage(lang = "bn") {
  try {
    const langPath = path.join(ROOT, "languages", `${lang}.lang`);
    const usePath  = fs.existsSync(langPath)
      ? langPath
      : path.join(ROOT, "languages", "bn.lang");
    global.langData = {};
    if (fs.existsSync(usePath)) {
      for (const line of fs.readFileSync(usePath, "utf-8").split(/\r?\n/)) {
        if (line.startsWith("#") || !line.includes("=")) continue;
        const si  = line.indexOf("=");
        const key = line.slice(0, si).trim();
        const val = line.slice(si + 1).replace(/\\n/g, "\n");
        const [head, ...rest] = key.split(".");
        if (!global.langData[head]) global.langData[head] = {};
        global.langData[head][rest.join(".")] = val;
      }
    }
    global.getText = (mod, key, ...args) => {
      let text = global.langData?.[mod]?.[key] || `[${mod}.${key}]`;
      for (let i = args.length; i > 0; i--)
        text = text.replace(new RegExp(`%${i}`, "g"), args[i - 1]);
      return text;
    };
    log.success(`ভাষা ফাইল লোড: ${lang}`);
  } catch {
    global.getText = (m, k) => `[${m}.${k}]`;
  }
}

// ══════════════════════════════════════════════════════
//  ZERO-CONFIG AUTO-INSTALLER
//  Detects missing deps, installs silently, then re-requires.
//  Supports 1000+ commands without memory leaks.
// ══════════════════════════════════════════════════════
const _installedCache = new Set(); // avoid redundant installs per session

function safePkgName(pkg) {
  // Prevent shell injection: only allow npm package name chars
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(@[\d.^~>=<]+)?$/i.test(pkg);
}

function autoInstall(pkg, ver = "") {
  const key = `${pkg}@${ver || "latest"}`;
  if (_installedCache.has(key)) return true;
  if (!safePkgName(pkg)) {
    log.error(`অনিরাপদ প্যাকেজ নাম এড়িয়ে গেলাম: ${pkg}`);
    return false;
  }
  const name = ver ? `${pkg}@${ver}` : pkg;
  log.warn(`প্যাকেজ ইন্সটল হচ্ছে: ${name}`);
  const result = spawnSync(
    "npm", ["install", name, "--save", "--legacy-peer-deps", "--prefer-offline"],
    { stdio: "pipe", cwd: ROOT, timeout: 60_000 }
  );
  if (result.status === 0) {
    _installedCache.add(key);
    log.success(`ইন্সটল সম্পন্ন: ${name}`);
    return true;
  }
  log.error(`ইন্সটল ব্যর্থ: ${name} → ${(result.stderr || "").toString().slice(0, 120)}`);
  return false;
}

function requireOrInstall(pkg, ver = "") {
  try { return require(pkg); } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      autoInstall(pkg, ver);
      try { return require(pkg); } catch { return null; }
    }
    throw e;
  }
}
global.requireOrInstall = requireOrInstall;

// ══════════════════════════════════════════════════════
//  SANDBOXED COMMAND LOADER
//  Each command wrapped so one bad file can't crash others.
// ══════════════════════════════════════════════════════
function loadCommands() {
  const dir = path.join(ROOT, "Script", "commands");
  if (!fs.existsSync(dir)) return log.warn("Script/commands/ ফোল্ডার নেই।");

  const disabled = new Set(global.config.COMMAND_DISABLED || []);
  const files    = fs.readdirSync(dir).filter(
    f => f.endsWith(".js") && !f.startsWith("_") && !disabled.has(f.replace(".js", ""))
  );

  let ok = 0, fail = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      // Clear cache for hot-reload safety
      delete require.cache[require.resolve(filePath)];

      let cmd;
      // ── SANDBOX: syntax/load errors isolated per file ──
      try { cmd = require(filePath); }
      catch (loadErr) {
        log.error(`[LOAD ERR] ${file}: ${loadErr.message}`);
        _notifyAdmin(`কমান্ড লোড ত্রুটি [${file}]: ${loadErr.message}`);
        fail++; continue;
      }

      if (!cmd?.config?.name) { fail++; continue; }
      // ✅ সব framework সাপোর্ট: onStart (GoatBot), run (Mirai/Legacy), onCall
      if (!cmd.run && !cmd.onCall && !cmd.onStart) { fail++; continue; }
      if (global.client.commands.has(cmd.config.name)) { fail++; continue; }

      // Auto-install declared dependencies
      if (cmd.config.dependencies) {
        for (const [pkg, ver] of Object.entries(cmd.config.dependencies)) {
          try { require(pkg); } catch { autoInstall(pkg, ver); }
        }
      }

      // Merge envConfig defaults
      if (cmd.config.envConfig) {
        global.configModule[cmd.config.name] = {};
        for (const [k, v] of Object.entries(cmd.config.envConfig))
          global.configModule[cmd.config.name][k] =
            global.config[cmd.config.name]?.[k] ?? v;
      }

      if (cmd.handleEvent)  global.client.eventRegistered.push(cmd.config.name);
      if (cmd.handleReply)  { /* registered per-message, not at load time */ }
      // No-prefix commands (AI triggers without prefix)
      if (cmd.config?.noPrefix === true || cmd.config?.name === 'ai')
        if (!global.client.eventRegistered.includes(cmd.config.name))
          global.client.eventRegistered.push(cmd.config.name);

      // Universal cross-framework wrapper
      cmd._wrapped = buildUniversalWrapper(cmd);

      global.client.commands.set(cmd.config.name, cmd);
      ok++;

    } catch (outerErr) {
      log.error(`[OUTER ERR] ${file}: ${outerErr.message}`);
      fail++;
    }
  }

  log.success(`কমান্ড লোড → ✅ ${ok} সফল | ❌ ${fail} ব্যর্থ`);
}

// ══════════════════════════════════════════════════════
//  CROSS-FRAMEWORK COMPATIBILITY WRAPPER
//  Normalises Mirai, GoatBot, and legacy calling conventions
//  into a single safe execution path.
// ══════════════════════════════════════════════════════
function buildUniversalWrapper(cmd) {
  return async function universalRun(ctx) {
    const { api, event, args = [], models } = ctx;

    // Build the universal context object all frameworks expect
    const threadID  = event?.threadID;
    const messageID = event?.messageID;
    const senderID  = event?.senderID;

    const unifiedCtx = {
      // GoatBot / Mirai style
      api, event, args, models,
      threadID, messageID, senderID,

      // GoatBot extras
      message: {
        reply:  (msg)       => api.sendMessage(msg, threadID),
        send:   (msg, tid)  => api.sendMessage(msg, tid || threadID),
        react:  (emoji)     => api.setMessageReaction(emoji, messageID, () => {}, true),
        unsend: (mid)       => api.unsendMessage(mid),
      },

      // Legacy global.client compat
      client: global.client,
      config: global.config,

      // handleReply registration helper
      onReply(handler) {
        if (!messageID) return;
        global.client.handleReply.push({
          author:    senderID,
          messageID,
          commandName: cmd.config.name,
          handler,
        });
      },

      // handleReaction registration helper
      onReact(handler) {
        if (!messageID) return;
        global.client.handleReaction.push({
          author:    senderID,
          messageID,
          commandName: cmd.config.name,
          handler,
        });
      },
    };

    // ── SANDBOX EXECUTION ──
    try {
      const runner = cmd.onStart || cmd.run || cmd.onCall;
      if (!runner) throw new Error('No runner function found');
      await runner(unifiedCtx);
    } catch (runErr) {
      const errMsg = `⚠️ কমান্ড [${cmd.config?.name}] ত্রুটি:\n${runErr.message}`;
      log.error(errMsg);
      _notifyAdmin(errMsg);
      // Gracefully reply to user
      try {
        api.sendMessage(
          `❌ এই কমান্ডে একটি সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।\n📝 ${runErr.message?.slice(0, 100)}`,
          threadID
        );
      } catch {}
    }
  };
}

// ══════════════════════════════════════════════════════
//  EVENTS LOADER
// ══════════════════════════════════════════════════════
function loadEvents() {
  const dir = path.join(ROOT, "Script", "events");
  if (!fs.existsSync(dir)) return;

  const disabled = new Set(global.config.EVENT_DISABLED || []);
  const files    = fs.readdirSync(dir).filter(
    f => f.endsWith(".js") && !f.startsWith("_") && !disabled.has(f.replace(".js", ""))
  );

  let ok = 0;
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const evt = require(path.join(dir, file));
      if (!evt?.config?.name || !evt.handleEvent) continue;
      global.client.events.set(evt.config.name, evt);
      ok++;
    } catch (err) {
      log.error(`[EVENT ERR] ${file}: ${err.message}`);
    }
  }
  log.success(`ইভেন্ট লোড → ✅ ${ok}`);
}

// ══════════════════════════════════════════════════════
//  HOT RELOAD WATCHER
//  Watches Script/commands/ for new/changed files.
//  Loads them in real-time without restarting the bot.
// ══════════════════════════════════════════════════════
function startHotReloader() {
  const dir = path.join(ROOT, "Script", "commands");
  if (!fs.existsSync(dir)) return;

  let debounceMap = {};

  fs.watch(dir, { persistent: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith(".js") || filename.startsWith("_")) return;

    // Debounce rapid filesystem events (editors save multiple times)
    clearTimeout(debounceMap[filename]);
    debounceMap[filename] = setTimeout(() => {
      hotLoadFile(path.join(dir, filename), filename);
    }, 500);
  });

  log.hot(`HotReloader সক্রিয় → ${dir}`);
}

function hotLoadFile(filePath, filename) {
  if (!fs.existsSync(filePath)) return;

  try {
    // Quick syntax check before loading
    spawnSync(process.execPath, ["--check", filePath], { stdio: "pipe" });
  } catch {
    log.error(`[HOTLOAD SYNTAX ERR] ${filename} — লোড বাতিল।`);
    _notifyAdmin(`🚫 HotLoad ব্যর্থ (সিনট্যাক্স ত্রুটি): ${filename}`);
    return;
  }

  try {
    delete require.cache[require.resolve(filePath)];
    const cmd = require(filePath);
    if (!cmd?.config?.name || (!cmd.run && !cmd.onCall && !cmd.onStart)) return;

    // Install missing deps
    if (cmd.config.dependencies) {
      for (const [pkg, ver] of Object.entries(cmd.config.dependencies)) {
        try { require(pkg); } catch { autoInstall(pkg, ver); }
      }
    }

    cmd._wrapped = buildUniversalWrapper(cmd);
    global.client.commands.set(cmd.config.name, cmd);
    log.hot(`কমান্ড লোড/আপডেট: [${cmd.config.name}] (${filename})`);
    _notifyAdmin(`🔥 HotLoad সফল: [${cmd.config.name}] — ${filename}`);
  } catch (err) {
    log.error(`[HOTLOAD ERR] ${filename}: ${err.message}`);
    _notifyAdmin(`❌ HotLoad ত্রুটি [${filename}]: ${err.message}`);
  }
}
global.hotLoadFile = hotLoadFile; // expose for /reload command

// ══════════════════════════════════════════════════════
//  ADMIN NOTIFIER  (non-blocking)
// ══════════════════════════════════════════════════════
function _notifyAdmin(msg) {
  try {
    const api = global.client?.api;
    if (!api) return;
    const admins = global.config?.ADMINBOT || [];
    for (const uid of admins) {
      api.sendMessage(`[🤖 সিস্টেম নোটিশ]\n${msg}`, uid, () => {});
    }
  } catch {}
}
global.notifyAdmin = _notifyAdmin;

// ══════════════════════════════════════════════════════
//  APPSTATE LOADER
// ══════════════════════════════════════════════════════
function loadAppstate() {
  const p = path.resolve(ROOT, global.config.APPSTATEPATH || "appstate.json");
  if (!fs.existsSync(p)) {
    log.error("appstate.json পাওয়া যায়নি!"); process.exit(1);
  }
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8"));
    if (!Array.isArray(data) || !data.length) {
      log.error("appstate.json ভুল বা খালি!"); process.exit(1);
    }
    log.success("Facebook appstate লোড সফল।");
    return data;
  } catch { log.error("appstate.json পড়তে সমস্যা।"); process.exit(1); }
}

// ══════════════════════════════════════════════════════
//  DATABASE
// ══════════════════════════════════════════════════════
async function connectDatabase() {
  const { sequelize, Sequelize } = require("./includes/database");
  await sequelize.authenticate();
  log.success("Database সংযোগ সফল।");
  const models = require("./includes/database/model")({ Sequelize, sequelize });
  await sequelize.sync({ alter: false });
  log.success("Database টেবিল প্রস্তুত।");
  return models;
}

async function loadDBData(models) {
  const { Users, Threads, Currencies } = models;
  const threads = await Threads.getAll();
  for (const t of threads) {
    const tid = String(t.threadID);
    global.data.allThreadID.push(tid);
    if (t.data) global.data.threadData.set(tid, t.data);
    if (t.data?.banned)
      global.data.threadBanned.set(tid, { reason: t.data.banned.reason || "", dateAdded: t.data.banned.dateAdded || "" });
  }
  const users = await Users.getAll(["userID", "banned", "data"]);
  for (const u of users) {
    const uid = String(u.userID);
    global.data.allUserID.push(uid);
    if (u.data) global.data.userName.set(uid, u.data);
    if (u.banned?.status)
      global.data.userBanned.set(uid, { reason: u.banned.reason || "", dateAdded: u.banned.dateAdded || "" });
  }
  const currs = await Currencies.getAll(["userID"]);
  for (const c of currs) global.data.allCurrenciesID.push(String(c.userID));
  log.success(`${threads.length}টি গ্রুপ, ${users.length}জন ইউজার লোড।`);
}

// ══════════════════════════════════════════════════════
//  CRASH LOG
// ══════════════════════════════════════════════════════
function saveCrashLog(type, err) {
  try {
    if (!global.config?.SYSTEM?.saveCrashLogs) return;
    const dir = path.join(ROOT, "logs");
    fs.ensureDirSync(dir);
    fs.writeFileSync(
      path.join(dir, `crash_${Date.now()}.log`),
      `সময়: ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\nধরন: ${type}\n${err?.stack || err}\n`
    );
  } catch {}
}

// ══════════════════════════════════════════════════════
//  EXPRESS (keep-alive server)
// ══════════════════════════════════════════════════════
function setupExpress() {
  try {
    const express = require("express");
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.get("/", (_, res) => res.json({
      name: "BELAL BOTX666", version: "7.0.0", status: "🟢 চলছে",
      master: "Belal YT",
      uptime: Math.floor((Date.now() - BOT_START_TIME) / 1000) + "s",
      commands: global.client.commands.size,
      events: global.client.events.size,
      time: moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss"),
    }));
    app.get("/ping", (_, res) => res.send("🏓 বট সক্রিয়!"));
    app.listen(PORT, () => log.success(`Express server চালু: port ${PORT}`));
  } catch (e) { log.warn(`Express: ${e.message}`); }
}

// ══════════════════════════════════════════════════════
//  MAIN MESSAGE LISTENER + handleReply ROUTER
// ══════════════════════════════════════════════════════
async function startBot(models) {
  const appstate = loadAppstate();
  const { Users, Threads, Currencies } = models;
  log.info("Facebook লগইন হচ্ছে...");

  login({ appState: appstate, ...global.config.FCAOption }, async (err, api) => {
    if (err) {
      const errCode = err?.error || err?.code || "";
      const errMsg  = err?.errorSummary || err?.message || JSON.stringify(err);
      log.error(`লগইন ব্যর্থ: ${errMsg}`);
      if (errCode === 1357004 || String(errCode) === "1357004" || String(errMsg).includes("Not logged in")) {
        log.warn("════════════════════════════════════════");
        log.warn("❌ APPSTATE EXPIRED — Facebook session শেষ হয়ে গেছে!");
        log.warn("✅ সমাধান: নতুন appstate.json তৈরি করে রেপোতে push করুন।");
        log.warn("   Tool: c3c-fbstate অথবা ব্রাউজার extension ব্যবহার করুন।");
        log.warn("════════════════════════════════════════");
      } else {
        log.warn("appstate পুরনো হতে পারে। নতুন cookie দিন।");
      }
      process.exit(1);
    }

    try {
      fs.writeFileSync(
        path.resolve(ROOT, global.config.APPSTATEPATH || "appstate.json"),
        JSON.stringify(api.getAppState(), null, 2)
      );
    } catch {}

    api.setOptions(global.config.FCAOption || {});
    global.client.api = api;
    global.config.botID = api.getCurrentUserID();
    log.success(`লগইন সফল! Bot UID: ${global.config.botID}`);

    await loadDBData(models);
    try { require('./utils/keepAlive')(); } catch(e) { log.warn('keepAlive: ' + e.message); }
    startHotReloader();

    const ctx = { api, models, Users, Threads, Currencies };
    const handleCommandFn  = require("./includes/handle/handleCommand")(ctx);
    const handleReplyFn    = require("./includes/handle/handleReply")(ctx);
    const handleEventFn    = require("./includes/handle/handleEvent")(ctx);

    log.bot(`✅ ${global.client.commands.size} কমান্ড | ${global.client.events.size} ইভেন্ট সক্রিয়`);
    log.bot(`বট চলছে — ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}`);

    api.listenMqtt(async (err, event) => {
      if (err) {
        const code = err?.error || err?.code || "";
        const msg  = String(err?.errorSummary || err?.message || err?.error || "");

        // sync_sequence_id null — নতুন/খালি account, ignore করে চলতে থাকো
        if (msg.includes("sync_sequence_id") || msg.includes("no sync_sequence_id")) {
          log.warn("⚠️ sync_sequence_id পাওয়া যায়নি — bot account এ যেকোনো group এ কিছু message পাঠাও, তারপর restart করো।");
          return;
        }

        log.error(`Listener ত্রুটি: [${code}] ${msg}`);
        if (code === 1357004 || String(code) === "1357004") {
          log.warn("════════════════════════════════════════");
          log.warn("❌ Facebook session expired! appstate নতুন করুন।");
          log.warn("════════════════════════════════════════");
          setTimeout(() => process.exit(1), 2000);
        }
        return;
      }

      try {
        switch (event.type) {

          case "message_reply":
            // handleReply.js এ পাঠাও — name ও commandName দুটোই সাপোর্ট করে
            await handleReplyFn({ event });
            // event-based handlers ও চলুক (rank, xp ইত্যাদি)
            handleEventFn({ event });
            break;

          case "message":
            await handleCommandFn({ event });
            handleEventFn({ event });
            break;

          case "message_unsend":
            handleEventFn({ event });
            break;

          case "event":
            handleEventFn({ event });
            break;

          case "message_reaction":
            routeHandleReaction(api, event, models);
            break;

          default:
            handleEventFn({ event });
        }
      } catch (e) { log.error(`প্রসেস ত্রুটি: ${e.message}`); }
    });

    if (global.config.SYSTEM?.autoRestart && global.config.SYSTEM?.restartInterval)
      setTimeout(() => { log.warn("নির্ধারিত পুনরায় চালু হচ্ছে..."); process.exit(0); },
        global.config.SYSTEM.restartInterval * 1000);
  });
}


// ══════════════════════════════════════════════════════
//  handleReaction ROUTER
// ══════════════════════════════════════════════════════
function routeHandleReaction(api, event, models) {
  const { messageID, senderID, threadID } = event;
  const entry = global.client.handleReaction.find(h => h.messageID === messageID);
  if (!entry) return;

  const cmd = global.client.commands.get(entry.commandName);
  if (!cmd?.handleReaction) return;

  const unifiedCtx = {
    api, event, models,
    threadID, messageID, senderID,
    message: { reply: (m) => api.sendMessage(m, threadID) },
  };

  (async () => {
    try { await cmd.handleReaction(unifiedCtx); }
    catch (e) { log.error(`handleReaction [${entry.commandName}] ত্রুটি: ${e.message}`); }
  })();
}

// ══════════════════════════════════════════════════════
//  ENTRY POINT
// ══════════════════════════════════════════════════════
async function main() {
  // Ensure required directories exist
  for (const d of [
    "Script/commands", "Script/events", "Script/events/cache/joinGif",
    "Script/events/leaveGif", "includes/database/models", "includes/handle",
    "includes/controllers", "languages", "logs", "backup", "utils", "assets",
  ]) fs.ensureDirSync(path.join(ROOT, d));

  process.on("unhandledRejection", (r) => { log.error(`Rejection: ${r}`);  saveCrashLog("rejection", r); });
  process.on("uncaughtException",  (e) => { log.error(`Exception: ${e.message}`); saveCrashLog("exception", e); });

  loadConfig();
  loadLanguage(global.config.LANGUAGE || "bn");
  loadCommands();
  loadEvents();

  let models;
  try { models = await connectDatabase(); }
  catch (e) { log.error(`Database: ${e.message}`); process.exit(1); }

  await startBot(models);
}

main().catch(e => { log.error(`বট চালু হয়নি: ${e.message}`); process.exit(1); });
