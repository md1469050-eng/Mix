const { createCanvas } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "timev2",
  version: "15.0.0",
  hasPermssion: 0,
  credits: "MOHAMMAD AKASH",
  description: "Elite Aura Calendar Card with Premium UI",
  commandCategory: "utility",
  usages: "time",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const now = new Date();
    const bdtTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));

    const data = {
      year: bdtTime.getFullYear(),
      month: bdtTime.getMonth(),
      date: bdtTime.getDate(),
      day: bdtTime.getDay(),
      hours: bdtTime.getHours(),
      minutes: bdtTime.getMinutes(),
      ampm: bdtTime.getHours() >= 12 ? 'PM' : 'AM'
    };

    data.hours = data.hours % 12 || 12;
    data.timeStr = `${data.hours.toString().padStart(2, '0')}:${data.minutes.toString().padStart(2, '0')} ${data.ampm}`;
    
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    
    data.dayName = days[data.day];
    data.monthName = months[data.month];

    const filePath = await generateEliteCard(data);

    await api.sendMessage({
      body: `✨ 𝗔𝗨𝗥𝗢𝗥𝗔 𝗧𝗜𝗠𝗘 𝗖𝗔𝗥𝗗 ✨\n━━━━━━━━━━━━━━━━━━━━\n📅 ${data.dayName}, ${data.date} ${data.monthName}\n⏰ 𝗕𝗗𝗧: ${data.timeStr}\n🚀 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗠𝗶𝗿𝗮𝗶 𝗔𝘂𝗿𝗼𝗿𝗮`,
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ প্রিমিয়াম কার্ড জেনারেট করা সম্ভব হয়নি।", threadID, messageID);
  }
};

async function generateEliteCard(data) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Background: Aurora Deep Gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#020617');
  gradient.addColorStop(0.5, '#0f172a');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Aurora Orbs (Soft Glows)
  ctx.globalCompositeOperation = 'screen';
  drawGlowOrb(ctx, 200, 200, 400, '#00f2ff33');
  drawGlowOrb(ctx, 800, 800, 500, '#7000ff22');
  ctx.globalCompositeOperation = 'source-over';

  // 3. Main Glass Card Container
  ctx.shadowColor = 'rgba(0, 242, 255, 0.4)';
  ctx.shadowBlur = 60;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(0, 242, 255, 0.6)';
  ctx.lineWidth = 4;
  roundRect(ctx, 80, 80, 920, 920, 80, true, true);
  ctx.shadowBlur = 0;

  // 4. Time Rendering (Elite Typography)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 180px sans-serif';
  ctx.shadowColor = '#00f2ff';
  ctx.shadowBlur = 30;
  ctx.fillText(data.timeStr, width / 2, 300);
  ctx.shadowBlur = 0;

  // 5. Day Display with Accent Lines
  ctx.font = 'bold 70px sans-serif';
  ctx.fillStyle = '#00f2ff';
  ctx.fillText(data.dayName, width / 2, 420);
  
  ctx.strokeStyle = '#00f2ff';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(300, 415); ctx.lineTo(100, 415); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(780, 415); ctx.lineTo(980, 415); ctx.stroke();

  // 6. Calendar Section
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const startX = 200;
  const headerY = 560;
  const cellWidth = 115;

  weekDays.forEach((d, i) => {
    ctx.font = '900 32px sans-serif';
    ctx.fillStyle = (i === 0 || i === 6) ? '#ff5555' : '#8892b0';
    ctx.fillText(d, startX + i * cellWidth, headerY);
  });

  // Calendar Grid Rendering
  const firstDay = new Date(data.year, data.month, 1).getDay();
  const daysInMonth = new Date(data.year, data.month + 1, 0).getDate();
  let dayCount = 1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < firstDay || dayCount > daysInMonth) continue;

      const x = startX + col * cellWidth;
      const y = 660 + row * 95;

      if (dayCount === data.date) {
        // Neon Highlight for Current Date
        ctx.fillStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 25;
        roundRect(ctx, x - 45, y - 55, 90, 90, 20, true, false);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#e2e8f0';
      }

      ctx.font = 'bold 45px sans-serif';
      ctx.fillText(dayCount, x, y + 10);
      dayCount++;
    }
  }

  // 7. Elite Footer
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#00f2ff';
  ctx.fillText('⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗜𝗥𝗔𝗜 𝗔𝗨𝗥𝗢𝗥𝗔 𝗦𝗬𝗦𝗧𝗘𝗠', width / 2, 950);

  // Buffer and Save
  const cachePath = path.join(__dirname, 'cache', `elite_time_${Date.now()}.png`);
  if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));
  fs.writeFileSync(cachePath, canvas.toBuffer());
  return cachePath;
}

function drawGlowOrb(ctx, x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
