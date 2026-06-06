const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/8mk7h2N.mp4",
 "https://i.imgur.com/M5xwDaR.mp4",
 "https://i.imgur.com/5NZ7ru4.mp4",
 "https://i.imgur.com/b7uB6Xe.mp4",
 "https://i.imgur.com/OvMzsAt.mp4",
 "https://i.imgur.com/NPhMK78.mp4",
 "https://i.imgur.com/jIsV6Jk.mp4",
 "https://i.imgur.com/oX9rrs5.mp4",
 "https://i.imgur.com/a0gWKpv.mp4",
 "https://i.imgur.com/mh6FmYX.mp4",
 "https://i.imgur.com/PHUmJjp.mp4",
 "https://i.imgur.com/aYXzajE.mp4",
 "https://i.imgur.com/cBob7or.mp4",
 "https://i.imgur.com/p1Z7Y5O.mp4",
 "https://i.imgur.com/o3pgyNF.mp4",
 "https://i.imgur.com/RgOVNsO.mp4",
 "https://i.imgur.com/WbZv8NH.mp4",
 "https://i.imgur.com/Lvk0zF3.mp4",
 "https://i.imgur.com/YOtgOLy.mp4",
 "https://i.imgur.com/z6AwLPn.mp4",
 "https://i.imgur.com/aubvaC1.mp4",
 "https://i.imgur.com/8FlBYJ1.mp4",
 "https://i.imgur.com/dDALpGR.mp4",
 "https://i.imgur.com/rRq6PiY.mp4",
 "https://i.imgur.com/z6vYHbL.mp4",
 "https://i.imgur.com/673NuRQ.mp4",
 "https://i.imgur.com/LxD10dW.mp4",
 "https://i.imgur.com/GDiNLJW.mp4",
 "https://i.imgur.com/YD0n1rK.mp4",
 "https://i.imgur.com/x3rD2b4.mp4",
 "https://i.imgur.com/eSlJD2W.mp4",
 "https://i.imgur.com/TkndTbc.mp4",
 "https://i.imgur.com/u3YZzYB.mp4",
 
];

module.exports.config = {
 name: "😸",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "😸",
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
 if (body.startsWith("😸")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n হাসবি না বাপির দল 😾🔪❈✡️⋆⃝চাদের পাহাড়✿⃝🪬❈!!\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n আসবি কিন্তু দাঁত বাইর করবি না 🫢🔪❈✡️⋆⃝চাদের পাহাড়✿⃝🪬❈-!!\n\n╰•┄┅════❁🌺❁════┅┄•╯"

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
 if (typeof data["😸"] === "undefined" || data["😸"]) data["😸"] = false;
 else data["😸"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["😸"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
