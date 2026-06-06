const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/utWM7Yv.mp4",
 "https://i.imgur.com/72TmKh9.mp4",
 "https://i.imgur.com/DQdqVFU.mp4",
 "https://i.imgur.com/irotC3u.mp4",
 "https://i.imgur.com/6N9U7TD.mp4",
 "https://i.imgur.com/5ePXpVe.mp4",
 "https://i.imgur.com/qUMxlIl.mp4",
 "https://i.imgur.com/yKLP8e7.mp4",
 "https://i.imgur.com/HUCeL99.mp4",
 "https://i.imgur.com/P88Clk0.mp4",
 "https://i.imgur.com/RAzEX6Y.mp4",
 "https://i.imgur.com/annS4fa.mp4",
 "https://i.imgur.com/JXvZA5G.mp4",
 "https://i.imgur.com/uNfSYUd.mp4",
 "https://i.imgur.com/LQ2lHlR.mp4",
 "https://i.imgur.com/3EnoX7k.mp4",
 "https://i.imgur.com/XnQDOnv.mp4",
];

module.exports.config = {
 name: "❤️",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "RAJA ViP 5X",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "❤️",
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
 if (body.startsWith("❤️")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n 🤤 একতরফা ভালোবাসা not allow not allow-!!🥺✡️⋆⃝চাদের পাহাড়✿⃝🪬\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n 😈 খাঁটি ভালবাসার প্রতি মন দে 🙃 যে তোকে ভালোবাসে না তুই তাকে ছেড়ে দে 🥱!!🥺✡️⋆⃝চাদের পাহাড়✿⃝🪬\n\n╰•┄┅════❁🌺❁════┅┄•╯"

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
 if (typeof data["❤️"] === "undefined" || data["❤️"]) data["❤️"] = false;
 else data["❤️"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["❤️"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
