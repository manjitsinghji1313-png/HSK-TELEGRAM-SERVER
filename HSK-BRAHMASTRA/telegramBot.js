require("dotenv").config();

const pkg = require("node-telegram-bot-api");
const systemService = require("./services/systemService");

const BotClass = pkg.TelegramBot;

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log("BOT TOKEN =", BOT_TOKEN);

const bot = new BotClass(BOT_TOKEN, {
    polling: true
});

console.log("🤖 Telegram Bot Started");

bot.on("polling_error", (err) => {

    console.log("==================================");
    console.log("❌ POLLING ERROR");
    console.log(err.message);
    console.log("==================================");

});

// ===================================
// /start
// ===================================

bot.onText(/^\/start$/, async (msg) => {

    try {

        await systemService.setAutoTrading(true);

        await bot.sendMessage(
            msg.chat.id,
            "🟢 AUTO TRADING ENABLED"
        );

    } catch (err) {

        console.log(err);

        await bot.sendMessage(
            msg.chat.id,
            "❌ Error"
        );

    }

});

// ===================================
// /stop
// ===================================

bot.onText(/^\/stop$/, async (msg) => {

    try {

        await systemService.setAutoTrading(false);

        await bot.sendMessage(
            msg.chat.id,
            "🔴 AUTO TRADING DISABLED"
        );

    } catch (err) {

        console.log(err);

        await bot.sendMessage(
            msg.chat.id,
            "❌ Error"
        );

    }

});

// ===================================
// /status
// ===================================

bot.onText(/^\/status$/, async (msg) => {

    try {

        const enabled =
            await systemService.isAutoTradingEnabled();

        await bot.sendMessage(
            msg.chat.id,
`🤖 HSK BRAHMASTRA

Auto Trading : ${enabled ? "🟢 ON" : "🔴 OFF"}`
        );

    } catch (err) {

        console.log(err);

        await bot.sendMessage(
            msg.chat.id,
            "❌ Error"
        );

    }

});

module.exports = bot;