const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "animate",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Neoaz ゐ",
  description: "Generate animated videos from text prompts using AI.",
  commandCategory: "AI",
  usages: "[prompt]",
  cooldowns: 30,
};

const API_ENDPOINT = "https://metakexbyneokex.fly.dev/animate";
const CACHE_DIR = path.join(__dirname, 'cache');

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ").trim();

  // প্রম্পট চেক
  if (!prompt) {
    return api.sendMessage("Please provide a prompt to generate a video.\nExample: /animate a cat is swimming", threadID, messageID);
  }

  // ক্যাশ ডিরেক্টরি তৈরি
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // রিঅ্যাকশন দেওয়া
  api.setMessageReaction("⏳", messageID, () => {}, true);
  
  let tempFilePath = path.join(CACHE_DIR, `animate_${Date.now()}.mp4`);

  try {
    const fullApiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt)}`;
    
    // API থেকে ভিডিওর লিঙ্ক নেওয়া
    const apiResponse = await axios.get(fullApiUrl, { timeout: 120000 });
    const data = apiResponse.data;

    if (!data.success || !data.video_urls || data.video_urls.length === 0) {
      throw new Error(data.message || "API returned no video.");
    }

    const videoUrl = data.video_urls[0];

    // ভিডিও ডাউনলোড করা
    const response = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
      api.setMessageReaction("✅", messageID, () => {}, true);
      
      // ভিডিও পাঠানো
      await api.sendMessage({
        body: "Video generated 🐦",
        attachment: fs.createReadStream(tempFilePath)
      }, threadID, () => {
          // ভিডিও পাঠানোর পর ফাইল ডিলিট করা
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
      }, messageID);
    });

    writer.on('error', (err) => {
      throw err;
    });

  } catch (error) {
    api.setMessageReaction("❌", messageID, () => {}, true);
    console.error("Animate Command Error:", error);
    api.sendMessage("Failed to generate video. Please try again later.", threadID, messageID);
    
    // এরর হলে ফাইল ক্লিন আপ
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
