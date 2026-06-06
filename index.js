"use strict";
/*
 ╔══════════════════════════════════════════════════════════════════╗
 ║       🤖 BELAL BOTX666 — index.js v7.0                          ║
 ║    ✡️ চাঁদের পাহাড় | Master: Belal YT 🪬                        ║
 ║  ✅ BELAL: run() / handleEvent / handleReaction / handleReply    ║
 ║  ✅ BELAL: handleCreateDatabase / handleCommandEvent             ║
 ║  ✅ BELAL: string-similarity / per-thread PREFIX                 ║
 ║  ✅ BELAL: adminOnly / ndhOnly / adminPaOnly / adminbox          ║
 ║  ✅ BELAL: commandBanned / NSFW / permission 0/1/2/3             ║
 ║  ✅ BELAL: config.language / getText / per-cmd language          ║
 ║  ✅ BELAL: onStart / onCall / HotReload / Express               ║
 ║  ✅ BELAL: messageCache / 😡 delete / ⚠️ kick                  ║
 ╚══════════════════════════════════════════════════════════════════╝
*/

// ── Bootstrap: missing packages install করো ─────────────────────
(function bootstrap() {
  const { execSync } = require("child_process");
  const core = [
    "fca-unofficial","fs-extra","chalk","moment-timezone",
    "axios","express","sequelize","better-sqlite3",
    "form-data","string-similarity","node-schedule"
  ];
  const miss = core.filter(p => { try { require.resolve(p); return false; } catch { return true; } });
  if (miss.length) {
    console.log("[BOOTSTRAP] Installing:", miss.join(", "));
    try {
      execSync(`npm install ${miss.join(" ")} --legacy-peer-deps`, { stdio: "inherit", timeout: 180000 });
    } catch (e) { console.error("[BOOTSTRAP] Error:", e.message); }
  }
})();

const fs      = require("fs-extra");
const path    = require("path");
const chalk   = require("chalk");
const moment  = require("moment-timezone");
const login   = require("fca-unofficial");
const { spawnSync } = require("child_process");

const ROOT          = process.cwd();
const BOT_START     = Date.now();

// ── Logger ────────────────────────────────────────────────────────
const ts = () => moment().tz("Asia/Dhaka").format("HH:mm:ss");
const log = {
  info:    m => console.log(chalk.cyan   (`[তথ্য]    ${ts()} ➤  ${m}`)),
  success: m => console.log(chalk.green  (`[সফল]     ${ts()} ✅ ${m}`)),
  warn:    m => console.log(chalk.yellow (`[সতর্ক]   ${ts()} ⚠️  ${m}`)),
  error:   m => console.log(chalk.red    (`[ত্রুটি]  ${ts()} ❌ ${m}`)),
  bot:     m => console.log(chalk.magenta(`[বট]      ${ts()} 🤖 ${m}`)),
  cmd:     m => console.log(chalk.blue   (`[কমান্ড]  ${ts()} ⚡ ${m}`)),
  info2:   m => console.log(chalk.gray   (`[ইভেন্ট]  ${ts()} 📡 ${m}`)),
};
global.log = log;

// ── Globals ───────────────────────────────────────────────────────
global.client = {
  commands:        new Map(),
  events:          new Map(),
  cooldowns:       new Map(),
  eventRegistered: [],
  handleReaction:  [],
  handleReply:     [],
  handleSchedule:  [],
  messageCache:    new Map(),
  mainPath:        ROOT,
  startTime:       BOT_START,
};

// ── global.nodemodule — BELAL কমান্ড এটা ব্যবহার করে ─────────────
global.nodemodule = new Proxy({}, {
  get(_, pkg) {
    try { return require(pkg); }
    catch {
      try {
        const { spawnSync } = require("child_process");
        spawnSync("npm", ["install", pkg, "--save", "--legacy-peer-deps"], {
          stdio: "pipe", cwd: ROOT, timeout: 60000,
        });
        return require(pkg);
      } catch { return null; }
    }
  }
});

// ── global.utils — BELAL কমান্ড এটা ব্যবহার করে ─────────────────
try {
  global.utils = require("./utils/index.js");
} catch {
  global.utils = {
    downloadFile: async (url, path) => {
      const { createWriteStream } = require("fs");
      const axios = require("axios");
      const res = await axios({ method: "GET", responseType: "stream", url });
      const w = createWriteStream(path);
      res.data.pipe(w);
      return new Promise((r, e) => { w.on("finish", r); w.on("error", e); });
    },
    getContent:     async (url) => require("axios").get(url),
    randomString:   (len) => Math.random().toString(36).slice(2, 2 + len),
    throwError:     () => {},
    assets:         { font: async () => null, image: async () => null, data: async () => null },
  };
}

