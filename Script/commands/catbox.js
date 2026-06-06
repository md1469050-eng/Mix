const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "catbox",
    aliases: ["upload", "link"],
    version: "2.5.0",
    author: "BOTX666 🪬",
    countDown: 5,
    role: 0,
    category: "Media",
    shortDescription: { en: "Upload any media to Catbox and get a URL." },
    guide: { en: "Reply to an image/video/audio with {pn}" }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageReply, type, messageID } = event;

    // সময় ও সিগনেচার
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A");
    const header = "📤 ━━━『 𝐂𝐀𝐓𝐁𝐎𝐗 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 』━━━ 📤";
    const sig = `\n━━━━━━━━━━━━━━━━━━━━\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄\n⏰ সময়: ${bdTime}`;

    if (type !== "message_reply" || !messageReply.attachments.length) {
      return api.sendMessage(`${header}\n\n⚠️ অনুগ্রহ করে কোনো ছবি, ভিডিও বা অডিও ফাইলে রিপ্লাই দিন।${sig}`, threadID, messageID);
    }

    const file = messageReply.attachments[0];
    const cacheDir = path.join(process.cwd(), "cache");
    await fs.ensureDir(cacheDir);
    const filePath = path.join(cacheDir, `catbox_${Date.now()}_${file.filename || 'media'}`);

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const loadingMsg = await api.sendMessage("☁️ ফাইলটি ক্লাউডে আপলোড করা হচ্ছে, অপেক্ষা করুন...", threadID);

    try {
      // ফাইল ডাউনলোড
      const response = await axios({
        url: file.url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          const form = new FormData();
          form.append("file", fs.createReadStream(filePath));

          // Catbox API তে আপলোড
          const uploadRes = await axios.post(
            "https://catbox-api-d07o.onrender.com/upload",
            form,
            {
              headers: { ...form.getHeaders() },
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            }
          );

          await fs.remove(filePath); // ক্যাশ পরিষ্কার

          if (uploadRes.data && uploadRes.data.url) {
            await api.unsendMessage(loadingMsg.messageID).catch(() => {});
            api.setMessageReaction("✅", messageID, () => {}, true);
            
            return api.sendMessage(
              `${header}\n\n✅ 𝐔𝐩𝐥𝐨𝐚𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬!\n🔗 𝐋𝐢𝐧𝐤: ${uploadRes.data.url}${sig}`,
              threadID,
              messageID
            );
          } else {
            throw new Error("Upload failed");
          }

        } catch (err) {
          if (fs.existsSync(filePath)) await fs.remove(filePath);
          api.setMessageReaction("❌", messageID, () => {}, true);
          return api.sendMessage(`❌ আপলোড করতে সমস্যা হয়েছে। সার্ভার ডাউন থাকতে পারে।${sig}`, threadID, messageID);
        }
      });

    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ ফাইলটি ডাউনলোড করতে সমস্যা হয়েছে।${sig}`, threadID, messageID);
    }
  }
};
       
