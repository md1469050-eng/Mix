const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "4k",
    version: "2.5.0",
    credits: "Master Belal",
    description: "ছবির ব্যাকগ্রাউন্ড রিমুভ, কালার গ্রেডিং এবং ৪কে এনহ্যান্সমেন্ট",
    usages: "[ছবিতে রিপ্লাই দিন]",
    commandCategory: "AI Tools",
    cooldowns: 2
};

const API_ENDPOINT = "https://free-goat-api.onrender.com/4k";

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    let imageUrl;
    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        imageUrl = messageReply.attachments[0].url;
    } else {
        return api.sendMessage("⚠️ দয়া করে একটি ছবিতে রিপ্লাই দিয়ে /4k লিখুন।", threadID, messageID);
    }

    api.setMessageReaction("📸", messageID, () => {}, true);
    
    const tempPath = path.join(__dirname, `/cache/4k_ultra_${Date.now()}.png`);

    try {
        // এনহ্যান্সমেন্ট এবং প্রসেসিং এর জন্য এপিআই কল
        const res = await axios.get(`${API_ENDPOINT}?url=${encodeURIComponent(imageUrl)}`);
        const processedUrl = res.data.image;

        if (!processedUrl) throw new Error("প্রসেসিং ব্যর্থ হয়েছে!");

        const imageRes = await axios.get(processedUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(tempPath, Buffer.from(imageRes.data, 'utf-8'));

        api.setMessageReaction("✨", messageID, () => {}, true);

        // একদম আলাদা এবং ক্লিন ডিজাইন
        const msg = {
            body: `🌟 𝗨𝗟𝗧𝗥𝗔 𝟰𝗞 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗗 🌟\n━━━━━━━━━━━━━━━━━━\n🎨 𝗘𝗳𝗳𝗲𝗰𝘁: Color Grading + HD\n🛠 𝗣𝗿𝗼𝗰𝗲𝘀𝘀: AI Deep Learning\n🌈 𝗕𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱: Optimized\n━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(tempPath)
        };

        return api.sendMessage(msg, threadID, () => {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }, messageID);

    } catch (err) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return api.sendMessage("🚫 সার্ভার ত্রুটি! ছবি প্রসেস করা সম্ভব হচ্ছে না API Stor Brlal YT।", threadID, messageID);
    }
};
