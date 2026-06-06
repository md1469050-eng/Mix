const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/snsekFD.mp4",
 "https://i.imgur.com/Qj9p1TM.mp4",
 "https://i.imgur.com/o4cpnt2.mp4",
 "https://i.imgur.com/irchBNp.mp4",
 "https://i.imgur.com/hZfBBc7.mp4",
 "https://i.imgur.com/hBeU4Kj.mp4",
 "https://i.imgur.com/QnJlOlx.mp4",
 "https://i.imgur.com/Vn3Uvhs.mp4",
 "https://i.imgur.com/WgsyzST.mp4",
 "https://i.imgur.com/HEl143w.mp4",
 "https://i.imgur.com/6q6ujMF.mp4",
 "https://i.imgur.com/uIJjNEB.mp4",
 "https://i.imgur.com/YQxrdA7.mp4",
 "https://i.imgur.com/07MqWSc.mp4",
 "https://i.imgur.com/AfOQNtk.mp4",
 "https://i.imgur.com/1GBN1nd.mp4",
 "https://i.imgur.com/lGsJmtY.mp4",
 "https://i.imgur.com/VKJ0oPD.mp4",
 "https://i.imgur.com/3w4jKLV.mp4",
 "https://i.imgur.com/BSI2p5Y.mp4",

];

module.exports.config = {
 name: "😩",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "😩",
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
 if (body.startsWith("😩")) {
 const rahad = [
 "╭•┄┅════❁🌺❁════┅┄•╮\n \n আমার বস চাঁদের পাহাড় কে কেউ একটা গার্লফ্রেন্ড দে !!🥺❈✡️⋆⃝ চাঁদেড়~পাহাড়✿⃝🪬❈\n\n╰•┄┅════❁🌺❁════┅┄•╯",
 "╭•┄┅════❁🌺❁════┅┄•╮\n\n আমার বস চাঁদের পাহাড় কে কেউ একটা গার্লফ্রেন্ড দে !🥺🚫❈✡️⋆⃝চাদের পাহাড়✿⃝🪬❈\n\n╰•┄┅════❁🌺❁════┅┄•╯"

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
 if (typeof data["😩"] === "undefined" || data["😩"]) data["😩"] = false;
 else data["😩"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["😩"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
