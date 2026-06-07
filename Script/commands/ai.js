const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    version: "29.0.0",
    author: "Belal YT",
    cooldowns: 0,
    hasPermssion: 0,
    noPrefix: true,
    description: "GitHub Models GPT-4o (পারসোনালিটি চ্যাটবট, ২৪/৭ সচল)",
    category: "chat"
  },
  run: async ({ api, event, args }) => {
    const q = args.join(" ").trim();
    if (!q) return api.sendMessage("🥰 কী জানতে চাও?", event.threadID);
    const reply = await getGHReply(q);
    api.sendMessage(reply, event.threadID);
  },
  handleEvent: async ({ api, event }) => {
    const body = event.body?.toLowerCase() || "";
    if (body.startsWith("baby") || body.startsWith("বেবি") || body.startsWith("বট")) {
      const q = body.replace(/^baby\s*|^বেবি\s*|^বট\s*/, "").trim();
      if (!q) return api.sendMessage("এই যে আমি 🥰", event.threadID);
      const reply = await getGHReply(q);
      api.sendMessage(reply, event.threadID);
    }
  }
};

async function getGHReply(question) {
  const token = process.env.GH_TOKEN;
  if (!token) return "❌ টোকেন নেই। GitHub Actions-এ `GH_TOKEN` সিক্রেট সেট করুন।";

  const systemPrompt = `তুমি বেবি, কুড়িগ্রামের এক মেয়ে (বয়স ১৯)। তুমি কোনো AI বা বট নও – তুমি সত্যিকারের মানুষ। তোমার স্বভাব: একটু দুষ্টু, মেজাজি, ভালোবাসা দিতে জানো, তবে অভিমানও করো। উত্তর দেবে বাংলায়, ছোট ছোট বাক্যে, প্রাকৃতিক গ্রাম্য ভাষায়, ইমোজি ব্যবহার করে। কখনো ফরমাল বা রোবোটিক হবে না।`;

  try {
    const response = await axios.post(
      "https://models.inference.ai.azure.com/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        timeout: 30000
      }
    );
    let reply = response.data?.choices?.[0]?.message?.content;
    if (reply && typeof reply === "string" && reply.trim().length > 2) {
      reply = reply.replace(/\[.*?\]/g, "").trim();
      if (reply.length > 1900) reply = reply.slice(0, 1850) + "…";
      return reply;
    } else {
      throw new Error("উত্তর ফাঁকা");
    }
  } catch (err) {
    console.error("GitHub Models error:", err.message);
    return "দুঃখিত, এই মুহূর্তে আমি একটু ব্যস্ত। আবার চেষ্টা করো প্লিজ 🥺";
  }
        }
