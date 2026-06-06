const axios = require("axios");

// সার্চ টার্ম
const SEARCH_TERMS = [
  "mood dance remix edit",
  "mood remix dance", 
  "dance mood remix",
  "vibe remix dance",
  "trend mood dance",
  "mood dance video remix",
  "aesthetic mood dance remix",
  "slow mood dance remix",
  "mood edit dance remix"
];

let recentVideoIds = [];
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
];

module.exports = {
  config: {
    name: "mood",
    aliases: ["মুড", "mooddance", "feelings"],
    description: "বিশ্বব্যাপী মুড ড্যান্স রিমিক্স এডিট ভিডিও দেখায়",
    usage: "mood",
    cooldown: 10,
    role: 0
  },
  run: async ({ api, event }) => {
    const wait = await api.sendMessage("⏳ মুড ভিডিও খুঁজে বের করছি...", event.threadID);

    try {
      // প্রথম API: TikWM (main)
      let videoUrl = null;
      let videoTitle = null;
      let videoLikes = 0;
      let videoComments = 0;
      let success = false;

      const randomTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
      const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

      try {
        const response = await axios.get(
          `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(randomTerm)}&count=30`,
          { headers: { 'User-Agent': randomUA }, timeout: 12000 }
        );
        
        const videos = response.data?.data?.videos;
        if (videos && videos.length > 0) {
          let available = videos.filter(v => !recentVideoIds.includes(v.video_id));
          if (available.length === 0) {
            recentVideoIds = [];
            available = videos;
          }
          const picked = available[Math.floor(Math.random() * available.length)];
          if (picked && picked.play) {
            videoUrl = picked.play;
            videoTitle = picked.title || "Mood Video";
            videoLikes = picked.digg_count || 0;
            videoComments = picked.comment_count || 0;
            recentVideoIds.push(picked.video_id);
            if (recentVideoIds.length > 25) recentVideoIds.shift();
            success = true;
          }
        }
      } catch (e) {
        console.error("TikWM API error:", e.message);
      }

      // ব্যাকআপ API: যদি TikWM কাজ না করে
      if (!success) {
        try {
          const fallbackRes = await axios.get(
            `https://api.popcat.xyz/chatbot?msg=send me a mood dance video link`,
            { timeout: 8000 }
          );
          // Popcat doesnt give video, so use a different backup
          throw new Error("Popcat not suitable");
        } catch (fbErr) {
          // দ্বিতীয় ব্যাকআপ: Pomf2 এর মাধ্যমে স্থির কিছু ভিডিও?
          // আসলে আমরা শেষ ব্যাকআপ হিসেবে static ভিডিও দেব না, বরং এরর মেসেজ দেব
        }
      }

      if (success && videoUrl) {
        const videoStream = await axios.get(videoUrl, { responseType: 'stream', timeout: 25000 }).then(r => r.data);
        await api.sendMessage({
          body: `🎭 আপনার জন্য "${randomTerm}" ভিডিও:\n📹 ${videoTitle}\n❤️ লাইক: ${videoLikes} | 💬 মন্তব্য: ${videoComments}`,
          attachment: videoStream
        }, event.threadID);
      } else {
        throw new Error("কোনো API কাজ করেনি");
      }

      if (wait && wait.messageID) await api.unsendMessage(wait.messageID);
    } catch (err) {
      // নিরাপদ error মেসেজ তৈরি
      let errorText = "ভিডিও আনতে ব্যর্থ";
      if (err && typeof err === 'object') {
        errorText = err.message || err.error || JSON.stringify(err).slice(0, 100);
      } else if (typeof err === 'string') {
        errorText = err;
      }
      if (errorText === "[object Object]") errorText = "API সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি";
      
      api.sendMessage(`❌ ${errorText}। আবার চেষ্টা করুন।`, event.threadID);
      if (wait && wait.messageID) await api.unsendMessage(wait.messageID);
    }
  }
};
