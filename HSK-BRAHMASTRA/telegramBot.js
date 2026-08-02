require("dotenv").config();

const { TelegramBot } = require("node-telegram-bot-api");
const systemService = require("./services/systemService");

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log("BOT TOKEN =", BOT_TOKEN);

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
});

console.log("🤖 Telegram Bot Started");

// ==========================
// START
// ==========================

bot.onText(/^\/start$/, async (msg) => {

    await systemService.setAutoTrading(true);

    bot.sendMessage(msg.chat.id, "🟢 AUTO TRADING ENABLED");

});

// ==========================
// STOP
// ==========================

bot.onText(/^\/stop$/, async (msg) => {

    await systemService.setAutoTrading(false);

    bot.sendMessage(msg.chat.id, "🔴 AUTO TRADING DISABLED");

});

// ==========================
// STATUS
// ==========================

bot.onText(/^\/status$/, async (msg) => {

    const enabled =
        await systemService.isAutoTradingEnabled();

    bot.sendMessage(
        msg.chat.id,
        `🤖 HSK BRAHMASTRA

Auto Trading : ${enabled ? "🟢 ON" : "🔴 OFF"}`
    );

});

module.exports = bot;