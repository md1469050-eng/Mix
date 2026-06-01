"use strict";

module.exports = function ({ models, api }) {
  const { Threads } = models;
  return {
    getAll:   ()              => Threads.getAll(),
    getData:  (threadID)      => Threads.getData(threadID),
    setData:  (threadID, data)=> Threads.setData(threadID, data),
    getInfo:  (threadID)      => Threads.getInfo(threadID),
  };
};
