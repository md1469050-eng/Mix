"use strict";
module.exports = function ({ models }) {
  const M = models.Currencies || models.use?.("Currencies");
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
    if (options.money !== undefined && options.balance === undefined) options.balance = options.money;
    if (options.balance !== undefined && options.money === undefined) options.money = options.balance;
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
  async function increaseMoney(userID, amount) {
    const d = await getData(userID);
    const n = Number(d?.money || 0) + Number(amount);
    await setData(userID, { money: n, balance: n });
    return n;
  }
  async function decreaseMoney(userID, amount) {
    const d = await getData(userID);
    const cur = Number(d?.money || 0);
    if (cur < Number(amount)) return false;
    const n = cur - Number(amount);
    await setData(userID, { money: n, balance: n });
    return n;
  }
  return {
    getAll, getData, setData, delData, createData,
    increaseMoney, decreaseMoney,
    addBalance:      (id, a) => increaseMoney(id, a),
    subtractBalance: (id, a) => decreaseMoney(id, a),
    setBalance:      (id, a) => setData(id, { money: a, balance: a }),
  };
};
