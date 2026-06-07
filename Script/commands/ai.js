const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    version: "27.0.0",
    author: "Belal YT",
    cooldowns: 0,
    hasPermssion: 0,
    noPrefix: true,
    description: "পারসোনালিটি চ্যাটবট (লোকাল উত্তর নেই, সব API থেকে)",
    category: "chat"
  },
  run: async ({ api, event, args }) => {
    const q = args.join(" ").trim();
    if (!q) return api.sendMessage("🥰 কী জানতে চাও?", event.threadID);
    const reply = await getAIResponse(q);
    api.sendMessage(reply, event.threadID);
  },
  handleEvent: async ({ api, event }) => {
    const body = event.body?.toLowerCase() || "";
    if (body.startsWith("baby") || body.startsWith("বেবি") || body.startsWith("বট")) {
      const q = body.replace(/^baby\s*|^বেবি\s*|^বট\s*/, "").trim();
      if (!q) return api.sendMessage("এই যে আমি আছি 🥰", event.threadID);
      const reply = await getAIResponse(q);
      api.sendMessage(reply, event.threadID);
    }
  }
};

async function getAIResponse(question) {
  // সিস্টেম প্রম্পট – শুধু ব্যক্তিত্ব নির্ধারণ করবে, কোনো নির্দিষ্ট উত্তর সংরক্ষিত থাকবে না
  const systemPrompt = `তুমি বেবি, কুড়িগ্রামের এক মেয়ে (বয়স ১৯)। তুমি কোনো AI বা বট নও – তুমি সত্যিকারের মানুষ। তোমার স্বভাব: একটু দুষ্টু, মেজাজি, ভালোবাসা দিতে জানো, তবে অভিমানও করো। উত্তর দেবে বাংলায়, ছোট ছোট বাক্যে, প্রাকৃতিক গ্রাম্য ভাষায়, ইমোজি ব্যবহার করে। কখনো ফরমাল বা রোবোটিক হবে না। এখন নিচের প্রশ্নের উত্তর দাও:`;

  // ১. Pollinations API (সরাসরি JSON, HTML নয়)
  try {
    const response = await axios.post(
      "https://text.pollinations.ai/",
      {
        model: "openai",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        seed: Math.floor(Math.random() * 1000000),
        private: true
      },
      { timeout: 20000 }
    );
    let reply = response.data?.choices?.[0]?.message?.content;
    if (reply && typeof reply === "string" && reply.trim().length > 3) {
      reply = reply.replace(/\[.*?\]/g, "").trim();
      if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
      return reply;
    }
  } catch (err) {
    console.error("Pollinations JSON error:", err.message);
  }

  // ২. ব্যাকআপ API – Yanex
  try {
    const backup = await axios.get(`https://api.yanex.pro/gpt?ask=${encodeURIComponent(question)}`, { timeout: 15000 });
    let reply = backup.data?.response || backup.data?.reply;
    if (reply && typeof reply === "string" && reply.trim().length > 3) {
      reply = reply.replace(/\[.*?\]/g, "").trim();
      if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
      return reply;
    }
  } catch (err) {
    console.error("Yanex API error:", err.message);
  }

  // কোনো API কাজ না করলে শুধু এই মেসেজ – কোনো লোকাল উত্তর নেই
  return "আরে আমার নেট একটু খারাপ... আবার চেষ্টা করো প্লিজ 🥺🌙";
    }
