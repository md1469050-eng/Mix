"use strict";
/*
╔═══════════════════════════════════════════════════════════════════╗
║     🤖 BELAL BOTX666 — handleCommand.js v8.0 (2026 ULTIMATE)    ║
╚═══════════════════════════════════════════════════════════════════╝
*/
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = (() => { try { return require("string-similarity"); } catch { return null; } })();
  const moment = require("moment-timezone");
  const path   = require("path");
  const fs     = require("fs-extra");
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return async function ({ event }) {
    const dateNow = Date.now();
    const time    = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

    const { allowInbox, PREFIX, ADMINBOT = [], NDH = [], DeveloperMode } = global.config || {};
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data || {};
    const { commands, cooldowns } = global.client || {};

    var { body = "", senderID, threadID, messageID } = event;
    senderID = String(senderID);
    threadID = String(threadID);

    if (!body || event.type === "message_unsend") return;
    const botID = String(global.config?.botID || "");
    if (senderID === botID) return;

    // ── Per-thread PREFIX ─────────────────────────────────────────
    const threadSetting   = (threadData && threadData.get(threadID)) || {};
    const effectivePrefix = threadSetting.hasOwnProperty("PREFIX")
      ? threadSetting.PREFIX
      : (PREFIX ?? "/");

    // ── noPrefix mode ─────────────────────────────────────────────
    const isNoPrefix = effectivePrefix === "" || effectivePrefix === null
      || global.GoatBot?.config?.isPrefix === false;

    if (!isNoPrefix) {
      const rx = new RegExp(`^(<@!?${escapeRegex(senderID)}>|${escapeRegex(effectivePrefix)})\\s*`);
      if (!rx.test(body)) return;
    }

    // ── Mode guards ───────────────────────────────────────────────
    const cfg = global.config || {};
    if (!global.data?.allThreadID?.includes(threadID) && !ADMINBOT.includes(senderID) && cfg.adminPaOnly == true)
      return api.sendMessage(
        "🔒 MODE » এই বট শুধুমাত্র admin inbox এ ব্যবহার করা যাবে।",
        threadID, messageID
      );
    if (!ADMINBOT.includes(senderID) && cfg.adminOnly == true)
      return api.sendMessage(
        "🔒 MODE » এই বট এখন শুধুমাত্র admin ব্যবহার করতে পারবে।",
        threadID, messageID
      );
    if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && cfg.ndhOnly == true)
      return api.sendMessage(
        "🔒 MODE » এই বট এখন শুধুমাত্র bot support ব্যবহার করতে পারবে।",
        threadID, messageID
      );

    // ── Adminbox ──────────────────────────────────────────────────
    try {
      const adboxPath = path.join(process.cwd(), "Script/commands/cache/data.json");
      if (fs.existsSync(adboxPath)) {
        const dataAdbox    = JSON.parse(fs.readFileSync(adboxPath, "utf-8"));
        const threadInf    = threadInfo?.get(threadID) || await Threads.getInfo(threadID).catch(() => ({ adminIDs: [] }));
        const isGroupAdmin = (threadInf.adminIDs || []).find(el => String(el.id) == senderID);
        if (
          dataAdbox.adminbox?.[threadID] == true &&
          !ADMINBOT.includes(senderID) &&
          !isGroupAdmin &&
          event.isGroup == true
        ) return api.sendMessage(
          "🔒 MODE » এই গ্রুপে শুধুমাত্র group admin বট ব্যবহার করতে পারবে।",
          threadID, messageID
        );
      }
    } catch {}

    // ── Ban check ─────────────────────────────────────────────────
    if (!ADMINBOT.includes(senderID)) {
      if (!allowInbox && senderID === threadID) return;
      if (userBanned?.has(senderID)) {
        const { reason = "কারণ জানানো হয়নি", dateAdded = "" } = userBanned.get(senderID) || {};
        return api.sendMessage(
          `🚫 তুমি এই বট ব্যবহার করতে পারবে না!\n📝 কারণ: ${reason}\n📅 তারিখ: ${dateAdded}`,
          threadID,
          async (err, info) => {
            await new Promise(r => setTimeout(r, 5000));
            api.unsendMessage(info?.messageID).catch(() => {});
          },
          messageID
        );
      }
      if (threadBanned?.has(threadID)) {
        const { reason = "কারণ জানানো হয়নি", dateAdded = "" } = threadBanned.get(threadID) || {};
        return api.sendMessage(
          `🚫 এই গ্রুপে বট ব্যবহার নিষিদ্ধ করা হয়েছে!\n📝 কারণ: ${reason}\n📅 তারিখ: ${dateAdded}`,
          threadID,
          async (err, info) => {
            await new Promise(r => setTimeout(r, 5000));
            api.unsendMessage(info?.messageID).catch(() => {});
          },
          messageID
        );
      }
    }

    // ── Parse args ────────────────────────────────────────────────
    let args, commandName;
    if (isNoPrefix) {
      const parts = body.trim().split(/ +/);
      commandName = parts.shift().toLowerCase();
      args = parts;
    } else {
      const rx2     = new RegExp(`^(<@!?${escapeRegex(senderID)}>|${escapeRegex(effectivePrefix)})\\s*`);
      const matched = body.match(rx2);
      if (!matched) return;
      const parts = body.slice(matched[0].length).trim().split(/ +/);
      commandName = parts.shift().toLowerCase();
      args        = parts;
    }
    if (!commandName) return;

    // ── Command lookup + aliases + string-similarity ──────────────
    let command = commands.get(commandName)
      || [...commands.values()].find(c =>
          (c.config?.aliases || []).map(a => a.toLowerCase()).includes(commandName)
        );

    if (!command) {
      if (stringSimilarity) {
        const allNames = [...commands.keys()];
        if (allNames.length) {
          const checker = stringSimilarity.findBestMatch(commandName, allNames);
          if (checker.bestMatch.rating >= 0.5) {
            command = commands.get(checker.bestMatch.target);
          } else {
            return api.sendMessage(
              `❓ "${commandName}" নামে কোনো কমান্ড নেই!\n💡 কাছাকাছি কমান্ড: ${effectivePrefix}${checker.bestMatch.target}\n📋 সব কমান্ড দেখতে: ${effectivePrefix}menu`,
              threadID
            );
          }
        }
      }
      if (!command) return;
    }

    // ── commandBanned ─────────────────────────────────────────────
    if (!ADMINBOT.includes(senderID)) {
      const banT = commandBanned?.get(threadID) || [];
      const banU = commandBanned?.get(senderID)  || [];
      if (banT.includes(command.config.name))
        return api.sendMessage(
          `🚫 এই গ্রুপে "${command.config.name}" কমান্ড ব্যবহার নিষিদ্ধ!`,
          threadID,
          async (err, info) => { await new Promise(r => setTimeout(r, 5000)); api.unsendMessage(info?.messageID).catch(() => {}); },
          messageID
        );
      if (banU.includes(command.config.name))
        return api.sendMessage(
          `🚫 তোমার জন্য "${command.config.name}" কমান্ড ব্যবহার নিষিদ্ধ!`,
          threadID,
          async (err, info) => { await new Promise(r => setTimeout(r, 5000)); api.unsendMessage(info?.messageID).catch(() => {}); },
          messageID
        );
    }

    // ── NSFW guard ────────────────────────────────────────────────
    const cmdCat = (command.config?.commandCategory || command.config?.category || "").toLowerCase();
    if (cmdCat === "nsfw" && !global.data?.threadAllowNSFW?.includes(threadID) && !ADMINBOT.includes(senderID))
      return api.sendMessage(
        `🔞 এই গ্রুপে NSFW কমান্ড ব্যবহার করা যাবে না!\n✅ চালু করতে: ${effectivePrefix}nsfw on`,
        threadID,
        async (err, info) => { await new Promise(r => setTimeout(r, 5000)); api.unsendMessage(info?.messageID).catch(() => {}); },
        messageID
      );

    // ── Permission 0/1/2/3 ────────────────────────────────────────
    let permssion = 0;
    try {
      const tInfo = threadInfo?.get(threadID) || await Threads.getInfo(threadID).catch(() => ({ adminIDs: [] }));
      const isGA  = (tInfo.adminIDs || []).find(el => String(el.id) == senderID);
      if (ADMINBOT.includes(String(senderID)))     permssion = 3;
      else if (NDH.includes(String(senderID)))     permssion = 2;
      else if (isGA)                               permssion = 1;
    } catch {}

    const requiredPerm = command.config?.hasPermssion ?? command.config?.role ?? 0;
    if (requiredPerm > permssion) {
      const permNames = ["সবাই", "গ্রুপ Admin", "Bot Support", "Bot Admin"];
      return api.sendMessage(
        `🔒 এই কমান্ড ব্যবহার করতে "${permNames[requiredPerm]}" পারমিশন দরকার!\n❌ তোমার পারমিশন: ${permNames[permssion]}`,
        threadID, messageID
      );
    }

    // ── Cooldown ──────────────────────────────────────────────────
    if (!cooldowns.has(command.config.name)) cooldowns.set(command.config.name, new Map());
    const timestamps = cooldowns.get(command.config.name);
    const cdSecs     = command.config.cooldowns ?? command.config.countDown ?? command.config.coolDown ?? 1;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + cdSecs * 1000) {
      const left = ((timestamps.get(senderID) + cdSecs * 1000 - dateNow) / 1000).toFixed(1);
      return api.sendMessage(
        `⏳ একটু অপেক্ষা করো!\n🕐 ${left} সেকেন্ড পরে আবার ব্যবহার করো।`,
        threadID, messageID
      );
    }

    // ── per-command getText ───────────────────────────────────────
    let getText2 = () => "";
    const lang2 = global.config?.language || "en";
    if (command.languages?.[lang2]) {
      getText2 = (...v) => {
        let t = command.languages[lang2][v[0]] || "";
        for (let i = v.length; i > 0; i--) t = t.replace(new RegExp("%" + i, "g"), v[i]);
        return t;
      };
    }

    // ── Execute ───────────────────────────────────────────────────
    global.log?.cmd?.(`⚡ [${command.config.name}] ← ${senderID}`);
    try {
      const message = {
        reply:  (msg, cb)  => api.sendMessage(msg, threadID, cb || (() => {}), messageID),
        send:   (msg, tid) => api.sendMessage(msg, tid || threadID),
        react:  (emoji)    => api.setMessageReaction(emoji, messageID, () => {}, true),
        unsend: (mid)      => api.unsendMessage(mid),
      };

      const Obj = {
        api, event, args, models,
        Users, Threads, Currencies,
        permssion, role: permssion,
        message, getText: getText2,
        prefix: effectivePrefix,
        threadID, messageID, senderID,
        onReply(handler) {
          global.client.handleReply.push({
            author: senderID, messageID,
            name: command.config.name,
            commandName: command.config.name,
            handler,
          });
        },
        onReact(handler) {
          global.client.handleReaction.push({
            author: senderID, messageID,
            name: command.config.name,
            commandName: command.config.name,
            handler,
          });
        },
      };

      const runner = command.run || command.onStart || command.onCall;
      if (!runner) throw new Error(`কমান্ড [${command.config.name}] এ run/onStart/onCall নেই`);
      await runner(Obj);
      timestamps.set(senderID, dateNow);

      if (DeveloperMode)
        global.log?.info?.(`[DEV] ${commandName} | ${senderID} | ${Date.now() - dateNow}ms`);
    } catch (e) {
      global.log?.error?.(`❌ [${command.config.name}] কমান্ড ত্রুটি: ${e.message}`);
      api.sendMessage(
        `❌ "${commandName}" কমান্ড চালাতে সমস্যা হয়েছে!\n📝 ত্রুটি: ${e.message?.slice(0, 150)}\n🔧 Admin কে জানাও।`,
        threadID
      );
    }
  };
};
