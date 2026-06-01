"use strict";

module.exports = function ({ models }) {
  const { Currencies } = models;
  return {
    getAll:          (fields)         => Currencies.getAll(fields),
    getData:         (userID)         => Currencies.getData(userID),
    setBalance:      (userID, amount) => Currencies.setBalance(userID, amount),
    addBalance:      (userID, amount) => Currencies.addBalance(userID, amount),
    subtractBalance: (userID, amount) => Currencies.subtractBalance(userID, amount),
  };
};
