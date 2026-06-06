const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [ 
"https://i.imgur.com/h0mjYx7.mp4",
"https://i.imgur.com/Zn7Zpd1.mp4",
"https://i.imgur.com/uEKXuVP.mp4",
"https://i.imgur.com/rVjI8IW.mp4",
"https://i.imgur.com/czxqEQ3.mp4",
"https://i.imgur.com/VgbACHd.mp4",
"https://i.imgur.com/OxFUAr1.mp4",
"https://i.imgur.com/bTk2TW2.mp4",
"https://i.imgur.com/opRjsSP.mp4",
"https://i.imgur.com/uPhF2vE.mp4",
"https://i.imgur.com/jWxUxHQ.mp4",
"https://i.imgur.com/RCOtpEU.mp4",
"https://i.imgur.com/9XE6NIW.mp4",
"https://i.imgur.com/DRJFwI6.mp4",
"https://i.imgur.com/LjUUtVD.mp4",
"https://i.imgur.com/RDPhcLQ.mp4",
"https://i.imgur.com/EU4MoFc.mp4",
"https://i.imgur.com/iZ1nDoh.mp4"
];

module.exports.config = {
 name: "😼",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "😼",
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
 if (body.startsWith("😼")) {
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
 if (typeof data["😼"] === "undefined" || data["😼"]) data["😼"] = false;
 else data["😼"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["😼"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
