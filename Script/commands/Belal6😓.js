const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/Eg42EYA.mp4",
 "https://i.imgur.com/jPQNzed.mp4",
 "https://i.imgur.com/WF9lQCl.mp4",
 "https://i.imgur.com/wk7HWFI.mp4",
 "https://i.imgur.com/pRdPYNN.mp4",
 "https://i.imgur.com/xoRMghZ.mp4",
 "https://i.imgur.com/ZoR2Mru.mp4",
 "https://i.imgur.com/j8ziGsm.mp4",
 "https://i.imgur.com/wyhf4AM.mp4",
 "https://i.imgur.com/l3Z8d2s.mp4",
 "https://i.imgur.com/cLhEAq0.mp4",
 "https://i.imgur.com/wLfloj5.mp4",
 "https://i.imgur.com/qy6jZLA.mp4",
 "https://i.imgur.com/QtIoMbW.mp4",
 "https://i.imgur.com/Bicjih0.mp4",
 "https://i.imgur.com/JG9eGAa.mp4",
 "https://i.imgur.com/GJF7cKu.mp4",
 "https://i.imgur.com/pfBwTYq.mp4",
 "https://i.imgur.com/7HIRuMa.mp4",
 "https://i.imgur.com/e8PSsNn.mp4",

];

module.exports.config = {
 name: "😓",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "😓",
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
 if (body.startsWith("😓")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n এই শোনো মন কে সবসময় হাসিখুশি রাখতে হয় 🥹 হাজারো কষ্টের মাঝেও হাসিখুশি থাকতে হয় 😅!!🥺✡️⃝🅰🅳🅼🅸🅽 চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n এই শোন মন কে সবসময় হাসিখুশি রাখতে হয় 🥹 হাজারো কষ্টের মাঝেও হাসিখুশি থাকতে হয় 😅✡️⃝🅰🅳🅼🅸🅽 চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️\n\n╰•┄┅════❁🌺❁════┅┄•╯"

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
 if (typeof data["😓"] === "undefined" || data["😓"]) data["😓"] = false;
 else data["😓"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["😓"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