// ── global.GoatBot — noprefix/GoatBot কমান্ড ব্যবহার করে ────────
global.GoatBot = {
  config: {
    get isPrefix() { return !!global.config?.PREFIX; },
    set isPrefix(val) {
      if (!val) global.config.PREFIX = "";
      else global.config.PREFIX = global.config._defaultPrefix || "/";
    },
  },
};

global.data = {
  threadInfo:      new Map(),
  threadData:      new Map(),
  userName:        new Map(),
  userBanned:      new Map(),
  threadBanned:    new Map(),
  commandBanned:   new Map(),
  threadAllowNSFW: [],
  allUserID:       [],
  allCurrenciesID: [],
  allThreadID:     [],
};

// ── Config loader ─────────────────────────────────────────────────
function loadConfig() {
  const p = path.join(ROOT, "config.json");
  if (!fs.existsSync(p)) { log.error("config.json নেই!"); process.exit(1); }
  try {
    global.config = JSON.parse(fs.readFileSync(p, "utf-8"));
    // BELAL compat aliases
    if (!global.config.ADMINBOT && global.config.adminBot)
      global.config.ADMINBOT = global.config.adminBot;
    if (!global.config.NDH && global.config.ndh)
      global.config.NDH = global.config.ndh;
    if (!global.config.commandDisabled)
      global.config.commandDisabled = global.config.COMMAND_DISABLED || [];
    if (!global.config.eventDisabled)
      global.config.eventDisabled = global.config.EVENT_DISABLED || [];
    // noprefix toggle এর জন্য default prefix save
    global.config._defaultPrefix = global.config.PREFIX || "/";
    log.success("config.json লোড সম্পন্ন।");
  } catch (e) { log.error(`config.json ত্রুটি: ${e.message}`); process.exit(1); }
}

// ── Language loader (BELAL style getText) ──────────────────────────
function loadLanguage() {
  try {
    const lang    = global.config?.language || "en";
    const langDir = path.join(ROOT, "languages");
    const langFile = path.join(langDir, `${lang}.lang`);
    const usePath = fs.existsSync(langFile) ? langFile : path.join(langDir, "en.lang");

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
    // BELAL style: global.getText("module", "key", ...args)
    global.getText = (mod, key, ...args) => {
      let text = global.langData?.[mod]?.[key] || `[${mod}.${key}]`;
      for (let i = args.length; i > 0; i--)
        text = text.replace(new RegExp(`%${i}`, "g"), args[i - 1]);
      return text;
    };
    log.success(`Language লোড: ${lang}`);
  } catch {
    global.getText = (m, k) => `[${m}.${k}]`;
  }
}

// ── Auto-install missing packages ────────────────────────────────
function autoInstall(pkg, ver = "") {
  const name = ver ? `${pkg}@${ver}` : pkg;
  log.warn(`Package ইন্সটল হচ্ছে: ${name}`);
  const r = spawnSync("npm", ["install", name, "--save", "--legacy-peer-deps"], {
    stdio: "pipe", cwd: ROOT, timeout: 60000
  });
  if (r.status === 0) log.success(`ইন্সটল সম্পন্ন: ${name}`);
  else log.error(`ইন্সটল ব্যর্থ: ${name}`);
}
global.requireOrInstall = (pkg, ver = "") => {
  try { return require(pkg); } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      autoInstall(pkg, ver);
      try { return require(pkg); } catch { return null; }
    }
    throw e;
  }
};

// ── Credits warning suppress ──────────────────────────────────────
// কিছু obfuscated কমান্ড credits check করে warning দেয়, এটা বন্ধ করে
const _origWarn = console.warn.bind(console);
console.warn = (...args) => {
  const msg = args.join(" ");
  if (
    msg.includes("credits") ||
    msg.includes("Detect credits") ||
    msg.includes("Stop immediately") ||
    msg.includes("ADMINBOT")
  ) return; // এই warning গুলো suppress করো
  _origWarn(...args);
};

