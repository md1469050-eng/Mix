"use strict";
const axios = require("axios");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "video/mp4,video/*;q=0.9,*/*;q=0.8"
};

// ৫০+ search query — বেশি ভিডিও = কম repeat
const SEARCH_QUERIES = [
  "Kingdom of Heaven edit aura",
  "Kingdom of Heaven cinematic edit",
  "Kingdom of Heaven best scene edit",
  "Kingdom of Heaven Balian edit",
  "Kingdom of Heaven epic edit 4k",
  "Kingdom of Heaven Balian sword fight",
  "Kingdom of Heaven Jerusalem scene",
  "Kingdom of Heaven Orlando Bloom edit",
  "Kingdom of Heaven battle scene",
  "Kingdom of Heaven motivational edit",
  "Kingdom of Heaven sad edit",
  "Kingdom of Heaven legendary edit",
  "Kingdom of Heaven warrior edit",
  "Kingdom of Heaven dark edit",
  "Kingdom of Heaven honor edit",
  "Kingdom of Heaven slomo edit",
  "Kingdom of Heaven music edit",
  "Kingdom of Heaven emotional edit",
  "Kingdom of Heaven epic moment",
  "Kingdom of Heaven siege scene edit",
  "Kingdom of Heaven crusades edit",
  "Kingdom of Heaven best moments",
  "Kingdom of Heaven aura moment",
  "Kingdom of Heaven phonk edit",
  "Kingdom of Heaven sigma edit",
  "Kingdom of Heaven cinematic 4k",
  "Kingdom of Heaven short clip",
  "Kingdom of Heaven historical edit",
  "Kingdom of Heaven dramatic scene",
  "Kingdom of Heaven fire scene edit",
  "Kingdom of Heaven sword scene",
  "Kingdom of Heaven epic speech",
  "Kingdom of Heaven Godfrey edit",
  "Kingdom of Heaven knight edit",
  "Kingdom of Heaven war scene",
  "Kingdom of Heaven crown scene",
  "Kingdom of Heaven legend edit",
  "Kingdom of Heaven Saladin scene",
  "Kingdom of Heaven slow motion",
  "Kingdom of Heaven desert scene",
  "Kingdom of Heaven powerful edit",
  "Kingdom of Heaven color grade edit",
  "Kingdom of Heaven fyp edit",
  "Kingdom of Heaven tiktok edit",
  "Kingdom of Heaven viral edit",
  "Kingdom of Heaven best edit 2024",
  "Kingdom of Heaven best edit 2023",
  "Kingdom of Heaven medieval edit",
  "Kingdom of Heaven darkness edit",
  "Kingdom of Heaven victory scene",
  "Kingdom of Heaven lofi edit",
  "Kingdom of Heaven bass boosted edit",
  "Kingdom of Heaven tribute edit",
  "Kingdom of Heaven goosebumps edit",
];

// thread অনুযায়ী used URL track — একই ভিডিও বারবার না আসে
const usedVideos = new Map();

function getUnusedVideo(threadID, videos) {
  if (!usedVideos.has(threadID)) usedVideos.set(threadID, new Set());
  const used = usedVideos.get(threadID);
  if (used.size >= videos.length) used.clear();
  const unused = videos.filter(v => !used.has(v.url));
  const pick = unused[Math.floor(Math.random() * unused.length)];
  used.add(pick.url);
  return pick;
}

// video cache — বারবার API call না করে
let videoCache = [];
let lastFetch = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 মিনিট

async function fetchAllVideos() {
  const now = Date.now();
  if (videoCache.length > 0 && now - lastFetch < CACHE_TTL) return videoCache;

  const seen = new Set();
  const allVideos = [];

  // ৫টা করে batch এ query পাঠাও — rate limit এড়াতে
  const batchSize = 5;
  for (let i = 0; i < SEARCH_QUERIES.length; i += batchSize) {
    const batch = SEARCH_QUERIES.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(q =>
        axios.get(
          `https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(q)}`,
          { headers: HEADERS, timeout: 12000 }
        ).then(res => {
          for (const v of (res.data?.data || [])) {
            if (v.video && !seen.has(v.video)) {
              seen.add(v.video);
              allVideos.push({ url: v.video, title: v.title || "Kingdom of Heaven" });
            }
          }
        }).catch(() => {})
      )
    );
  }

  if (allVideos.length > 0) {
    videoCache = allVideos;
    lastFetch = now;
  }
  return allVideos.length > 0 ? allVideos : null;
}

// wow.js লজিক — সবচেয়ে দ্রুত stream
async function fastStream(url) {
  const streams = [url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: HEADERS, timeout: 18000, maxRedirects: 5 })
      .then(r => { r.data.path = "kingdom.mp4"; return r.data; })
  );
  return Promise.any(streams);
}

// বট চালু হলেই background এ cache গরম করো
setTimeout(() => fetchAllVideos().catch(() => {}), 3000);

module.exports.config = {
  name: "kingdom",
  version: "6.0",
  hasPermssion: 0,
  credits: "BELAL BOTX666",
  description: "Kingdom of Heaven — সেরা এডিট ভিডিও",
  commandCategory: "fun",
  usages: "kingdom",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const videos = await fetchAllVideos();
    if (!videos || videos.length === 0) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ Kingdom of Heaven এর কোনো ভিডিও পাওয়া যায়নি।", threadID, messageID);
    }

    const selected = getUnusedVideo(threadID, videos);
    const stream = await fastStream(selected.url);

    await api.sendMessage(
      {
        body: `⚔️ Kingdom of Heaven\n📌 ${selected.title}\n\n🎬 ┄┉ Aura Edit ┉┄ 🎬`,
        attachment: stream
      },
      threadID, () => {}, messageID
    );
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (error) {
    console.error("[kingdom]", error.message);
    api.setMessageReaction("❌", messageID, () => {}, true);
    api.sendMessage("❌ ভিডিও আনতে ব্যর্থ, আবার চেষ্টা করুন।", threadID, messageID);
  }
};
  
