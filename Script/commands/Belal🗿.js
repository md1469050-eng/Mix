const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
"https://i.imgur.com/8oD7nna.mp4",
"https://i.imgur.com/y4k4Dsu.mp4",
"https://i.imgur.com/dMoK0IU.mp4",
"https://i.imgur.com/9bijmf0.mp4",
"https://i.imgur.com/fsKM65P.mp4",
"https://i.imgur.com/HPmlxfb.mp4",
"https://i.imgur.com/M7DZthc.mp4",
"https://i.imgur.com/ubP5YNs.mp4",
"https://i.imgur.com/3YuVTDK.mp4",
"https://i.imgur.com/cUYfq5q.mp4",
"https://i.imgur.com/2nwz1w7.mp4",
"https://i.imgur.com/Nx24FJT.mp4",
"https://i.imgur.com/QdyTYvP.mp4",
"https://i.imgur.com/kLig6gs.mp4",
"https://i.imgur.com/JjFpv33.mp4",
"https://i.imgur.com/LrgZ6AQ.mp4",
"https://i.imgur.com/0vdXgqy.mp4",
"https://i.imgur.com/j0ZRTsK.mp4",
"https://i.imgur.com/ldFCLeg.mp4",
"https://i.imgur.com/yRMsoBp.mp4",
"https://i.imgur.com/j58uQF3.mp4",
"https://i.imgur.com/FXoZWeb.mp4",
"https://i.imgur.com/hh74fyx.mp4",
"https://i.imgur.com/xZZjYg5.mp4",
"https://i.imgur.com/yhJ0pJa.mp4",
"https://i.imgur.com/nhepxpy.mp4",
"https://i.imgur.com/nDmLYbd.mp4",
"https://i.imgur.com/hy0zQVY.mp4",
"https://i.imgur.com/613Xtae.mp4",
"https://i.imgur.com/7DdPfdR.mp4",
"https://i.imgur.com/zTu3f6P.mp4",
"https://i.imgur.com/2mfqSRV.mp4",
"https://i.imgur.com/uMAWwsq.mp4",
"https://i.imgur.com/mbyWvSm.mp4",
"https://i.imgur.com/475SzYH.mp4",
"https://i.imgur.com/7jyhPmv.mp4",
"https://i.imgur.com/xR9nZ8X.mp4",
"https://i.imgur.com/vwQGECo.mp4",
"https://i.imgur.com/rtirjqo.mp4",
"https://i.imgur.com/vUkczEc.mp4",
"https://i.imgur.com/dTqyF6k.mp4",
"https://i.imgur.com/AEW2ihS.mp4",
"https://i.imgur.com/LP4ALSu.mp4",
"https://i.imgur.com/UEQ0P8Z.mp4",
"https://i.imgur.com/AbyRhXx.mp4",
"https://i.imgur.com/xLxx4kx.mp4",
"https://i.imgur.com/47qpNec.mp4",
"https://i.imgur.com/v1fjEFz.mp4",
"https://i.imgur.com/sbXgiZz.mp4",
"https://i.imgur.com/YFTUXxU.mp4",
"https://i.imgur.com/slEsqd8.mp4",
"https://i.imgur.com/f5bc9lH.mp4",
"https://i.imgur.com/EQ3mXQA.mp4",
"https://i.imgur.com/XRw4h3j.mp4",
"https://i.imgur.com/ejLqnVS.mp4",
"https://i.imgur.com/DMPFxCf.mp4",
"https://i.imgur.com/Qno2K6s.mp4",
"https://i.imgur.com/FWw1ecZ.mp4",
"https://i.imgur.com/aU3LgZE.mp4",
"https://i.imgur.com/N0kGERB.mp4",
"https://i.imgur.com/R8dymi1.mp4",
"https://i.imgur.com/SVpa8eJ.mp4",
"https://i.imgur.com/9q4Lvjc.mp4",
"https://i.imgur.com/0WpUTVY.mp4",
"https://i.imgur.com/P9ZaYxY.mp4",
"https://i.imgur.com/cM9Mj3a.mp4",
"https://i.imgur.com/QIN4oiF.mp4",
"https://i.imgur.com/Vo6diGA.mp4",
"https://i.imgur.com/ZPSoJJM.mp4",
"https://i.imgur.com/WojmwYZ.mp4",
"https://i.imgur.com/a2u3Cbg.mp4",
"https://i.imgur.com/Oqz2gCB.mp4",
"https://i.imgur.com/7j9dB7M.mp4",
"https://i.imgur.com/KlwK3DA.mp4",
"https://i.imgur.com/wIPIlAr.mp4",
"https://i.imgur.com/eFQ6A7y.mp4",
"https://i.imgur.com/gZcos9C.mp4",
"https://i.imgur.com/nsg27cy.mp4",
"https://i.imgur.com/5DVAFq6.mp4",
"https://i.imgur.com/Af92cZX.mp4",
"https://i.imgur.com/ZOGzFf2.mp4",
"https://i.imgur.com/ATnr54L.mp4",
"https://i.imgur.com/J2y4eCq.mp4",
"https://i.imgur.com/5gT1Hxh.mp4",
 
];

module.exports.config = {
 name: "🗿",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Chat",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "🗿",
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
 if (body.startsWith("🗿")) {
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
 if (typeof data["🗿"] === "undefined" || data["🗿"]) data["🗿"] = false;
 else data["🗿"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["🗿"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
