const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
  "https://i.imgur.com/qMRb8gV.mp4",
  "https://i.imgur.com/NyP2t3P.mp4",
  "https://i.imgur.com/T8VYQPf.mp4",
  "https://i.imgur.com/IxvfFMU.mp4",
  "https://i.imgur.com/Qzn0SkJ.mp4",
  "https://i.imgur.com/scsmUOU.mp4",
  "https://i.imgur.com/2VYKap2.mp4",
  "https://i.imgur.com/9txmYB9.mp4",
  "https://i.imgur.com/7Du8tpN.mp4",
  "https://i.imgur.com/zDYJppV.mp4",
  "https://i.imgur.com/YXvcTnI.mp4",
  "https://i.imgur.com/vmyKKEP.mp4",
  "https://i.imgur.com/J3p5uso.mp4",
  "https://i.imgur.com/fAlm0xd.mp4",
  "https://i.imgur.com/jwY1tI4.mp4",
];
];

module.exports.config = {
 name: "🫀",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "🫀",
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
 if (body.startsWith("🫀")) {
 const rahad = [
 "╭•┄┅════❁✡️❁════┅┄•╮\n \n ✦─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯",
 "╭•┄┅════❁✡️❁════┅┄•╮\n\n ✦─꯭─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯"

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
 if (typeof data["🫀"] === "undefined" || data["🫀"]) data["🫀"] = false;
 else data["🫀"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["🫀"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
