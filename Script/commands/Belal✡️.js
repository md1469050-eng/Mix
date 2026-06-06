const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
"https://i.imgur.com/RNniL1D.mp4",
"https://i.imgur.com/uLLXXOr.mp4",
"https://i.imgur.com/P0nqOFF.mp4",
"https://i.imgur.com/kJq05aY.mp4",
"https://i.imgur.com/SKlhZcy.mp4",
"https://i.imgur.com/8sAJr2P.mp4",
"https://i.imgur.com/R9VZSVv.mp4",
"https://i.imgur.com/v8EFMg5.mp4",
"https://i.imgur.com/A67pdJi.mp4",
"https://i.imgur.com/qN9dXAM.mp4",
"https://i.imgur.com/kS3tLDb.mp4",
"https://i.imgur.com/nmkA9PI.mp4",
];

module.exports.config = {
 name: "✡️",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "✡️",
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
 if (body.startsWith("✡️")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n My group black hold ✡️⃝🅰🅳🅼🅸🅽 চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️।\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n my group black hold ✡️⃝🅰🅳🅼🅸🅽 চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️\n\n╰•┄┅════❁🌺❁════┅┄•╯"

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
 if (typeof data["✡️"] === "undefined" || data["✡️"]) data["✡️"] = false;
 else data["✡️"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["✡️"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
