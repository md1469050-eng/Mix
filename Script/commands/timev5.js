const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "timev5",
  version: "12.0.0",
  author: "BELAL ⊶ BOTX666 🪬",
  countDown: 5,
  role: 0,
  shortDescription: "Cyberpunk Premium Calendar Card",
  category: "fun",
  guide: { en: "{p}time" }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

  try {
    const now = new Date();
    // ঢাকা টাইম (GMT+6)
    const dhakaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));

    const year = dhakaTime.getFullYear();
    const month = dhakaTime.getMonth();
    const date = dhakaTime.getDate();
    const day = dhakaTime.getDay();
    let hours = dhakaTime.getHours();
    const minutes = dhakaTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const filePath = await generateCyberCard({
      year, month, date, 
      dayName: days[day], 
      monthName: months[month], 
      timeStr
    });

    await api.sendMessage({
      body: `╭━━━━━━⊱✨⊰━━━━━━╮\n   𝐃𝐈𝐆𝐈𝐓𝐀𝐋 𝐓𝐈𝐌𝐄 𝐂𝐀𝐑𝐃\n╰━━━━━━⊱✨⊰━━━━━━╯\n\n📅 𝐃𝐚𝐭𝐞: ${days[day]}, ${date} ${months[month]}\n⏰ 𝐓𝐢𝐦𝐞: ${timeStr}\n📍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧: Kurigram, BD${sig}`,
      attachment: fs.createReadStream(filePath)
    }, threadID, messageID);

    setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 15000);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ কার্ড জেনারেট করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};

async function generateCyberCard(data) {
  const width = 1000;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Cyberpunk Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0a0c');
  bgGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Glass Panel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  roundRect(ctx, 50, 50, width - 100, height - 100, 60, true);

  // 3. Dual Neon Borders
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#00f2fe';
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 20;
  roundRect(ctx, 60, 60, width - 120, height - 120, 55, false, true);
  
  ctx.strokeStyle = '#ea00ff';
  ctx.shadowColor = '#ea00ff';
  roundRect(ctx, 75, 75, width - 150, height - 150, 50, false, true);
  ctx.shadowBlur = 0;

  // 4. Time Display (Mega Header)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 130px Arial';
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 30;
  ctx.fillText(data.timeStr, width / 2, 220);
  ctx.shadowBlur = 0;

  // 5. Day & Location Info
  ctx.font = 'bold 50px Arial';
  ctx.fillStyle = '#ea00ff';
  ctx.fillText(data.dayName.toUpperCase(), width / 2, 300);
  
  ctx.font = '35px Arial';
  ctx.fillStyle = '#00f2fe';
  ctx.fillText(`📍 KURIGRAM, BANGLADESH`, width / 2, 360);

  // 6. Calendar Table Setup
  const startY = 480;
  const cellW = 110;
  const cellH = 100;
  const gridX = (width - 7 * cellW) / 2 + 55;

  // Weekday Headers
  const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks.forEach((w, i) => {
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = (i === 0 || i === 6) ? '#ff4b2b' : '#ffffff';
    ctx.fillText(w, gridX + i * cellW - 55, startY);
  });

  // Calendar Grid
  const firstDay = new Date(data.year, data.month, 1).getDay();
  const daysInMonth = new Date(data.year, data.month + 1, 0).getDate();
  let dayCount = 1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const index = row * 7 + col;
      if (index < firstDay || dayCount > daysInMonth) continue;

      const x = gridX + col * cellW - 55;
      const y = startY + 80 + row * cellH;

      if (dayCount === data.date) {
        // Today Highlight
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(x, y - 10, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      }

      ctx.font = 'bold 40px Arial';
      ctx.fillText(dayCount, x, y);
      dayCount++;
    }
  }

  // 7. Premium Branding Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  roundRect(ctx, 200, height - 160, width - 400, 80, 40, true);
  
  ctx.font = 'bold 35px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('MD BELAL • BS DEALER', width / 2, height - 108);

  const filePath = path.join(__dirname, 'cache', `cyber_time_${Date.now()}.png`);
  fs.writeFileSync(filePath, canvas.toBuffer());
  return filePath;
}

function roundRect(ctx, x, y, w, h, r, fill = false, stroke = false) {
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
