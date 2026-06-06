"use strict";
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function startSchedule() {
    let schedule;
    try { schedule = require("node-schedule"); }
    catch { return global.log?.warn?.("node-schedule নেই — schedule বন্ধ।"); }
    const { commands } = global.client || {};
    if (!commands) return;
    let count = 0;
    for (const [name, cmd] of commands.entries()) {
      if (!cmd.handleSchedule) continue;
      const cron = cmd.config?.schedule || cmd.config?.scheduleTime;
      if (!cron) continue;
      try {
        schedule.scheduleJob(cron, async () => {
          try {
            let getText2 = () => "";
            const lang = global.config?.language || "en";
            if (cmd.languages?.[lang]) {
              getText2 = (...v) => {
                let t = cmd.languages[lang][v[0]] || "";
                for (let i = v.length; i > 0; i--) t = t.replace(new RegExp("%" + i, "g"), v[i]);
                return t;
              };
            }
            await cmd.handleSchedule({ api, models, Users, Threads, Currencies, getText: getText2 });
            global.log?.info?.(`[Schedule] ✅ ${name}`);
          } catch (e) { global.log?.error?.(`[Schedule] ${name}: ${e.message}`); }
        });
        count++;
        global.log?.info?.(`[Schedule] 📅 ${name} → "${cron}"`);
      } catch (e) { global.log?.error?.(`[Schedule] register ${name}: ${e.message}`); }
    }
    if (count) global.log?.success?.(`Schedule → ${count}টি registered`);
  };
};
