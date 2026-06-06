const axios = require("axios");

// বিভিন্ন ধরনের মুড ড্যান্স রিমিক্স কীওয়ার্ড
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

// ইতিমধ্যে দেখা ভিডিও আইডি ট্র্যাক করা (পুনরাবৃত্তি রোধ)
let recentVideoIds = [];

// ইউজার এজেন্ট রোটেট (ব্লক এড়াতে)
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0'
];

module.exports = {
  config: {
    name: "mood",
    aliases: ["মুড", "mooddance", "feelings"],
    description: "বিশ্বব্যাপী মুড ড্যান্স রিমিক্স এডিট ভিডিও দেখায় (পুনরাবৃত্তি মুক্ত)",
    usage: "mood",
    cooldown: 10,
    role: 0
  },
  run: async ({ api, event }) => {
    const wait = await api.sendMessage("⏳ বিশ্বব্যাপী মুড ড্যান্স ভিডিও খুঁজে বের করছি...", event.threadID);

    try {
      const randomTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
      const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      
      const response = await axios.get(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(randomTerm)}&count=40`, {
        headers: { 'User-Agent': randomUA },
        timeout: 15000
      });

      let videos = response.data?.data?.videos;
      if (!videos || videos.length === 0) throw new Error("কোনো ভিডিও পাওয়া যায়নি");

      let availableVideos = videos.filter(v => !recentVideoIds.includes(v.video_id));
      if (availableVideos.length === 0) {
        recentVideoIds = [];
        availableVideos = videos;
      }

      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      const videoUrl = randomVideo.play;
      if (!videoUrl) throw new Error("ভিডিও URL পাওয়া যায়নি");

      recentVideoIds.push(randomVideo.video_id);
      if (recentVideoIds.length > 25) recentVideoIds.shift();

      const videoStream = await axios.get(videoUrl, { responseType: 'stream', timeout: 25000 }).then(r => r.data);
      
      await api.sendMessage({
        body: `🎭 আপনার জন্য ${randomTerm} ভিডিও:\n📹 ${randomVideo.title || "Mood Dance Remix"}\n❤️ লাইক: ${randomVideo.digg_count || 0} | 💬 মন্তব্য: ${randomVideo.comment_count || 0}`,
        attachment: videoStream
      }, event.threadID);

      if (wait && wait.messageID) await api.unsendMessage(wait.messageID);
      
    } catch (error) {
      // ✅ এখানেই সমস্যার সমাধান: error.message undefined থাকলেও ক্র্যাশ হবে না
      const errMsg = error?.message || error?.toString() || "অজানা ত্রুটি";
      console.error("Mood video error:", errMsg);
      api.sendMessage(`❌ ভিডিও আনতে ব্যর্থ: ${errMsg.slice(0, 100)}। আবার চেষ্টা করুন।`, event.threadID);
      if (wait && wait.messageID) await api.unsendMessage(wait.messageID);
    }
  }
};
