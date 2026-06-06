const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
"https://i.imgur.com/wplkWei.mp4",
"https://i.imgur.com/rJvUfXX.mp4",
"https://i.imgur.com/YqsGcBv.mp4",
"https://i.imgur.com/PAJGtA6.mp4",
"https://i.imgur.com/yViwByW.mp4",
"https://i.imgur.com/S4lsfkT.mp4",
"https://i.imgur.com/HpkE2V0.mp4",
"https://i.imgur.com/UJ7sm8I.mp4",
"https://i.imgur.com/nBLn7xd.mp4",
"https://i.imgur.com/gH2Mbjo.mp4",
"https://i.imgur.com/hsAV4ka.mp4",
"https://i.imgur.com/nh5MDCE.mp4",
"https://i.imgur.com/GiuSSoD.mp4",
"https://i.imgur.com/N53aPZ4.mp4",
"https://i.imgur.com/Q8XHg6w.mp4",
"https://i.imgur.com/sz6UNIl.mp4",
"https://i.imgur.com/qqhCxOS.mp4",
"https://i.imgur.com/nm5NgXM.mp4",
"https://i.imgur.com/c1UshIs.mp4",
"https://i.imgur.com/buyPh3t.mp4",
"https://i.imgur.com/MUt0UUh.mp4",
"https://i.imgur.com/gMd2FVP.mp4",
"https://i.imgur.com/gNG8aJQ.mp4",
"https://i.imgur.com/syezUGL.mp4",
"https://i.imgur.com/sVGMQTp.mp4",
"https://i.imgur.com/IKp5CTz.mp4",
"https://i.imgur.com/5zavCWI.mp4",
"https://i.imgur.com/9y2c7Or.mp4",
"https://i.imgur.com/q9c09K9.mp4",
"https://i.imgur.com/OOBZN84.mp4",
"https://i.imgur.com/kAwlbDl.mp4",
"https://i.imgur.com/RTfRNzT.mp4",
"https://i.imgur.com/yHEgMu8.mp4",
"https://i.imgur.com/qLoblI9.mp4",
"https://i.imgur.com/pupXfkf.mp4",
"https://i.imgur.com/gQh3AYn.mp4",
"https://i.imgur.com/Iu9GTTP.mp4",
"https://i.imgur.com/9ZAKqxG.mp4",
"https://i.imgur.com/hvAnPAO.mp4",
"https://i.imgur.com/gQQ7aaa.mp4",
"https://i.imgur.com/r5nLQiu.mp4",
"https://i.imgur.com/QyEdrLb.mp4",
"https://i.imgur.com/eaEPjVF.mp4",
"https://i.imgur.com/DqRe9FH.mp4",
"https://i.imgur.com/bw2IKyT.mp4",
"https://i.imgur.com/YgFNkXZ.mp4",
"https://i.imgur.com/6L49nb5.mp4",
"https://i.imgur.com/laoIcyQ.mp4",
"https://i.imgur.com/REzprP2.mp4",
"https://i.imgur.com/aNvdg0s.mp4",
"https://i.imgur.com/efZDbRU.mp4",
"https://i.imgur.com/pCNo8fv.mp4",
"https://i.imgur.com/B2fPeJ0.mp4",
"https://i.imgur.com/ad19GLo.mp4",
"https://i.imgur.com/wKCaeGT.mp4",
"https://i.imgur.com/Y0E2SVr.mp4",
"https://i.imgur.com/GcjqrCL.mp4",
"https://i.imgur.com/ypFYIVd.mp4",
"https://i.imgur.com/ZeVGrct.mp4",
"https://i.imgur.com/z74a749.mp4",
"https://i.imgur.com/6oyyC9w.mp4",
"https://i.imgur.com/GYvnR9n.mp4",
"https://i.imgur.com/nF0q6GO.mp4",
"https://i.imgur.com/PguATkL.mp4",
"https://i.imgur.com/tDtakqt.mp4",
"https://i.imgur.com/DfsIZ9k.mp4",
"https://i.imgur.com/GOtICEA.mp4",
"https://i.imgur.com/jbjNisc.mp4",
"https://i.imgur.com/6WehYIx.mp4",
"https://i.imgur.com/Ak5xzd5.mp4",
"https://i.imgur.com/N7djXx3.mp4",
"https://i.imgur.com/3PC4iIZ.mp4",
"https://i.imgur.com/NDUXHzX.mp4",
"https://i.imgur.com/IpuQCuP.mp4",
"https://i.imgur.com/TuoZMSW.mp4",
"https://i.imgur.com/1txGexI.mp4",
"https://i.imgur.com/038f9fd.mp4",
"https://i.imgur.com/rxmPaZ4.mp4",
"https://i.imgur.com/Mmg7rtG.mp4",
"https://i.imgur.com/ShwIxcr.mp4",
"https://i.imgur.com/vFPmj0p.mp4",
"https://i.imgur.com/B5CtmFK.mp4",
"https://i.imgur.com/iPzDfGY.mp4",
"https://i.imgur.com/drtiUKZ.mp4",
"https://i.imgur.com/QqKuye7.mp4",
"https://i.imgur.com/i8pimPi.mp4",
"https://i.imgur.com/yJVtpUd.mp4",
"https://i.imgur.com/eU1ICjP.mp4"
];

module.exports.config = {
 name: "🤯",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "auto reply to salam",
 commandCategory: "noprefix",
 usages: "🤯",
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
 if (body.startsWith("🤯")) {
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
 if (typeof data["🤯"] === "undefined" || data["🤯"]) data["🤯"] = false;
 else data["🤯"] = true;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);
 api.sendMessage(`${(data["🤯"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
