const axios = require('axios');

module.exports.config = {
  name: "time",
  version: "1.8.0",
  hasPermssion: 0,
  credits: "MahMUD (Mirai Version)",
  description: "যেকোনো দেশের সময় সুন্দরভাবে দেখুন।",
  commandCategory: "utility",
  usages: "[country/list]",
  cooldowns: 2,
};

async function getBaseApi() {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const country = args[0]?.toLowerCase() || "bangladesh";

  try {
    const baseUrl = await getBaseApi();
    const authorHeader = "MahMUD";

    // ১. লিস্ট দেখার স্টাইল
    if (country === "list") {
      const listRes = await axios.get(`${baseUrl}/api/time/list`, {
        headers: { "author": authorHeader }
      });
      
      let listMsg = "🌐 𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄 𝐂𝐎𝐔𝐍𝐓𝐑𝐈𝐄𝐒 🌐\n━━━━━━━━━━━━━━━\n";
      listMsg += listRes.data.message || "No list found.";
      listMsg += "\n━━━━━━━━━━━━━━━";
      
      return api.sendMessage(listMsg, threadID, messageID);
    }

    // ২. সময় দেখানোর সুন্দর মডেলিং
    const timeRes = await axios.get(`${baseUrl}/api/time/${country}`, {
      headers: { "author": authorHeader }
    });

    if (timeRes.data.message) {
        // এপিআই থেকে প্রাপ্ত টেক্সটকে সুন্দরভাবে সাজানো
        const rawTime = timeRes.data.message; 
        
        let stylizedMsg = `⏰ 𝐓𝐈𝐌𝐄 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ⏰\n`;
        stylizedMsg += `━━━━━━━━━━━━━━━━━━\n`;
        stylizedMsg += `🌍 𝐂𝐨𝐮𝐧𝐭𝐫𝐲: ${country.toUpperCase()}\n`;
        stylizedMsg += `🕒 𝐒𝐭𝐚𝐭𝐮𝐬: ${rawTime}\n`;
        stylizedMsg += `━━━━━━━━━━━━━━━━━━\n`;
        stylizedMsg += `✨ Have a wonderful day! ✨`;

        return api.sendMessage(stylizedMsg, threadID, messageID);
    } else {
        return api.sendMessage("⚠️ দেশ খুঁজে পাওয়া যায়নি! সঠিক নাম দিন। (যেমন: bangladesh, london)", threadID, messageID);
    }

  } catch (error) {
    return api.sendMessage("⚠️ এপিআই থেকে ডাটা নিতে সমস্যা হচ্ছে।", threadID, messageID);
  }
};
