/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "cat",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "SAD VEDIO",
 commandCategory: "video",
 usages: "sad vedio",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = ["cat video] \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ 
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
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
