"use strict";
/*
╔═══════════════════════════════════════════════════════════════════╗
║     🤖 BELAL BOTX666 — handleReaction.js v8.2                   ║
║  ✅ 😡🚫 — bot message unsend + others deleteMessage            ║
║  ✅ ⚠️  — kick message sender                                   ║
╚═══════════════════════════════════════════════════════════════════╝
*/
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function ({ event }) {
    const { handleReaction, commands, messageCache } = global.client || {};
    const { reaction, userID, messageID, threadID } = event;

    const ADMINBOT = (global.config?.ADMINBOT || []).map(String);
    const isAdmin  = ADMINBOT.includes(String(userID));
    const botID    = String(api.getCurrentUserID());

    // ══════════════════════════════════════════════════
    // 😡🚫 Admin react → message delete
    // ══════════════════════════════════════════════════
    if (["😡", "🚫"].includes(reaction) && isAdmin) {
      const cached = messageCache?.get(messageID);

      // ── Bot এর নিজের message → unsendMessage ─────────
      if (!cached || String(cached.senderID) === botID) {
        api.unsendMessage(messageID, err => {
          if (err) {
            // unsend ব্যর্থ হলে deleteMessage try করো
            _tryDelete(api, messageID, threadID);
          } else {
            global.log?.success?.(`[DELETE] bot message removed: ${messageID}`);
          }
        });
      } else {
        // ── অন্যের message → deleteMessage ───────────
        _tryDelete(api, messageID, threadID);
      }
      return;
    }

    // ══════════════════════════════════════════════════
    // ⚠️ Admin react → kick sender
    // ══════════════════════════════════════════════════
    if (reaction === "⚠️" && isAdmin) {
      const cached   = messageCache?.get(messageID);
      const targetID = cached ? String(cached.senderID) : null;

      if (!targetID)
        return api.sendMessage(
          "⚠️ এই মেসেজের sender খুঁজে পাওয়া যায়নি!\n💡 শুধু বট চালু হওয়ার পরের মেসেজে কাজ করবে।",
          threadID
        );

      if (targetID === botID)
        return api.sendMessage("⚠️ বটের নিজের মেসেজে kick হবে না।", threadID);

      if (ADMINBOT.includes(targetID))
        return api.sendMessage("⚠️ Admin কে kick করা যাবে না।", threadID);

      api.removeUserFromGroup(targetID, threadID, err => {
        if (!err) {
          api.sendMessage(
            `✅ ${cached?.senderID} কে গ্রুপ থেকে বের করা হয়েছে।`,
            threadID
          );
          global.log?.success?.(`[KICK] ${targetID} kicked by admin ${userID}`);
        } else {
          api.sendMessage(
            `❌ kick করা যায়নি!\n📝 কারণ: ${err.message}\n💡 বট গ্রুপ admin কিনা চেক করো।`,
            threadID
          );
        }
      });
      return;
    }

    // ══════════════════════════════════════════════════
    // Command handleReaction queue
    // ══════════════════════════════════════════════════
    if (!handleReaction?.length) return;
    const idx = handleReaction.findIndex(e => e.messageID == messageID);
    if (idx < 0) return;

    const handler = handleReaction[idx];
    const cmdName = handler.name || handler.commandName;
    const cmd     = commands.get(cmdName);
    if (!cmd?.handleReaction) return;

    let getText2 = () => "";
    const lang = global.config?.language || "en";
    if (cmd.languages?.[lang]) {
      getText2 = (...v) => {
        let t = cmd.languages[lang][v[0]] || "";
        for (let i = v.length; i > 0; i--) t = t.replace(new RegExp("%" + i, "g"), v[i]);
        return t;
      };
    }
    try {
      cmd.handleReaction({
        api, event, models, Users, Threads, Currencies,
        handleReaction: handler,
        getText: getText2,
        ...handler,
      });
    } catch (e) {
      api.sendMessage(
        `❌ Reaction handler ত্রুটি: ${e.message?.slice(0, 100)}`,
        threadID, messageID
      );
    }
  };
};

// ── Helper: deleteMessage try করো ────────────────────────────────
function _tryDelete(api, messageID, threadID) {
  // Method 1: deleteMessage (fca-unofficial এ আছে)
  if (typeof api.deleteMessage === "function") {
    api.deleteMessage(messageID, err => {
      if (!err) {
        global.log?.success?.(`[DELETE] message removed: ${messageID}`);
      } else {
        global.log?.warn?.(`[DELETE] deleteMessage ব্যর্থ: ${err.message}`);
        // Method 2: unsendMessage fallback
        api.unsendMessage(messageID, () => {});
      }
    });
  } else {
    // Method 2: unsendMessage fallback
    api.unsendMessage(messageID, err => {
      if (err) global.log?.warn?.(`[DELETE] unsendMessage ব্যর্থ: ${err.message}`);
      else global.log?.success?.(`[DELETE] message removed: ${messageID}`);
    });
  }
}
