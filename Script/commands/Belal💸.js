const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [ 
"https://i.imgur.com/efujeSb.mp4",
  "https://i.imgur.com/9qHtAH5.mp4",
  "https://i.imgur.com/DvIy3uB.mp4",
  "https://i.imgur.com/HUMT7th.mp4",
  "https://i.imgur.com/5JDuFFO.mp4",
  "https://i.imgur.com/ufcsl43.mp4",
  "https://i.imgur.com/0AwVg2T.mp4",
  "https://i.imgur.com/8yGG9Qk.mp4",
  "https://i.imgur.com/pWLAvCN.mp4",
  "https://i.imgur.com/QihauiW.mp4",
  "https://i.imgur.com/vKNO5Td.mp4",
  "https://i.imgur.com/mhKPFV6.mp4",
  "https://i.imgur.com/d7ZFMMr.mp4",
  "https://i.imgur.com/mjbF8EZ.mp4",
  "https://i.imgur.com/Mt2qsIh.mp4",
  "https://i.imgur.com/ALER7eP.mp4",
  "https://i.imgur.com/sHtmmvg.mp4",
  "https://i.imgur.com/FEOd8rE.mp4",
  "https://i.imgur.com/EZEb7IN.mp4",
  "https://i.imgur.com/mLOWOmY.mp4",
  "https://i.imgur.com/FmuwMxv.mp4"
];

module.exports.config = {
 name: "💸",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "💸",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
 const content = event.body ? event.body : '';
 const body = content.toLowerCase();
 if (body.startsWith("💸")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n\n╰•┄┅════❁🌺❁════┅┄•╯"

 ];
 const rahad2 = rahad[Math.floor(Math.random() * rahad.length)];

 const callback = () => api.sendMessage({
 body: `${rahad2}`,
 attachment: fs.createReadStream(__dirname + "/cache/2024.mp4")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/2024.mp4"), event.messageID);

 const requestStream = request(encodeURI(link[Math.floor(Math.random() * link.length)]));
 requestStream.pipe(fs.createWriteStream(__dirname + "/cache/2024.mp4")).on("close", () => callback());
 return requestStream;
 }
};

module.exports.languages = {
 "vi": {
 "on": "Dùng sai cách rồi lêu lêu",
 "off": "sv ngu, đã bão dùng sai cách",
 "successText": `🧠`,
 },
 "en": {
 "on": "on",
 "off": "off",
 "successText": "success!",
 }
};

module.exports.run = async ({ api, event, Threads, getText }) => {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data;
 if (typeof data["💸"] === "undefined" || data["💸"]) data["💸"] = false;
 else data["💸"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["💸"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
