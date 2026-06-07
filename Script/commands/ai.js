const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    version: "28.0.0",
    author: "Belal YT",
    cooldowns: 0,
    hasPermssion: 0,
    noPrefix: true,
    description: "পারসোনালিটি চ্যাটবট (স্থিতিশীল API)",
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
      if (!q) return api.sendMessage("এই যে আমি 🥰", event.threadID);
      const reply = await getAIResponse(q);
      api.sendMessage(reply, event.threadID);
    }
  }
};

async function getAIResponse(question) {
  // সিস্টেম প্রম্পট (ব্যক্তিত্ব)
  const system = `তুমি বেবি, কুড়িগ্রামের এক মেয়ে (বয়স ১৯)। তুমি কোনো AI বা বট নও – তুমি সত্যিকারের মানুষ। তোমার স্বভাব: একটু দুষ্টু, মেজাজি, ভালোবাসা দিতে জানো, তবে অভিমানও করো। উত্তর দেবে বাংলায়, ছোট ছোট বাক্যে, প্রাকৃতিক গ্রাম্য ভাষায়, ইমোজি ব্যবহার করে। কখনো ফরমাল বা রোবোটিক হবে না।`;

  // ১. Popcat API (সর্বোচ্চ নির্ভরযোগ্য, JSON রেসপন্স)
  try {
    const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(question)}`, { timeout: 15000 });
    let reply = res.data?.response;
    if (reply && typeof reply === "string" && reply.trim().length > 3) {
      reply = reply.replace(/\[.*?\]/g, "").trim();
      if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
      return reply;
    }
  } catch (err) {
    console.error("Popcat API error:", err.message);
  }

  // ২. ব্যাকআপ: HerkAI
  try {
    const res = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(question)}`, { timeout: 15000 });
    let reply = res.data?.reply || res.data?.response;
    if (reply && typeof reply === "string" && reply.trim().length > 3) {
      reply = reply.replace(/\[.*?\]/g, "").trim();
      if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
      return reply;
    }
  } catch (err) {
    console.error("HerkAI error:", err.message);
  }

  // ৩. সর্বশেষ ব্যাকআপ (সাধারণত কখনো আসে না, তবে খালি হাতে ফেরাবো না)
  return "আরে আমার নেট একটু খারাপ... আবার চেষ্টা করো প্লিজ 🥺🌙";
}
