"use strict";
module.exports = function ({ models, api }) {
  const M = models.Users || models.use?.("Users");
  async function getInfo(id) { try { return (await api.getUserInfo(id))[id]; } catch { return { name: String(id) }; } }
  async function getNameUser(id) {
    if (global.data.userName.has(id)) return global.data.userName.get(id);
    const u = await getData(id).catch(() => null);
    return u?.name || String(id);
  }
  async function getAll(...data) {
    let where, attributes;
    for (const i of data) { if (Array.isArray(i)) attributes = i; else if (typeof i === "object") where = i; }
    return (await M.findAll({ where, attributes })).map(e => e.get({ plain: true }));
  }
  async function getData(userID) {
    const d = await M.findOne({ where: { userID: String(userID) } });
    return d ? d.get({ plain: true }) : false;
  }
  async function setData(userID, options = {}) {
    await M.upsert({ userID: String(userID), ...options });
    return true;
  }
  async function delData(userID) {
    const r = await M.findOne({ where: { userID: String(userID) } });
    if (r) { await r.destroy(); return true; }
    return false;
  }
  async function createData(userID, defaults = {}) {
    await M.findOrCreate({ where: { userID: String(userID) }, defaults });
    return true;
  }
  async function updateExp(userID, addExp = 1) {
    const u = await M.findOne({ where: { userID: String(userID) } });
    if (u) { u.exp = (u.exp || 0) + addExp; await u.save(); }
  }
  return { getInfo, getNameUser, getAll, getData, setData, delData, createData, updateExp };
};
