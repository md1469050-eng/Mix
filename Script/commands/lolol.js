var mysterious = "Siegfried Sama";
const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "lolol",
  version: "3.0.0",
  hasPermssion: 0,
  credits: `${mysterious}`,
  description: "girl to boy slap",
  commandCategory: "...",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = ["https://i.imgur.com/NkrYiBm.gif",
"https://i.imgur.com/asdhmk7.gif",
"https://i.imgur.com/WGciUZy.gif",
"https://i.imgur.com/167cwlb.gif",
"https://i.imgur.com/DHi5Nj6.gif",
"https://i.imgur.com/BZyQ1LT.gif",
"https://i.imgur.com/OuPSeR2.gif",
"https://i.imgur.com/cqSLGhG.gif",
"https://i.imgur.com/8rkh89x.gif",
"https://i.imgur.com/AuIyf4r.gif",
"https://i.imgur.com/WOjcNBV.gif" ];
   var mention = Object.keys(event.mentions);
     let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Mention 1 person that you want to f*** you ", threadID, messageID);
   var callback = () => api.sendMessage({body:`╭──────•◈•───────╮\n ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄ \n\n 🖕🖕 ${tag}` + `\n\n 😎🖕Fuck you Bro_ 🤏\n\n ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄ ッ\n╰──────•◈•───────╯`,mentions: [{tag: tag,id: Object.keys(event.mentions)[0]}],attachment: fs.createReadStream(__dirname + "/cache/slap.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/slap.gif"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/slap.gif")).on("close",() => callback());
              }