// ── Command loader ────────────────────────────────────────────────
// BELAL: command.run()
// BELAL/GoatBot: command.onStart()
// Legacy: command.onCall()
function loadCommands() {
  const dir = path.join(ROOT, "Script", "commands");
  if (!fs.existsSync(dir)) return log.warn("Script/commands/ নেই।");
  const disabled = new Set(global.config.commandDisabled || []);
  const files = fs.readdirSync(dir).filter(
    f => f.endsWith(".js") && !f.startsWith("_") && !disabled.has(f.replace(".js",""))
  );
  let ok = 0, fail = 0;
  for (const file of files) {
    const fp = path.join(dir, file);
    try {
      delete require.cache[require.resolve(fp)];
      const cmd = require(fp);
      if (!cmd?.config?.name) { fail++; continue; }
      if (!cmd.run && !cmd.onStart && !cmd.onCall) { fail++; continue; }
      if (global.client.commands.has(cmd.config.name)) { fail++; continue; }

      // auto-install dependencies (BELAL feature)
      if (cmd.config?.dependencies) {
        for (const [pkg, ver] of Object.entries(cmd.config.dependencies)) {
          try { require(pkg); } catch { autoInstall(pkg, ver); }
        }
      }

      // handleEvent registration
      if (cmd.handleEvent && !global.client.eventRegistered.includes(cmd.config.name))
        global.client.eventRegistered.push(cmd.config.name);

      global.client.commands.set(cmd.config.name, cmd);

      // onLoad চালাও (BELAL কমান্ড image/file cache download করে)
      if (typeof cmd.onLoad === "function") {
        cmd.onLoad().catch(e => global.log?.warn?.(`[onLoad] ${cmd.config.name}: ${e.message}`));
      }

      ok++;
    } catch (e) {
      log.error(`[LOAD] ${file}: ${e.message}`);
      fail++;
    }
  }
  log.success(`কমান্ড লোড → ✅ ${ok} | ❌ ${fail}`);
}

// ── Event loader ──────────────────────────────────────────────────
function loadEvents() {
  const dir = path.join(ROOT, "Script", "events");
  if (!fs.existsSync(dir)) return;
  const disabled = new Set(global.config.eventDisabled || []);
  const files = fs.readdirSync(dir).filter(
    f => f.endsWith(".js") && !f.startsWith("_") && !disabled.has(f.replace(".js",""))
  );
  let ok = 0;
  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(dir, file))];
      const evt = require(path.join(dir, file));
      if (!evt?.config?.name) continue;
      // BELAL: .run() + config.eventType  OR  BELAL: .handleEvent()
      if (!evt.run && !evt.handleEvent) continue;
      global.client.events.set(evt.config.name, evt);
      ok++;
    } catch (e) { log.error(`[EVENT] ${file}: ${e.message}`); }
  }
  log.success(`ইভেন্ট লোড → ✅ ${ok}`);
}

// ── HotReloader ───────────────────────────────────────────────────
function startHotReloader() {
  const dir = path.join(ROOT, "Script", "commands");
  if (!fs.existsSync(dir)) return;
  let debounce = {};
  fs.watch(dir, (evType, filename) => {
    if (!filename?.endsWith(".js") || filename.startsWith("_")) return;
    clearTimeout(debounce[filename]);
    debounce[filename] = setTimeout(() => {
      const fp = path.join(dir, filename);
      if (!fs.existsSync(fp)) return;
      try {
        delete require.cache[require.resolve(fp)];
        const cmd = require(fp);
        if (!cmd?.config?.name || (!cmd.run && !cmd.onStart && !cmd.onCall)) return;
        if (cmd.config.dependencies)
          for (const [pkg, ver] of Object.entries(cmd.config.dependencies))
            try { require(pkg); } catch { autoInstall(pkg, ver); }
        if (cmd.handleEvent && !global.client.eventRegistered.includes(cmd.config.name))
          global.client.eventRegistered.push(cmd.config.name);
        global.client.commands.set(cmd.config.name, cmd);
        log.success(`[HOTLOAD] আপডেট: ${cmd.config.name}`);
        global.client.api?.sendMessage?.(`🔥 HotLoad: [${cmd.config.name}]`, (global.config.ADMINBOT || [])[0] || "");
      } catch (e) { log.error(`[HOTLOAD] ${filename}: ${e.message}`); }
    }, 500);
  });
  log.success("HotReloader সক্রিয়।");
}

// ── Database connect ─────────────────────────────────────────────
async function connectDatabase() {
  const { sequelize, Sequelize } = require("./includes/database");
  await sequelize.authenticate();
  log.success("Database সংযোগ সফল।");
  const models = require("./includes/database/model")({ Sequelize, sequelize });
  await sequelize.sync({ alter: false });
  log.success("Database টেবিল প্রস্তুত।");
  return models;
}

