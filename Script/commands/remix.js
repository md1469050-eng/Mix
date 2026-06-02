"use strict";
const axios = require("axios");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "video/mp4,video/*;q=0.9,*/*;q=0.8"
};

// ৫০+ remix query
const REMIX_QUERIES = [
  "remix song tiktok viral 2024",
  "best remix tiktok 2024",
  "dj remix bangla song",
  "phonk remix tiktok",
  "remix hit song tiktok",
  "trending remix tiktok 2024",
  "bass boosted remix tiktok",
  "hindi remix tiktok viral",
  "slow reverb remix tiktok",
  "lofi remix tiktok",
  "dj remix viral tiktok",
  "new remix song tiktok",
  "tiktok remix trending music",
  "best dj remix 2024",
  "remix edm tiktok viral",
  "bollywood remix tiktok",
  "slap house remix tiktok",
  "remix music viral short",
  "tiktok mashup remix 2024",
  "dj remix beat drop tiktok",
  "viral remix bgm tiktok",
  "bangla dj remix tiktok",
  "arabic remix tiktok viral",
  "tiktok remix fyp 2024",
  "remix music edit tiktok",
  "best phonk music tiktok",
  "aggressive phonk remix",
  "romanian phonk remix tiktok",
  "tiktok slowed remix viral",
  "remix pop song tiktok 2024",
  "club remix tiktok viral",
  "night drive remix tiktok",
  "tiktok epic remix music",
  "sad remix lofi tiktok",
  "korean remix tiktok viral",
  "remix trap music tiktok",
  "turkish remix tiktok viral",
  "remix rnb tiktok viral",
  "tiktok drill remix 2024",
  "remix hip hop tiktok",
  "reggaeton remix tiktok viral",
  "amapiano remix tiktok",
  "afrobeats remix tiktok viral",
  "tiktok techno remix 2024",
  "remix house music tiktok",
  "disco remix tiktok viral",
  "retro remix tiktok edit",
  "tiktok remix chill vibes",
  "remix guitar tiktok viral",
  "electronic remix tiktok 2024",
  "remix music video tiktok fyp",
  "viral music remix short video",
  "best music remix tiktok edit",
  "dj remix night tiktok viral",
];

// thread অনুযায়ী used URL track
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

// video cache
let videoCache = [];
let lastFetch = 0;
const CACHE_TTL = 10 * 60 * 1000;

async function fetchAllVideos(userQuery) {
  // user নিজে query দিলে fresh search
  if (userQuery) {
    const res = await axios.get(
      `https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(userQuery + " remix song")}`,
      { headers: HEADERS, timeout: 12000 }
    );
    const data = (res.data?.data || []).filter(v => v.video);
    if (data.length > 0) return data.map(v => ({ url: v.video, title: v.title || userQuery }));
  }

  // cache থেকে দাও
  const now = Date.now();
  if (videoCache.length > 0 && now - lastFetch < CACHE_TTL) return videoCache;

  const seen = new Set();
  const allVideos = [];
  const batchSize = 5;

  for (let i = 0; i < REMIX_QUERIES.length; i += batchSize) {
    const batch = REMIX_QUERIES.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(q =>
        axios.get(
          `https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(q)}`,
          { headers: HEADERS, timeout: 12000 }
        ).then(res => {
          for (const v of (res.data?.data || [])) {
            if (v.video && !seen.has(v.video)) {
              seen.add(v.video);
              allVideos.push({ url: v.video, title: v.title || "Remix Song" });
            }
          }
        }).catch(() => {})
      )
    );
  }

  if (allVideos.length > 0) { videoCache = allVideos; lastFetch = now; }
  return allVideos.length > 0 ? allVideos : null;
}

// wow.js লজিক
async function fastStream(url) {
  const streams = [url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: HEADERS, timeout: 18000, maxRedirects: 5 })
      .then(r => { r.data.path = "remix.mp4"; return r.data; })
  );
  return Promise.any(streams);
}

// startup cache warm-up
setTimeout(() => fetchAllVideos(null).catch(() => {}), 3000);

module.exports.config = {
  name: "remix",
  version: "6.0",
  hasPermssion: 0,
  credits: "BELAL BOTX666",
  description: "TikTok থেকে রিমিক্স সং ভিডিও — একই ভিডিও বারবার আসবে না",
  commandCategory: "fun",
  usages: "remix [query]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ") || null;

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const videos = await fetchAllVideos(query);
    if (!videos || videos.length === 0) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ কোনো রিমিক্স ভিডিও পাওয়া যায়নি।", threadID, messageID);
    }

    const selected = getUnusedVideo(threadID, videos);
    const stream = await fastStream(selected.url);

    await api.sendMessage(
      {
        body: `🎵 Remix Song\n📌 ${selected.title}\n\n✨ ┄┉ Viral Remix ┉┄ ✨`,
        attachment: stream
      },
      threadID, () => {}, messageID
    );
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (error) {
    console.error("[remix]", error.message);
    api.setMessageReaction("❌", messageID, () => {}, true);
    api.sendMessage("❌ ভিডিও আনতে ব্যর্থ, আবার চেষ্টা করুন।", threadID, messageID);
  }
};
