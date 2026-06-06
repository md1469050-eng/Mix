const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [ 
"https://i.imgur.com/2MOezkV.mp4",
  "https://i.imgur.com/t9qQYXY.mp4",
  "https://i.imgur.com/sfrCllI.mp4",
  "https://i.imgur.com/wuWm4Zf.mp4",
  "https://i.imgur.com/8Cze5eR.mp4",
  "https://i.imgur.com/WbVxFiZ.mp4",
  "https://i.imgur.com/5pZ7avd.mp4",
  "https://i.imgur.com/rwJzo4j.mp4",
  "https://i.imgur.com/IIuGEnP.mp4",
  "https://i.imgur.com/PTcw69V.mp4",
  "https://i.imgur.com/X1UyvYg.mp4",
  "https://i.imgur.com/BXuOPCu.mp4",
  "https://i.imgur.com/iYCVlFm.mp4",
  "https://i.imgur.com/ToEnOF4.mp4",
  "https://i.imgur.com/CHe8W0x.mp4",
  "https://i.imgur.com/1MjqIFD.mp4",
  "https://i.imgur.com/OYsv5kE.mp4",
  "https://i.imgur.com/OuzACnd.mp4",
  "https://i.imgur.com/vBc1xu0.mp4",
  "https://i.imgur.com/ptGiFh3.mp4",
  "https://i.imgur.com/kEd15eO.mp4",
  "https://i.imgur.com/sUug0bN.mp4",
  "https://i.imgur.com/kkVEHsh.mp4",
  "https://i.imgur.com/AiAvenh.mp4",
  "https://i.imgur.com/8iKZtJH.mp4",
  "https://i.imgur.com/ISa89fg.mp4",
  "https://i.imgur.com/lzWbYuo.mp4",
];

module.exports.config = {
 name: "🏈",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "🏈",
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
 if (body.startsWith("🏈")) {
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
 if (typeof data["🏈"] === "undefined" || data["🏈"]) data["🏈"] = false;
 else data["🏈"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["🏈"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
