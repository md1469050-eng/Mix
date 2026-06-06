const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
"https://i.imgur.com/rNwELQO.mp4",
"https://i.imgur.com/wsg3Rrl.mp4",
"https://i.imgur.com/BwhgoLH.mp4",
"https://i.imgur.com/hqmthTo.mp4",
"https://i.imgur.com/XAeQ7dZ.mp4",
"https://i.imgur.com/lACNyYH.mp4",
"https://i.imgur.com/rF1KsY6.mp4",
"https://i.imgur.com/8OBs0D5.mp4",
"https://i.imgur.com/maOPqvS.mp4",
"https://i.imgur.com/3ToiYt3.mp4",
"https://i.imgur.com/WTYeMuo.mp4",
"https://i.imgur.com/mQx6MMQ.mp4",
"https://i.imgur.com/43odzaZ.mp4",
"https://i.imgur.com/HviqPJ7.mp4",
"https://i.imgur.com/a9qf3YY.mp4",
"https://i.imgur.com/0iChZmx.mp4",
"https://i.imgur.com/Zo8n1ue.mp4",
"https://i.imgur.com/2OB8B7v.mp4",
"https://i.imgur.com/Ht65D0D.mp4",
"https://i.imgur.com/s8zDqDM.mp4",
"https://i.imgur.com/uI23MOd.mp4",
"https://i.imgur.com/WACtPmB.mp4",
"https://i.imgur.com/73INTxp.mp4",
"https://i.imgur.com/44hbaFC.mp4",
"https://i.imgur.com/gcN6mAr.mp4",
"https://i.imgur.com/KPm6xz1.mp4",
"https://i.imgur.com/7qBD4i5.mp4",
"https://i.imgur.com/wSEZzG1.mp4",
"https://i.imgur.com/amALFuc.mp4",
"https://i.imgur.com/I0p19D9.mp4",
"https://i.imgur.com/2565geu.mp4",
"https://i.imgur.com/tH6ytPt.mp4",
"https://i.imgur.com/dPjdwNv.mp4",
"https://i.imgur.com/sxxnY24.mp4",
"https://i.imgur.com/W63UuQa.mp4",
"https://i.imgur.com/wRYFgga.mp4",
"https://i.imgur.com/0E8nHXQ.mp4",
"https://i.imgur.com/MVQCxIc.mp4",
"https://i.imgur.com/QelIUzl.mp4",
"https://i.imgur.com/mx8tOzj.mp4",
"https://i.imgur.com/oU8EeyA.mp4",
"https://i.imgur.com/8IucY2M.mp4",
"https://i.imgur.com/O8hgmwz.mp4",
"https://i.imgur.com/dqe2dYk.mp4",
"https://i.imgur.com/eYl30QN.mp4",
"https://i.imgur.com/IgN88q1.mp4",
"https://i.imgur.com/vHz6RX3.mp4",
"https://i.imgur.com/zBBjZiV.mp4",
"https://i.imgur.com/JO66ubD.mp4",
"https://i.imgur.com/r6n78LS.mp4",
"https://i.imgur.com/f361AiP.mp4",
"https://i.imgur.com/cn2ruFN.mp4",
"https://i.imgur.com/3Y9qyif.mp4",
"https://i.imgur.com/OXP4s0b.mp4",
"https://i.imgur.com/2YMDr2C.mp4",
"https://i.imgur.com/JsBX6Ms.mp4",
"https://i.imgur.com/fBhMO4S.mp4",
"https://i.imgur.com/Dxl2IIQ.mp4",
"https://i.imgur.com/LjvMBxw.mp4",
"https://i.imgur.com/hcGxIM8.mp4",
"https://i.imgur.com/lV5nnxN.mp4",
"https://i.imgur.com/szyd8jn.mp4",
"https://i.imgur.com/TVfoUAU.mp4",
"https://i.imgur.com/vvNGTvj.mp4",
"https://i.imgur.com/j3dn1ZZ.mp4",
"https://i.imgur.com/YgX4V1f.mp4",
"https://i.imgur.com/BPR3pDl.mp4",
"https://i.imgur.com/1oiCUeB.mp4",
"https://i.imgur.com/9WYPWCx.mp4",
"https://i.imgur.com/D46NHxe.mp4",
"https://i.imgur.com/P7RUsaq.mp4",
"https://i.imgur.com/U4xPhvU.mp4",
"https://i.imgur.com/WurBdk6.mp4",
"https://i.imgur.com/9enQkCF.mp4",
"https://i.imgur.com/BcK5wXS.mp4",
"https://i.imgur.com/KciORJy.mp4",
"https://i.imgur.com/H3KqDmm.mp4",
"https://i.imgur.com/JcQy6Ja.mp4",
"https://i.imgur.com/nYIoEER.mp4",
"https://i.imgur.com/yFPYdUu.mp4",
"https://i.imgur.com/xxG4HfX.mp4",
"https://i.imgur.com/vlBE9Kq.mp4",
"https://i.imgur.com/ThpVqzM.mp4",
"https://i.imgur.com/dMQzeFk.mp4",
"https://i.imgur.com/IF4fpww.mp4",
"https://i.imgur.com/I3GW4ze.mp4",
"https://i.imgur.com/bRaOeF1.mp4",
"https://i.imgur.com/kRyJNwR.mp4",
"https://i.imgur.com/fkwVT3I.mp4",
"https://i.imgur.com/99agLXF.mp4",
"https://i.imgur.com/zXquBxZ.mp4",
"https://i.imgur.com/SLnltUj.mp4",
"https://i.imgur.com/7P6yCDm.mp4",
"https://i.imgur.com/VbpbNDC.mp4",
"https://i.imgur.com/z5LiMtF.mp4",
"https://i.imgur.com/18r3u6L.mp4",
"https://i.imgur.com/zO31aVN.mp4",
"https://i.imgur.com/CE9keFo.mp4",
"https://i.imgur.com/paS5Ny9.mp4",
"https://i.imgur.com/2D2Qiyb.mp4",
"https://i.imgur.com/bc5U26w.mp4",
"https://i.imgur.com/xWnpRBn.mp4",
"https://i.imgur.com/NXb21Bk.mp4",
"https://i.imgur.com/OW5Le4f.mp4",
"https://i.imgur.com/kJlC1by.mp4",
"https://i.imgur.com/X5rA5Fm.mp4",
"https://i.imgur.com/2miZsu9.mp4",
"https://i.imgur.com/EHUMM3i.mp4",
 
];

module.exports.config = {
 name: "🌚",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "🌚",
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
 if (body.startsWith("🌚")) {
 const rahad = [
 "╭•┄┅════❁✡️❁════┅┄•╮\n \n🙂 এই পৃথিবীতে সবাই স্বার্থপর এবং বেইমান 🥹 🚫✦─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯",
 "╭•┄┅════❁✡️❁════┅┄•╮\n\n 🙂  তুই বেইমান 🚫✦─꯭─⃝‌‌𝔹𝔼𝕃𝔸𝕃 𝔹𝕆𝕋 ✡️✦\n\n╰•┄┅════❁✡️❁════┅┄•╯"

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
 if (typeof data["🌚"] === "undefined" || data["🌚"]) data["🌚"] = false;
 else data["🌚"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["🌚"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
