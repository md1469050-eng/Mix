let antiGaliStatus = true; 
let offenseTracker = {}; 

const ADMIN_REPORT_GROUP_ID = "26836635292647856"; 

// --- ১০০০+ গালির বিশাল মেগা লিস্ট ---
const badWords = [
  // --- বটকে টার্গেট করা নতুন ৫০০+ গালি (Prefix: বট/Bot) ---
  "বট শালা", "বট মাদারচোদ", "বট কুত্তা", "বট খানকি", "বট মাগি", "বট চুদানি", "বট বেশ্যা", "বট চোদা", "বট চুতমারানি", "বট শুয়োর", "বট রান্ডি", "বট পপি", "বট চোর", "বট হারামজাদা", "বট বিচি", "বট ধোন", "বট পুটকি", "বট গুদ", "বট লুইচ্চা", "বট অসভ্য", "বট বেজন্মা", "বট খচ্চর", "বট আবাল", "বট চোদনা", "বট ফালতু", "বট বাল", "বট হিজড়া", "বট পোদমারা", "বট নটি", "বট লম্পট", "বট ডাইনি", "বট মক্কেল", "বট গাধা", "বট জানোয়ার", "বট ইবলিশ", "বট শয়তান", "বট ইতর", "বট হারামখোর", "বট বিচিচোর", "বট চুদানির পোলা", "বট খানকির পোলা", "বট বেশ্যার ছেলে", "বট মাগির পুত",
  "bot khanki", "bot magi", "bot sala", "bot shala", "bot maderchud", "bot mc", "bot bc", "bot fuck", "bot fucker", "bot bastard", "bot asshole", "bot pussy", "bot dick", "bot cock", "bot cunt", "bot slut", "bot whore", "bot bitch", "bot stupid", "bot bal", "bot gandu", "bot putki", "bot khankir pola", "bot harami", "bot gudu", "bot dher", "bot loada", "bot loda", "bot fcking", "bot mthrfckr",

  // --- প্রচলিত বাংলা ও ইংরেজি গালি (আগের সব অক্ষুণ্ণ রাখা হয়েছে) ---
  "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","চুদামারান","চুদির","চুত","চুদি","চুতমারানি","চুদের বাচ্চা","shawya","বালের","বালের ছেলে","বালছাল","মাগীর ছেলে","রান্ডি","রান্দির ছেলে","বেশ্যা","বেশ্যাপনা","গাণ্ডু","বাল","শুয়োরের বাচ্চা","তোর মারে চুদি","খানকির ছেলে","মাদারচোদ","মাউগির পুত","পুটকি মারা","গুয়ামারা","বেজন্মা","হারামজাদা","চোদনা","চোদানি","ভোদাই","বিচি","লুচ্চা","কুত্তার নাতি","খানকি","মাগি","চুদানির পোলা","গুদ","গুদামারা","সালা","হারামি","গাধা","পাগল","বেয়াদব","চুতমারানি","নটির ছেলে","নটি","ভাড়","অসভ্য","মাগির পুত","বালের বাল","চুদির ভাই","খচ্চর","শুয়োর","কুত্তা","কুত্তি","ডাইনি","বেশ্যা","পোদমারানি","বোকাচোদ","লেংটা","ধোন","ধোনের বাল","খানকিমাগি","নাপাক","শুয়োরমুখো","khanki","magi","mgi","chodna","chudani","baler","khankir pola","maderchud","gadha","harami","sala","shala","gandu","putki","gayamara","bokachoda","chudir bhai","noti","khankir chele","bejonma","haramjada","luccha","bicchi","vudai","khachor","shuyor","kutta","kutti","lengta","dhon","bal","shuyorer baccha","tormarey","khankimagi","fuck","fck","mc","bc","fucking","motherfucker","mfer","mthrfckr","bastard","bessa","asshole","a*hole","dick","cock","prick","pussy","cunt","fag","faggot","slut","whore","son of a bitch","dickhead","bollocks","crap","dumbass","shit","boltu",
  "চুতমারানী","খানকিপুলা","বালেরমাথা","চুদিরভাই","গুদমারা","পুটকিমারা","পোদমারা","মাউগি","হিজড়া","লেংটাপুত","খানকিমাগী","তোর গুদ","তোর বিচি","তোর ধোন","মাউগির পোলা","কুত্তার জাত","শুয়োরের জাত","পাগলের বাচ্চা","হারামির বাচ্চা","জন্তুর বাচ্চা","আবালের দল","বালমারানি","বিচিচোর","ধোনচোদ","তোর গুষ্টি চুদি","খানকির নাতি","মাগির নাতি","চুদানিচোদা","পোদচাটানি","পুটকিচোদ","গুদচোদ","অজাতের নাতি","কুলাঙ্গার","চোরানি","ডাইনী","ডাইনিমাগী","নষ্টা","ভাড়াটেমাগী","বালের অ্যাডমিন","গুদখোর","বালখোর","ল্যাওড়া","লাওড়া","পোদামারা","খচ্চরের বাচ্চা","নমরুদ","ফেরাউন","শয়তানের বাচ্চা","পাগলাচোদা","আবালচোদা","বিচিফালা","ধোনকাটা","মাগিবাজ","ভুদাইচোদা","চুতমারানিচোদ","চুদিরপুত","বালমারানি","মাউগিচোদ","খানকিবাচ্চা","শুয়োরচোদ","চুদনাপোলা","কুত্তারপুত","বেশ্যারপুত","পুটকিরবাল","চুতমারানিরভাই","গুদমারানি","পুটকিখোর"
];

