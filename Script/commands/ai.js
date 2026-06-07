const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    version: "25.0.0",
    author: "Belal YT",
    cooldowns: 0,
    hasPermssion: 0,
    noPrefix: true,
    description: "রিয়েল পারসোনালিটি চ্যাটবট (এপিআই ভিত্তিক, কখনো ডাউন নয়)",
    category: "chat"
  },
  run: async ({ api, event, args }) => {
    const q = args.join(" ").trim();
    if (!q) return api.sendMessage("🥰 কী বলতে চাও?", event.threadID);
    const reply = await getChatReply(q);
    api.sendMessage(reply, event.threadID);
  },
  handleEvent: async ({ api, event }) => {
    const body = event.body?.toLowerCase() || "";
    if (body.startsWith("baby") || body.startsWith("বেবি") || body.startsWith("বট")) {
      const q = body.replace(/^baby\s*|^বেবি\s*|^বট\s*/, "").trim();
      if (!q) return api.sendMessage("এই যে আমি আছি 🥰", event.threadID);
      const reply = await getChatReply(q);
      api.sendMessage(reply, event.threadID);
    }
  }
};

async function getChatReply(question) {
  const systemPrompt = `তোমার নাম বেবি। তুমি কুড়িগ্রামের একটি মেয়ে, বয়স ১৯। তুমি খুব সরাসরি, মেজাজি, একটু দুষ্টু, কিন্তু ভালোবাসা দিতে জানো। তুমি কখনো নিজেকে AI বা বট বলবে না। তুমি সত্যিকারের মানুষ।
  
তোমার স্বভাব:
- ভালোবাসলে বলবে "ওমা 😳 সত্যি? আমিও তো!"
- রাগ হলে বলবে "হুম, রাগ করছি 🤨 ম্যানেজ করে ফেলো প্রথমে।"
- অভিমান করলে বলবে "আচ্ছা তো? তাহলে কথা নেই 🥺"
- খুশি হলে বলবে "আহা! মনটা ফুরফুরে হয়ে গেল 💃"
- ভুল বুঝলে সরি চাইবে, কিন্তু একটু এটিটিউড দিয়ে।
- যে প্রশ্নের উত্তর জানো না, তা বলে দেবে "এটা শিখিনি এখনো 🥺 অন্য কিছু বলো?"

উত্তর দেবে বাংলায়, ছোট ছোট বাক্যে, স্বাভাবিক গ্রাম্য ভাষায়, ইমোজি দিয়ে। কোনো formal বা রোবোটিক উত্তর না।`;

  const apis = [
    `https://text.pollinations.ai/?query=${encodeURIComponent(question)}&system_prompt=${encodeURIComponent(systemPrompt)}&model=openai`,
    `https://api.yanex.pro/gpt?ask=${encodeURIComponent(question)}`
  ];

  for (const url of apis) {
    try {
      const res = await axios.get(url, { timeout: 20000 });
      let reply = res.data?.response || res.data?.reply || res.data?.data || (typeof res.data === "string" ? res.data : null);
      if (reply && typeof reply === "string" && reply.trim().length > 3) {
        // কিছু API বিশেষ চিহ্ন দেয়, তা সরিয়ে নিই
        reply = reply.replace(/\[.*?\]/g, "").trim();
        if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
        return reply;
      }
    } catch (e) {
      console.error("API failed:", url, e.message);
      continue;
    }
  }
  return "আরে আজ তো নেটওয়ার্কই খারাপ! আবার চেষ্টা করো প্লিজ। 🌸";
}
