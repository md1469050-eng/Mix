const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "black hold",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Joshua Sy", //don't change the credits please
 description: "Displays current time and bot runtime.",
 commandCategory: "Info",
 cooldowns: 1,
 dependencies: {
 "request": "",
 "fs-extra": "",
 "axios": ""
 }
};

module.exports.run = async function({ api, event }) {
 const uptime = process.uptime(),
 hours = Math.floor(uptime / 3600),
 minutes = Math.floor((uptime % 3600) / 60),
 seconds = Math.floor(uptime % 60);

 const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

 const imgLinks = [
 "https://i.imgur.com/CY5sgsk.jpeg", 
 "https://i.imgur.com/mkYGNNk.jpeg",   
 "https://i.imgur.com/gF5wIwg.jpeg",
 "https://i.imgur.com/UAmIDz2.jpeg", 
 "https://i.imgur.com/6b6DGcW.jpeg", 
 "https://i.imgur.com/FQQq8WH.jpeg"
 
 ];

 const imgPath = __dirname + "/cache/time.jpg";
 const imgURL = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 const message = `🌸 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺 🌸

✨ 𝗕𝗼𝘁 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX}

📆 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗧𝗶𝗺𝗲: ${currentTime}

⏱️ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)

💠ꘉ̸̅̊̊̊̊̊̊̊̊̊̊̊̊̇̇̇̇̇̇̇ꘉ̸̅̊̊̊̊̊̊̊̊̊̊̊̊ꘉ̸̅̊̊̊̊̊̊̊̊ꘉ̸̅̊̊̊̊̊ꘉ̸̅̊̊ꘉ̸̅ꕹ😈ꙮB̸E̸L̸A̸L̸<>B̸O̸T̸~X̸6̸6̸6̸ꙮ✡️ꕹꘉ̸̅ꘉ̸̅̊̊ꘉ̸̅̊̊̊̊̊ꘉ̸̅̊̊̊̊̊̊̊̊ꘉ̸̅̊̊̊̊̊̊̊̊̊̊̊̊ꘉ̸̅̊̊̊̊̊̊̊̊̊̊̊̊̇̇̇̇̇̇̇       💠


¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶─◥██████████◤─¶
¶──◥████████◤──¶
¶────◥████◤────¶
¶─────◥██◤─────¶

🌟┄┉❈✡️⋆⃝ চাঁদেড়~পাহাড়✿⃝🪬❈┉┄🌟`;

 const callback = () => {
 api.sendMessage({
 body: message,
 attachment: fs.createReadStream(imgPath)
 }, event.threadID, () => fs.unlinkSync(imgPath));
 };

 request(encodeURI(imgURL)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
};