// ── Load DB data into global.data ────────────────────────────────
async function loadDBData(Threads, Users, Currencies) {
  // Threads
  const allThreads = await Threads.getAll().catch(() => []);
  for (const t of allThreads) {
    const tid = String(t.threadID);
    if (!global.data.allThreadID.includes(tid)) global.data.allThreadID.push(tid);
    if (t.threadInfo) global.data.threadInfo.set(tid, t.threadInfo);
    if (t.data)       global.data.threadData.set(tid, t.data);
    if (t.data?.banned?.status || t.banned?.status)
      global.data.threadBanned.set(tid, {
        reason:    t.data?.banned?.reason    || t.banned?.reason    || "",
        dateAdded: t.data?.banned?.dateAdded || t.banned?.dateAdded || "",
      });
    if (t.data?.commandBanned)
      global.data.commandBanned.set(tid, t.data.commandBanned);
    if (t.data?.allowNSFW)
      global.data.threadAllowNSFW.push(tid);
  }
  // Users
  const allUsers = await Users.getAll(["userID", "name", "banned", "data"]).catch(() => []);
  for (const u of allUsers) {
    const uid = String(u.userID);
    if (!global.data.allUserID.includes(uid)) global.data.allUserID.push(uid);
    if (u.name) global.data.userName.set(uid, u.name);
    if (u.banned?.status || u.data?.banned?.status)
      global.data.userBanned.set(uid, {
        reason:    u.banned?.reason    || u.data?.banned?.reason    || "",
        dateAdded: u.banned?.dateAdded || u.data?.banned?.dateAdded || "",
      });
    if (u.data?.commandBanned)
      global.data.commandBanned.set(uid, u.data.commandBanned);
  }
  // Currencies
  const allCurr = await Currencies.getAll(["userID"]).catch(() => []);
  for (const c of allCurr) {
    const uid = String(c.userID);
    if (!global.data.allCurrenciesID.includes(uid)) global.data.allCurrenciesID.push(uid);
  }
  log.success(`DB লোড → ${allThreads.length} গ্রুপ | ${allUsers.length} ইউজার`);
}

// ── Express keep-alive ────────────────────────────────────────────
function setupExpress() {
  try {
    const app  = require("express")();
    const PORT = process.env.PORT || 3000;
    app.get("/", (_, res) => res.json({
      name:    "BELAL BOTX666",
      version: "7.0.0",
      status:  "🟢 চলছে",
      uptime:  Math.floor((Date.now() - BOT_START) / 1000) + "s",
      cmds:    global.client.commands.size,
    }));
    app.listen(PORT, () => log.success(`Express port ${PORT} চালু।`));
  } catch (e) { log.warn("Express: " + e.message); }
}

