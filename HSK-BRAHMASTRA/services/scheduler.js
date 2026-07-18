const cron = require("node-cron");
const db = require("../database/db");
const telegramService = require("./telegramService");

// Every day at 3:20 PM IST
cron.schedule(
    "20 15 * * 1-5",
    async () => {
        try {

            const stats = await db.getDashboardStats();

            const message = `
📊 HSK BRAHMASTRA
📅 DAILY REPORT

━━━━━━━━━━━━━━━━━━

✅ Total Trades : ${stats.closedTrades}
🎯 Target Hit  : ${stats.targetHits}
🛑 Stop Loss   : ${stats.stopLosses}
💰 Total Points: ${stats.pnl}
📈 Win Rate    : ${stats.winRate}%

━━━━━━━━━━━━━━━━━━

⚠ DISCLAIMER

• Educational Purpose Only
• We Are Not SEBI Registered
• Trade At Your Own Risk

━━━━━━━━━━━━━━━━━━

🚀 Trade With Discipline
#HSKBRAHMASTRA
`;

            await telegramService.sendMessage(message);

            console.log("✅ Daily Report Sent");

        } catch (err) {

            console.error("❌ Daily Report Error:", err);

        }
    },
    {
        timezone: "Asia/Kolkata"
    }
);

console.log("✅ Daily Report Scheduler Started");