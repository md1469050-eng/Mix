"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function ({ event }) {
    if (!event.messageReply) return;
    const { handleReply, commands } = global.client || {};
    if (!handleReply?.length) return;
    const { messageID, threadID, messageReply } = event;
    const idx = handleReply.findIndex(e => e.messageID == messageReply.messageID);
    if (idx < 0) return;
    const handler = handleReply[idx];
    const cmdName = handler.name || handler.commandName;
    const cmd     = commands.get(cmdName);
    if (!cmd?.handleReply) return;

    // One-shot: remove unless persistReply
    if (!handler.persistReply) handleReply.splice(idx, 1);

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
      cmd.handleReply({ api, event, models, Users, Threads, Currencies, handleReply: handler, getText: getText2, ...handler });
    } catch (e) {
      api.sendMessage(`❌ Reply handler ত্রুটি: ${e.message?.slice(0, 100)}`, threadID, messageID);
    }
  };
};
