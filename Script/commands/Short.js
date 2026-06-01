const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "short",
  version: "2.1",
  hasPermssion: 0,
  credits: "BELAL BOTX666",
  description: "TikTok থেকে রিমিক্স সং ভিডিও সার্চ করুন",
  commandCategory: "fun",
  usages: "[query]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

async function getStreamFromURL(url, filePath) {
  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function fetchTikTokVideos(query) {
  try {
    const response = await axios.get(`https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(' ');

  if (!query) {
    return api.sendMessage("❌ দয়া করে একটি সার্চ কুয়েরি দিন।\nউদাহরণ: /short dj sonu", threadID, messageID);
  }

  api.setMessageReaction("✨", messageID, (err) => {}, true);

  // remix song যুক্ত করা হয়েছে
  const modifiedQuery = `${query} remix song`;
  const cacheDir = path.join(process.cwd(), "cache");
  const cachePath = path.join(cacheDir, `short_${senderID}_${Date.now()}.mp4`);

  try {
    await fs.ensureDir(cacheDir);

    const videos = await fetchTikTokVideos(modifiedQuery);

    if (!videos || videos.length === 0) {
      return api.sendMessage(`❌ "${query}" এর জন্য কোনো রিমিক্স সং ভিডিও পাওয়া যায়নি।`, threadID, messageID);
    }

    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoUrl = selectedVideo.video;
    const title = selectedVideo.title || "No title available";

    if (!videoUrl) {
      return api.sendMessage('❌ এপিআই রেসপন্সে ভিডিও পাওয়া যায়নি।', threadID, messageID);
    }

    await getStreamFromURL(videoUrl, cachePath);

    await api.sendMessage({
      body: `🎵 ভিডিও টাইটেল: ${title}\n\nআপনার রিমিক্স সং ভিডিওটি নিচে দেওয়া হলো!`,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (error) {
    console.error(error);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage('❌ ভিডিওটি প্রসেস করার সময় একটি এরর হয়েছে। দয়া করে আবার চেষ্টা করুন।', threadID, messageID);
  }
};