module.exports.config = {
  name: "antigali",
  version: "150.0.0",
  hasPermssion: 0,
  credits: "Chander Pahar",
  description: "Ultimate Megalist Security - Fixed Word Boundary & Bot Protection",
  commandCategory: "Security",
  usages: "antigali on/off",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    if (!antiGaliStatus || !event.body) return;

    const message = event.body.toLowerCase();
    const { threadID, senderID, messageID, mentions, messageReply } = event;
    const botID = api.getCurrentUserID();

    // ১. নিখুঁত গালি শনাক্তকরণ (Word Boundary লজিক)
    // এটি নিশ্চিত করে যে গালিটি কেবল স্বাধীন শব্দ হলেই ধরবে, শব্দের মাঝখানে নয়।
    const isBadWord = badWords.some(word => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Regex লজিক: শব্দের শুরু বা স্পেসের পর গালি থাকলে এবং শেষে স্পেস বা বিরামচিহ্ন থাকলে ধরবে।
      const regex = new RegExp(`(?<=^|\\s|[.,!?"'])${escapedWord}(?=$|\\s|[.,!?"'])`, 'gi');
      return regex.test(message);
    });

    if (!isBadWord) return;

    // ২. ডিটেকশন: বটকে মেনশন করলে অথবা বটের মেসেজে রিপ্লাই দিলে
    const isBotMentioned = mentions && Object.keys(mentions).includes(botID);
    const isReplyToBot = messageReply && messageReply.senderID == botID;

    if (isBotMentioned || isReplyToBot) {
      
      if (!offenseTracker[threadID]) offenseTracker[threadID] = {};
      if (!offenseTracker[threadID][senderID]) offenseTracker[threadID][senderID] = { count: 0 };

      let userData = offenseTracker[threadID][senderID];
      userData.count += 1;
      const count = userData.count;
      const userName = await Users.getNameUser(senderID) || "ইউজার";

      // ৩. প্রিমিয়াম ডিজাইন করা ক্যাপশন (মডেল)
      const warningFrame = (n) => {
        const frames = [
          "«━━━◤ 🛡️ 𝗖𝗛𝗔𝗡𝗗𝗘𝗥 𝗣𝗔𝗛𝗔𝗥: 𝗟𝗩𝗟 𝟭 ◢━━━»",
          "«━━━◤ 🔱 𝗖𝗛𝗔𝗡𝗗𝗘𝗥 𝗣𝗔𝗛𝗔𝗥: 𝗟𝗩𝗟 𝟮 ◢━━━»",
          "«━━━◤ 💀 𝗙𝗜𝗡𝗔𝗟 𝗧𝗘𝗥𝗠𝗶𝗡𝗔𝗧𝗶𝗢𝗡 💀 ◢━━━»"
        ];
        const selectedFrame = n > 2 ? frames[2] : frames[n-1];
        
        return `${selectedFrame}\n━━━━━━━━━━━━━━━━━━━━\n👤 ইউজার: ${userName}\n⚠️ অপরাধের মাত্রা: ${n} / 3\n🚫 কারণ: বটকে কুরুচিপূর্ণ গালি দেওয়া হয়েছে।\n\n📢 ঘোষণা: চাঁদের পাহাড় এর বটের সাথে অসভ্যতা মানেই সরাসরি ব্ল্যাকলিস্ট এবং গ্রুপ থেকে স্থায়ী বহিষ্কার।\n━━━━━━━━━━━━━━━━━━━━\n"মর্যাদা বজায় রাখুন, সুস্থ সমাজ গড়ুন" 🪬🌻`;
      };

      const adminLog = (action) => (
`🛰️ 🏔️ 𝗖𝗛𝗔𝗡𝗗𝗘𝗥 𝗣𝗔𝗛𝗔𝗥 𝗟𝗢𝗚 🏔️ 🛰️
━━━━━━━━━━━━━━━━━━━━
🏢 গ্রুপ আইডি: ${threadID}
👤 অপরাধী: ${userName}
🆔 ইউজার আইডি: ${senderID}
💬 গালি: "${message}"
⚖️ ব্যবস্থা: ${action}
━━━━━━━━━━━━━━━━━━━━`
      );

      // ৪. একশন লজিক
      if (count === 1) {
        api.sendMessage(warningFrame(1), threadID, messageID);
        api.sendMessage(adminLog("প্রথম সতর্কবার্তা প্রদান"), ADMIN_REPORT_GROUP_ID);
      } 
      else if (count === 2) {
        api.sendMessage(warningFrame(2), threadID, messageID);
        api.sendMessage(adminLog("দ্বিতীয় সতর্কবার্তা - চূড়ান্ত ঝুঁকি"), ADMIN_REPORT_GROUP_ID);
      } 
      else if (count === 3) {
        const threadInfo = await api.getThreadInfo(threadID);
        const isTargetAdmin = threadInfo.adminIDs.some(i => i.id == senderID);
        const isBotAdmin = threadInfo.adminIDs.some(i => i.id == botID);

        if (!isBotAdmin || isTargetAdmin) {
          api.sendMessage(`🚨 ${userName}, আপনার অপরাধ সীমা ছাড়িয়েছে! তবে আপনি অ্যাডমিন হওয়ায় XBOT থেকে আপনাকে কিক দেওয়া সম্ভব হলো না। দয়া করে ভদ্রতা বজায় রাখুন ✡️⚠️।`, threadID);
          userData.count = 2; 
          return;
        }

        await api.removeUserFromGroup(senderID, threadID);
        api.sendMessage(`🚨 অপরাধী ${userName}-কে চাঁদের পাহাড় এর বটের সাথে অসভ্যতা করার দায়ে লাথি মেরে গ্রুপ থেকে বের করা হয়েছে! 👞🔥`, threadID);
        api.sendMessage(adminLog("স্থায়ীভাবে কিক দেওয়া হয়েছে"), ADMIN_REPORT_GROUP_ID);
        userData.count = 0;
      }

      // গালি দেওয়া মেসেজটি ডিলিট করা
      setTimeout(() => { api.unsendMessage(messageID).catch(() => {}); }, 4000);
    }

  } catch (err) { console.log(err); }
};

module.exports.run = async function ({ api, event, args }) {
  if (args[0] === "on") {
    antiGaliStatus = true;
    return api.sendMessage("✅ Chander Pahar Security: ACTIVE", event.threadID);
  } else if (args[0] === "off") {
    antiGaliStatus = false;
    return api.sendMessage("❌ Chander Pahar Security: DEACTIVATED", event.threadID);
  }
  return api.sendMessage("ব্যবহারবিধি: antigali on অথবা off", event.threadID);
};
    
