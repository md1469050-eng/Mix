"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function ({ event }) {
    const { handleReaction, commands, messageCache } = global.client || {};
    const { reaction, userID, messageID, threadID } = event;
    const ADMINBOT = (global.config?.ADMINBOT || []).map(String);
    const isAdmin  = ADMINBOT.includes(String(userID));

    // 😡🚫 Admin → delete message
    if (["😡", "🚫"].includes(reaction) && isAdmin) {
      return api.unsendMessage(messageID, err => {
        if (!err) global.log?.success?.(`[REACT DELETE] ${messageID}`);
      });
    }

    // ⚠️ Admin → kick message sender
    if (reaction === "⚠️" && isAdmin) {
      const cached   = messageCache?.get(messageID);
      const targetID = cached ? String(cached.senderID) : null;
      if (!targetID) return api.sendMessage("⚠️ মেসেজ cache এ নেই।", threadID);
      const botID = String(api.getCurrentUserID());
      if (targetID === botID || ADMINBOT.includes(targetID))
        return api.sendMessage("⚠️ এই ইউজারকে kick করা যাবে না।", threadID);
      api.removeUserFromGroup(targetID, threadID, err => {
        if (!err) api.sendMessage(`✅ ${cached?.senderID} কে kick করা হয়েছে।`, threadID);
        else api.sendMessage(`❌ kick ব্যর্থ: ${err.message}`, threadID);
      });
      return;
    }

    // Command handleReaction queue
    if (!handleReaction?.length) return;
    const idx = handleReaction.findIndex(e => e.messageID == messageID);
    if (idx < 0) return;
    const handler  = handleReaction[idx];
    const cmdName  = handler.name || handler.commandName;
    const cmd      = commands.get(cmdName);
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
      cmd.handleReaction({ api, event, models, Users, Threads, Currencies, handleReaction: handler, getText: getText2, ...handler });
    } catch (e) {
      api.sendMessage(`❌ Reaction handler ত্রুটি: ${e.message?.slice(0, 100)}`, threadID, messageID);
    }
  };
};
