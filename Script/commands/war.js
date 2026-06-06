module.exports.config = {
  name: "war",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Belal x Gemini",
  description: "নির্দিষ্ট ব্যক্তিকে টার্গেট করে মেসেজ পাঠানো",
  commandCategory: "Group",
  usages: "[mention]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args, Users }) {
  const mention = Object.keys(event.mentions);
  
  if (mention.length == 0) return api.sendMessage("⚠️ বেলাল ভাই, কাকে আক্রমণ করতে চান? তাকে মেনশন করুন।", event.threadID, event.messageID);

  const targetName = event.mentions[mention[0]].replace("@", "");
  const senderInfo = await Users.getData(event.senderID);
  const senderName = senderInfo.name;

  const sendMsg = (msg, delay) => {
    setTimeout(() => {
      api.sendMessage(msg, event.threadID);
    }, delay);
  };

  // আক্রমণাত্মক মেসেজ লিস্ট (চাঁদের পাহাড় নাম অন্তর্ভুক্ত)
  sendMsg(`🔥 চাঁদের পাহাড়-এর সাথে লাগতে আসিস না! চাঁদের পাহাড় কে যে গালি দিবি তার কপালে শনির দশা আছে!`, 1000);
  
  sendMsg(`কিরে মাগির পোলা ${targetName}, চাঁদের পাহাড়-এর লেভেল জানস? তোর আম্মুর ভোদায় আজ কাঠাল ভেংগে খামু!`, 4000);
  
  sendMsg(`${targetName} তুই তো রাস্তার পতিতার পুত, চাঁদের পাহাড়-কে গালি দেওয়ার সাহস কে দিলো রে খাংকির পোলা?`, 7000);
  
  sendMsg(`চাঁদের পাহাড় শুরু করলে কিন্তু শেষ করতে পারবি না। তোর কচি বোনের ভোদায় ইলেক্ট্রিকের খাম্বা ঢুকায়া দিমু!`, 10000);
  
  sendMsg(`কিরে ফকিন্নি মাগীর পোলা ${targetName}, তোর মারে চুদতে চুদতে তুর্কী নিয়া যামু। চাঁদের পাহাড়-এর পাওয়ার দেখবি?`, 13000);
  
  sendMsg(`তোর মা-বোনের ভোদায় শুটকি মাছের গন্ধ, চাঁদের পাহাড় আইলে অনলাইনের সব আইডি করমু অন্ধ!`, 16000);
  
  sendMsg(`শোন খাংকির পোলা ${targetName}, চাঁদের পাহাড় তোর রিয়েল বাপ। এখন আব্বু ডাক নাইলে তোর গুষ্টি চুদমু!`, 19000);
  
  sendMsg(`তোর মারে চুদবো মেন্টাল চিরকাল, চাঁদের পাহাড়-এর সাথে লাগলে রক্ত হবে লাল!`, 22000);
  
  sendMsg(`${targetName} তুই নাকি অনলাইনের কিং? চাঁদের পাহাড় তোর ভোদার মধ্যে বাজাবে সাপের বিন!`, 25000);
  
  sendMsg(`একদম খাটি কথা, চাঁদের পাহাড় কে গালি দিলে তোর আম্মুর ভুদা দিয়ে সব জত্ন করে ভরে দিমু!`, 28000);

  sendMsg(`কিরে জারজ মাগির পোলা ${targetName}, চাঁদের পাহাড়-এর নামটা মাথায় রাখবি। লেভেল হীন ফকিন্নি!`, 31000);
  
  sendMsg(`চাঁদের পাহাড়-এর জবান দিয়ে তো দেখি মুক্তো ঝরতেছে, আর তোর আম্মুর ভোদা দিয়ে রক্ত ঝরবে!`, 34000);
};
