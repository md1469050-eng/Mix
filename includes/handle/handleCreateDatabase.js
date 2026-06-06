"use strict";
module.exports = function ({ Users, Threads, Currencies }) {
  return async function ({ event }) {
    if (global.config?.autoCreateDB == false) return;
    var { senderID, threadID } = event;
    senderID = String(senderID);
    threadID = String(threadID);
    const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data || {};
    try {
      // New group
      if (!allThreadID.includes(threadID) && event.isGroup == true) {
        const info = await Threads.getInfo(threadID).catch(() => null);
        if (info) {
          const setting = { threadName: info.threadName, adminIDs: info.adminIDs, nicknames: info.nicknames };
          allThreadID.push(threadID);
          threadInfo.set(threadID, setting);
          await Threads.setData(threadID, { threadInfo: setting, data: {} }).catch(() => {});
          for (const u of (info.userInfo || [])) {
            const uid = String(u.id);
            userName.set(uid, u.name);
            if (!allUserID.includes(uid)) {
              await Users.createData(uid, { name: u.name }).catch(() => Users.setData(uid, { name: u.name }).catch(() => {}));
              allUserID.push(uid);
            }
          }
        }
      }
      // New user
      if (!allUserID.includes(senderID)) {
        const info = await Users.getInfo?.(senderID).catch(() => ({ name: senderID })) || { name: senderID };
        await Users.createData(senderID, { name: info.name }).catch(() => Users.setData(senderID, { name: info.name }).catch(() => {}));
        allUserID.push(senderID);
        userName.set(senderID, info.name);
      } else if (!userName.has(senderID)) {
        const u = await Users.getData(senderID).catch(() => null);
        if (u?.name) userName.set(senderID, u.name);
      }
      // New currency
      if (!allCurrenciesID.includes(senderID)) {
        await Currencies.createData(senderID, { money: 0, balance: 0 }).catch(() => {});
        allCurrenciesID.push(senderID);
      }
    } catch (e) {
      global.log?.error?.(`[handleCreateDatabase] ${e.message}`);
    }
  };
};
