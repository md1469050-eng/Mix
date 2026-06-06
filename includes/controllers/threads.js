"use strict";
module.exports = function ({ models, api }) {
  const M = models.Threads || models.use?.("Threads");
  async function getInfo(threadID) {
    const r = await api.getThreadInfo(threadID);
    if (!global.data.allThreadID.includes(String(threadID))) global.data.allThreadID.push(String(threadID));
    return r;
  }
  async function getAll(...data) {
    let where, attributes;
    for (const i of data) { if (Array.isArray(i)) attributes = i; else if (typeof i === "object") where = i; }
    return (await M.findAll({ where, attributes })).map(e => e.get({ plain: true }));
  }
  async function getData(threadID) {
    const d = await M.findOne({ where: { threadID: String(threadID) } });
    return d ? d.get({ plain: true }) : false;
  }
  async function setData(threadID, options = {}) {
    await M.upsert({ threadID: String(threadID), ...options });
    return true;
  }
  async function delData(threadID) {
    const r = await M.findOne({ where: { threadID: String(threadID) } });
    if (r) { await r.destroy(); return true; }
    return false;
  }
  async function createData(threadID, defaults = {}) {
    await M.findOrCreate({ where: { threadID: String(threadID) }, defaults });
    return true;
  }
  return { getInfo, getAll, getData, setData, delData, createData };
};