// ── Main startBot ─────────────────────────────────────────────────
async function startBot(models) {
  // Build controllers (BELAL compatible)
  const ctrlPath  = path.join(ROOT, "includes", "controllers");
  const Users      = require(path.join(ctrlPath, "users"))({ models, api: null });
  const Threads    = require(path.join(ctrlPath, "threads"))({ models, api: null });
  const Currencies = require(path.join(ctrlPath, "currencies"))({ models });

  // appstate
  const apPath = path.resolve(ROOT, global.config.APPSTATEPATH || "appstate.json");
  if (!fs.existsSync(apPath)) { log.error("appstate.json নেই!"); process.exit(1); }
  let appstate;
  try { appstate = JSON.parse(fs.readFileSync(apPath, "utf-8")); }
  catch { log.error("appstate.json পড়তে সমস্যা।"); process.exit(1); }

  log.info("Facebook লগইন হচ্ছে...");

  login({ appState: appstate, ...global.config.FCAOption }, async (err, api) => {
    if (err) {
      log.error(`লগইন ব্যর্থ: ${err?.errorSummary || err?.message || JSON.stringify(err)}`);
      process.exit(1);
    }

    try { fs.writeFileSync(apPath, JSON.stringify(api.getAppState(), null, 2)); } catch {}

    api.setOptions(global.config.FCAOption || {});
    global.client.api  = api;
    global.config.botID = api.getCurrentUserID();
    log.success(`লগইন সফল! Bot UID: ${global.config.botID}`);

    // Inject api into controllers
    Users.getInfo      = async id => { try { return (await api.getUserInfo(id))[id]; } catch { return { name: String(id) }; } };
    Threads.getInfo    = async tid => { try { return await api.getThreadInfo(tid); } catch { return {}; } };

    // ── Axios global speed config — ছবি/ভিডিও দ্রুত আসবে ────────
    try {
      const axios = require("axios");
      axios.defaults.timeout          = 30000;
      axios.defaults.maxContentLength = 500 * 1024 * 1024;
      axios.defaults.maxBodyLength    = 500 * 1024 * 1024;
      axios.defaults.headers.common["Connection"]    = "keep-alive";
      axios.defaults.headers.common["Cache-Control"] = "no-cache";
      axios.defaults.headers.common["User-Agent"]    =
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Safari/537.36";
    } catch {}

    await loadDBData(Threads, Users, Currencies);

    startHotReloader();
    setupExpress();

    // ── Load all handlers ──────────────────────────────────────
    const hCtx = { api, models, Users, Threads, Currencies };

    const handleCommandFn        = require("./includes/handle/handleCommand")(hCtx);
    const handleCommandEventFn   = require("./includes/handle/handleCommandEvent")(hCtx);
    const handleEventFn          = require("./includes/handle/handleEvent")(hCtx);
    const handleReactionFn       = require("./includes/handle/handleReaction")(hCtx);
    const handleReplyFn          = require("./includes/handle/handleReply")(hCtx);
    const handleCreateDatabaseFn = require("./includes/handle/handleCreateDatabase")({ Users, Threads, Currencies });
    const startSchedule          = require("./includes/handle/handleSchedule")(hCtx);
    startSchedule();

    log.bot(`✅ ${global.client.commands.size} কমান্ড | ${global.client.events.size} ইভেন্ট সক্রিয়`);
    log.bot(`বট চলছে — ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}`);

    // ── Listen ────────────────────────────────────────────────
    api.listenMqtt(async (err, event) => {
      if (err) {
        log.error(`Listener: ${err?.errorSummary || err?.message || err?.error || ""}`);
        if (String(err?.error || err?.code || "") === "1357004") {
          log.warn("❌ Session expired! নতুন appstate দিন।");
          setTimeout(() => process.exit(1), 2000);
        }
        return;
      }

      try {
        // ✅ BELAL: handleCreateDatabase — প্রতি message এ auto DB entry
        if (event.type === "message" || event.type === "message_reply")
          await handleCreateDatabaseFn({ event }).catch(() => {});

        // Message cache (for 😡 delete / ⚠️ kick features)
        if (event.type === "message" || event.type === "message_reply") {
          global.client.messageCache.set(event.messageID, {
            senderID: event.senderID,
            threadID: event.threadID,
          });
          if (global.client.messageCache.size > 500) {
            const first = global.client.messageCache.keys().next().value;
            global.client.messageCache.delete(first);
          }
        }

        switch (event.type) {
          case "message":
            // BELAL order: createDB → command → commandEvent → event
            handleCommandFn({ event });
            handleCommandEventFn({ event });
            handleEventFn({ event });
            break;

          case "message_reply":
            handleCommandFn({ event });
            handleReplyFn({ event });
            handleCommandEventFn({ event });
            handleEventFn({ event });
            break;

          case "message_reaction":
            handleReactionFn({ event });
            break;

          case "message_unsend":
            handleEventFn({ event });
            break;

          default:
            handleEventFn({ event });
        }
      } catch (e) { log.error(`Listener process ত্রুটি: ${e.message}`); }
    });

    // auto-restart
    const sys = global.config?.System || global.config?.SYSTEM || {};
    if (sys.autoRestart && sys.restartInterval)
      setTimeout(() => { log.warn("Auto-restart..."); process.exit(0); }, sys.restartInterval * 1000);
  });
}

// ── Entry Point ───────────────────────────────────────────────────
async function main() {
  // Ensure required folders
  for (const d of [
    "Script/commands", "Script/events",
    "Script/commands/cache",
    "Script/events/cache/joinGif",
    "includes/database/models",
    "includes/handle",
    "includes/controllers",
    "languages", "logs", "utils",
  ]) fs.ensureDirSync(path.join(ROOT, d));

  // Ensure Script/commands/cache/data.json (BELAL adminbox feature)
  const dataJsonPath = path.join(ROOT, "Script/commands/cache/data.json");
  if (!fs.existsSync(dataJsonPath))
    fs.writeFileSync(dataJsonPath, JSON.stringify({ adminbox: {} }, null, 2));

  process.on("unhandledRejection", r => log.error(`Rejection: ${r}`));
  process.on("uncaughtException",  e => log.error(`Exception: ${e.message}`));

  loadConfig();
  loadLanguage();
  loadCommands();
  loadEvents();

  let models;
  try { models = await connectDatabase(); }
  catch (e) { log.error(`Database: ${e.message}`); process.exit(1); }

  await startBot(models);
}

main().catch(e => { log.error(`বট চালু হয়নি: ${e.message}`); process.exit(1); });
