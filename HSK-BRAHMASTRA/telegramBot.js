require("dotenv").config();

const { Telegraf } = require("telegraf");
const systemService = require("./services/systemService");

const bot = new Telegraf(process.env.BOT_TOKEN);

const tradeService = require("./services/tradeService");
// ==========================
// START
// ==========================

bot.command("starttrade", async (ctx) => {

    try {

        await systemService.setAutoTrading(true);

        await ctx.reply(
`🟢 AUTO TRADING ENABLED

🤖 Broker : DHAN
📈 Status : ACTIVE

━━━━━━━━━━━━━━━━━━

✅ Database Updated Successfully`
        );

        console.log("✅ Auto Trading Enabled");

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

    }

});

// ==========================
// STOP
// ==========================

bot.command("stoptrade", async (ctx) => {

    try {

        await systemService.setAutoTrading(false);

        await ctx.reply(
`🔴 AUTO TRADING DISABLED

🤖 Broker : DHAN
📉 Status : STOPPED

━━━━━━━━━━━━━━━━━━

✅ Database Updated Successfully`
        );

        console.log("⛔ Auto Trading Disabled");

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

    }

});

// ==========================
// PAPER MODE
// ==========================

bot.command("paper", async (ctx) => {

    try {

        await systemService.setPaperMode(true);

        await ctx.reply(
`📝 PAPER MODE ENABLED

🤖 Broker : DHAN
📊 Mode   : PAPER

━━━━━━━━━━━━━━━━━━

✅ No Real Broker Orders
📝 Paper Trading Active`
        );

        console.log("📝 Paper Mode Enabled");

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

    }

});
// ==========================
// LIVE MODE
// ==========================

bot.command("live", async (ctx) => {

    try {

        await systemService.setPaperMode(false);

        await ctx.reply(
`🔴 LIVE MODE ENABLED

🤖 Broker : DHAN
⚠️ Mode   : LIVE

━━━━━━━━━━━━━━━━━━

🚨 REAL BROKER ORDERS ENABLED
⚠️ Trade Carefully`
        );

        console.log("🔴 Live Mode Enabled");

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

    }

});

// ==========================
// STATUS
// ==========================

bot.command("status", async (ctx) => {

    try {

        const settings =
            await systemService.getSettings();

        const updatedIST = new Intl.DateTimeFormat(
                "en-IN",
                {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "medium"
                }
            ).format(new Date(settings.updated_at));

        const status =
            settings.auto_trading ? "🟢 ON" : "🔴 OFF";
        const mode =
            settings.paper_mode
                ? "📝 PAPER"
                : "🔴 LIVE";
        await ctx.reply(
`🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

🤖 Broker : DHAN

Auto Trading : ${status}
Mode         : ${mode}

Updated :
${updatedIST}

━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

    }

});

// ==========================
// RESET
// ==========================

bot.command("reset", async (ctx) => {

    try {

        const success = await tradeService.resetTrades();

        if (!success) {
        throw new Error("Trade Reset Failed");
    }

        await ctx.reply(
`🧹 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

✅ Manual Reset Completed

📦 Active Trades : 0
📁 Closed Trades : 0
📊 Dashboard Reset

🚀 Ready For New Session`
        );

        console.log("✅ Manual Reset Completed");

    } catch (err) {

        console.error(err);

        await ctx.reply(
`❌ RESET FAILED

${err.message}`
        );

    }

});

// ==========================
// HELP
// ==========================

bot.command("help", async (ctx) => {

    await ctx.reply(
`🤖 HSK BRAHMASTRA BOT

━━━━━━━━━━━━━━━━━━

Available Commands

🟢 /starttrade
🔴 /stoptrade
📝 /paper
🚨 /live
🧹 /reset
📊 /status
❓ /help

━━━━━━━━━━━━━━━━━━

HSK BRAHMASTRA`
    );

});




module.exports = bot;

