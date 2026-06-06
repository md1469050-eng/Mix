"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const moment = require("moment-timezone");
  return function ({ event }) {
    const { userBanned, threadBanned } = global.data || {};
    const { events } = global.client || {};
    const { allowInbox, DeveloperMode } = global.config || {};
    var { senderID, threadID } = event;
    senderID = String(senderID);
    threadID = String(threadID);
    if (userBanned?.has(senderID) || threadBanned?.has(threadID) || (allowInbox == false && senderID == threadID)) return;
    if (event.type == "change_thread_image") event.logMessageType = "change_thread_image";
    if (!events) return;
    for (const [key, value] of events.entries()) {
      if (global.config?.eventDisabled?.includes(key)) continue;
      const eventTypes = value.config?.eventType || [];
      const matched    = Array.isArray(eventTypes) && eventTypes.includes(event.logMessageType);
      const hasBelal   = typeof value.handleEvent === "function";
      if (!matched && !hasBelal) continue;
      try {
        const Obj = { api, event, models, Users, Threads, Currencies };
        if (matched && typeof value.run === "function") {
          value.run(Obj);
          if (DeveloperMode) global.log?.event?.(`[Event] ${value.config.name} | ${threadID}`);
        } else if (hasBelal) {
          value.handleEvent(Obj);
        }
      } catch (e) {
        global.log?.error?.(`[handleEvent] ${value.config?.name}: ${e.message}`);
      }
    }
  };
};
