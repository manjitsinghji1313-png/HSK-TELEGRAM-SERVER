require("dotenv").config();

const { Telegraf } = require("telegraf");
const systemService = require("./services/systemService");

const bot = new Telegraf(process.env.BOT_TOKEN);

// ==========================
// START
// ==========================

bot.command("start", async (ctx) => {

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

bot.command("stop", async (ctx) => {

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
// STATUS
// ==========================

bot.command("status", async (ctx) => {

    try {

        const settings =
            await systemService.getSettings();

        const status =
            settings.auto_trading ? "🟢 ON" : "🔴 OFF";

        await ctx.reply(
`🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

🤖 Broker : DHAN

Auto Trading : ${status}

Updated :
${settings.updated_at}

━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {

        console.error(err);

        await ctx.reply(`❌ ${err.message}`);

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

🟢 /start
🔴 /stop
📊 /status
❓ /help

━━━━━━━━━━━━━━━━━━

HSK BRAHMASTRA`
    );

});
// ==========================
// START BOT
// ==========================

(async () => {

    try {

        await bot.telegram.deleteWebhook();

        await bot.launch();

        console.log("🤖 Telegram Bot Started");

    } catch (err) {

        console.error(err);

    }

})();

// Graceful Stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;

