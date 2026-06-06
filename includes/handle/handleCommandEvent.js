"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function ({ event }) {
    const { allowInbox } = global.config || {};
    const { userBanned, threadBanned } = global.data || {};
    const { commands, eventRegistered } = global.client || {};
    var { senderID, threadID } = event;
    senderID = String(senderID);
    threadID = String(threadID);
    if (userBanned?.has(senderID) || threadBanned?.has(threadID) || (allowInbox == false && senderID == threadID)) return;
    if (!eventRegistered || !commands) return;
    for (const name of eventRegistered) {
      const cmd = commands.get(name);
      if (!cmd?.handleEvent) continue;
      if (global.config?.commandDisabled?.includes(name)) continue;
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
        cmd.handleEvent({ event, api, models, Users, Threads, Currencies, getText: getText2 });
      } catch (e) {
        global.log?.error?.(`[handleCommandEvent] ${name}: ${e.message}`);
      }
    }
  };
};
