module.exports.config = {
 name: "emoji_voice",
 version: "10.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "Emoji দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
 commandCategory: "noprefix",
 usages: "😘🥰😍",
 cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const emojiAudioMap = {
 "🥱": "https://files.catbox.moe/9pou40.mp3",
 "😁": "https://files.catbox.moe/60cwcg.mp3",
 "😌": "https://files.catbox.moe/epqwbx.mp3",
 "🥺": "https://files.catbox.moe/wc17iq.mp3",
 "🤭": "https://files.catbox.moe/cu0mpy.mp3",
 "😅": "https://files.catbox.moe/jl3pzb.mp3",
 "🤥": "https://files.catbox.moe/z9e52r.mp3",
 "😓": "https://files.catbox.moe/tdimtx.mp3",
 "😤": "https://files.catbox.moe/28fc5u.mp3",
 "🍼": "https://files.catbox.moe/p6ht91.mp3",
 "🤔": "https://files.catbox.moe/hy6m6w.mp3",
 "🥰": "https://files.catbox.moe/dv9why.mp3",
 "🤕": "https://files.catbox.moe/ivlvoq.mp3",
 "😘": "https://files.catbox.moe/sbws0w.mp3",
 "😑": "https://files.catbox.moe/p78xfw.mp3",
 "😢": "https://files.catbox.moe/shxwj1.mp3",
 "🙊": "https://files.catbox.moe/3bejxv.mp3",
 "🤨": "https://files.catbox.moe/4aci0r.mp3",
 "😡": "https://files.catbox.moe/shxwj1.mp3",
 "🙈": "https://files.catbox.moe/3qc90y.mp3",
 "😍": "https://files.catbox.moe/qjfk1b.mp3",
 "😭": "https://files.catbox.moe/itm4g0.mp3",
 "😱": "https://files.catbox.moe/mu0kka.mp3",
 "😻": "https://files.catbox.moe/y8ul2j.mp3",
 "😿": "https://files.catbox.moe/tqxemm.mp3",
 "💔": "https://files.catbox.moe/6yanv3.mp3",
 "🤣": "https://files.catbox.moe/2sweut.mp3",
 "🥹": "https://files.catbox.moe/jf85xe.mp3",
 "😩": "https://files.catbox.moe/b4m5aj.mp3",
 "🫣": "https://files.catbox.moe/ttb6hi.mp3",
 "🐸": "https://files.catbox.moe/utl83s.mp3",
 "😵‍💫": "https://files.catbox.moe/mrd8rz.mp3",
 "😚": "https://files.catbox.moe/ra47rg.mp3",
 "❤️‍🩹": "https://files.catbox.moe/cbmeo9.mp3",
 "😌": "https://files.catbox.moe/61yy0n.mp4",
 "😆": "https://files.catbox.moe/09mpz2.mp3",
 "😙": "https://files.catbox.moe/iedibi.mp3",
 "🤭": "https://files.catbox.moe/vwtxj1.mp3",
 "😅": "https://files.catbox.moe/sn8c6e.mp3",
 "💋": "https://files.catbox.moe/aeu0dr.mp3",
 "🫢": "https://files.catbox.moe/plwjw1.mp3",
 "😂": "https://files.catbox.moe/8jw64a.mp3",
 "😕": "https://files.catbox.moe/eb1o8q.mp3",
 "😬": "https://files.catbox.moe/17o3ao.mp3",
 "🥵": "https://files.catbox.moe/l90704.mp3",
 "😏": "https://files.catbox.moe/6yeaxb.mp3",
 "🤦": "https://files.catbox.moe/jxuwix.mp3",
 "🙂": "https://files.catbox.moe/9ve7qo.mp3",
 "😔": "https://files.catbox.moe/ggu5rq.mp3",
 "🫣": "https://files.catbox.moe/jhbvme.mp3",
 "🤫": "https://files.catbox.moe/28fc5u.mp3",
 "🤧": "https://files.catbox.moe/zh3mdg.mp3",
 "🥶": "https://files.catbox.moe/17o3ao.mp3",
 "🤐": "https://files.catbox.moe/17o3ao.mp3",
 "😒": "https://files.catbox.moe/bk9lzs.mp3",
 "🙄": "https://files.catbox.moe/mq1nas.mp3",
 "😶": "https://files.catbox.moe/ttb6hi.mp3",
 "😵": "https://files.catbox.moe/jhbvme.mp3",
 "😐": "https://files.catbox.moe/q4ji6t.mp3",
 "🐍": "https://files.catbox.moe/utl83s.mp3",
 "🤰": "https://files.catbox.moe/twr5wf.mp3",
 "💪": "https://files.catbox.moe/j03dk9.mp3",
 "💃": "https://files.catbox.moe/jhyng8.mp3",
 "❤️‍🔥": "https://files.catbox.moe/0qgv91.mp3",
 "🥶": "https://files.catbox.moe/rzti55.mp3",
 "👀": "https://files.catbox.moe/wkdo44.mp3",
 "🙏": "https://files.catbox.moe/542hm1.mp3",
 "🐓": "https://files.catbox.moe/oaxtjv.mp3",
 "🩴": "https://files.catbox.moe/bhfqtr.mp3",
 "👑": "https://files.catbox.moe/jr4vnq.mp3",
 "👙": "https://files.catbox.moe/jp0bqo.mp3",
 "🍷": "https://files.catbox.moe/oivwsu.mp3",
 "🪓": "https://files.catbox.moe/rn7gqe.mp3",
 "🚬": "https://files.catbox.moe/vixb01.mp3",
 "🍉": "https://files.catbox.moe/x1ze8v.mp3",
 "🖕": "https://files.catbox.moe/pxgnt9.mp3",
 "🎲": "https://files.catbox.moe/6ek32y.mp3",
 "🤱": "https://files.catbox.moe/qc8gsi.mp3",
 "👔": "https://files.catbox.moe/q8v9ys.mp3",
 "💵": "https://files.catbox.moe/d42g6z.mp3",
 "👰": "https://files.catbox.moe/waawu4.mp3",
 "💩": "https://files.catbox.moe/xlr96x.mp3",
 "💓": "https://files.catbox.moe/4kikih.mp3",
 "🤝": "https://files.catbox.moe/tqsb5w.mp3",
 "🍆": "https://files.catbox.moe/ayimg9.mp3",
 "🧎‍♀️": "https://https://files.catbox.moe/t8z0oi.mp3",
 "🤳": "https://files.catbox.moe/yqepwf.mp3",
 "☎️": "https://files.catbox.moe/8lo8oe.mp3",
 "🧹": "https://files.catbox.moe/2xadpd.mp3",
 "💨": "https://files.catbox.moe/mcxcgz.mp3",
 "🌹": "https://files.catbox.moe/pj2omq.mp3",
 "🤕": "https://files.catbox.moe/fjq9b5.mp3"

};

module.exports.handleEvent = async ({ api, event }) => {
 const { threadID, messageID, body } = event;
 if (!body || body.length > 2) return;

 const emoji = body.trim();
 const audioUrl = emojiAudioMap[emoji];
 if (!audioUrl) return;

 const cacheDir = path.join(__dirname, 'cache');
 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

 const filePath = path.join(cacheDir, `${encodeURIComponent(emoji)}.mp3`);

 try {
 const response = await axios({
 method: 'GET',
 url: audioUrl,
 responseType: 'stream'
 });

 const writer = fs.createWriteStream(filePath);
 response.data.pipe(writer);

 writer.on('finish', () => {
 api.sendMessage({
 attachment: fs.createReadStream(filePath)
 }, threadID, () => {
 fs.unlink(filePath, (err) => {
 if (err) console.error("Error deleting file:", err);
 });
 }, messageID);
 });

 writer.on('error', (err) => {
 console.error("Error writing file:", err);
 api.sendMessage("ইমুজি দিয়ে লাভ নাই\nযাও মুড়ি খাও জান😘", threadID, messageID);
 });

 } catch (error) {
 console.error("Error downloading audio:", error);
 api.sendMessage("ইমুজি দিয়ে লাভ নাই\nযাও মুড়ি খাও জান😘", threadID, messageID);
 }
};

module.exports.run = () => {};
