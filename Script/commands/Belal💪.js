const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/HtKWgma.mp4",
"https://i.imgur.com/T0YDigG.mp4",
"https://i.imgur.com/n0vIGPL.mp4",
"https://i.imgur.com/3DmuzVK.mp4",
"https://i.imgur.com/3T9MDRN.mp4",
"https://i.imgur.com/OKe4qU9.mp4",
"https://i.imgur.com/mu9406G.mp4",
"https://i.imgur.com/soOacql.mp4",
"https://i.imgur.com/CDdnb47.mp4",
"https://i.imgur.com/3ejxOV4.mp4",
"https://i.imgur.com/HsX02Pw.mp4",
];

module.exports.config = {
 name: "💪",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "💪",
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
 if (body.startsWith("💪")) {
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
 if (typeof data["💪"] === "undefined" || data["💪"]) data["💪"] = false;
 else data["💪"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["💪"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
