"use strict";

module.exports = function ({ models, api }) {
  const { Users } = models;
  return {
    getAll:      (fields)       => Users.getAll(fields),
    getData:     (userID)       => Users.getData(userID),
    setData:     (userID, data) => Users.setData(userID, data),
    getNameUser: (userID)       => Users.getNameUser(userID),
    updateExp:   (userID, exp)  => Users.updateExp(userID, exp),
  };
};
