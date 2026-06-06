const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
"https://i.imgur.com/9xcUCe5.mp4",
"https://i.imgur.com/qSz9neA.mp4",
"https://i.imgur.com/BMJdnwH.mp4",
"https://i.imgur.com/wwyENfr.mp4",
"https://i.imgur.com/rfZF6RO.mp4",
"https://i.imgur.com/duHMFia.mp4",
"https://i.imgur.com/uvnI08y.mp4",
"https://i.imgur.com/ISwJzv5.mp4",
"https://i.imgur.com/aCMNkR2.mp4",
"https://i.imgur.com/0uB3SPS.mp4",
"https://i.imgur.com/EK80hqv.mp4",
"https://i.imgur.com/RpDbugy.mp4",
"https://i.imgur.com/jvN4jdS.mp4",
"https://i.imgur.com/G7QfnaW.mp4",
"https://i.imgur.com/14k5qFK.mp4",
"https://i.imgur.com/uMqCMqr.mp4",
"https://i.imgur.com/azPdymJ.mp4",
"https://i.imgur.com/COOSQUq.mp4",
"https://i.imgur.com/zd3GvPq.mp4",
"https://i.imgur.com/QY1175e.mp4",
"https://i.imgur.com/cpdbca9.mp4",
"https://i.imgur.com/VLEJO0I.mp4",
"https://i.imgur.com/Yy5QvTW.mp4",
"https://i.imgur.com/mlDbn5V.mp4",
"https://i.imgur.com/TolOwe9.mp4",
"https://i.imgur.com/XIsYwk3.mp4",
"https://i.imgur.com/wvRHkZG.mp4",
"https://i.imgur.com/OGpkxxd.mp4",
"https://i.imgur.com/50IPd7p.mp4",
"https://i.imgur.com/oIQAhA2.mp4",
"https://i.imgur.com/ieKQUKX.mp4",
"https://i.imgur.com/Xq4ihIp.mp4",
"https://i.imgur.com/FfSIcpm.mp4",
"https://i.imgur.com/zcWg4vK.mp4",
"https://i.imgur.com/yyTHAeh.mp4",
"https://i.imgur.com/VDFkJGp.mp4",
"https://i.imgur.com/gbl6tkt.mp4",
"https://i.imgur.com/flcFv9i.mp4",
"https://i.imgur.com/IquYhR9.mp4",
"https://i.imgur.com/nDVusUG.mp4",
"https://i.imgur.com/Vp9Hyum.mp4",
"https://i.imgur.com/ACkB5wx.mp4",
"https://i.imgur.com/h85wqvu.mp4",
"https://i.imgur.com/ap89DM2.mp4",
"https://i.imgur.com/bd4Np6n.mp4",
"https://i.imgur.com/DRaS1di.mp4",
"https://i.imgur.com/G2P6Ll7.mp4",
 
];

module.exports.config = {
 name: "😅",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "😅",
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
 if (body.startsWith("😅")) {
 const rahad = [
 "╭•┄┅════❁✡️❁════┅┄•╮\n \n🙂 অযথা মায়া বাড়িয়ে লাভ নাই 🙅 ভুলে যাও আবার নতুন করে শুরু করো 🥹 🚫✦─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯",
 "╭•┄┅════❁✡️❁════┅┄•╮\n\n 🙂 এই ভার্চুয়াল জগতে কাউকে ভালবাসতে নেই ⚠️ পারলে কাছের মানুষকে ভালোবাসো 🫶❤️🚫✦─꯭─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯"

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
 if (typeof data["😅"] === "undefined" || data["😅"]) data["😅"] = false;
 else data["😅"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["😅"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
