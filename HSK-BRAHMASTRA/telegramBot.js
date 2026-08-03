require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const systemService = require("./services/systemService");

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
});

console.log("🤖 Telegram Bot Started");

// ==========================
// START TRADE
// ==========================

bot.onText(/^\/start$/, async (msg) => {

    try {

        await systemService.setAutoTrading(true);

        await bot.sendMessage(
            msg.chat.id,
`🟢 AUTO TRADING ENABLED

🤖 Broker : DHAN
📈 Status : ACTIVE

━━━━━━━━━━━━━━━━━━

✅ Database Updated Successfully`
        );

        console.log("✅ Auto Trading Enabled");

    } catch (err) {

        console.error(err);

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.message}`
        );

    }

});

// ==========================
// STOP TRADE
// ==========================

bot.onText(/^\/stop$/, async (msg) => {

    try {

        await systemService.setAutoTrading(false);

        await bot.sendMessage(
            msg.chat.id,
`🔴 AUTO TRADING DISABLED

🤖 Broker : DHAN
📉 Status : STOPPED

━━━━━━━━━━━━━━━━━━

✅ Database Updated Successfully`
        );

        console.log("⛔ Auto Trading Disabled");

    } catch (err) {

        console.error(err);

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.message}`
        );

    }

});

// ==========================
// STATUS
// ==========================

bot.onText(/^\/status$/, async (msg) => {

    try {

        const settings = await systemService.getSettings();

        const status =
            settings.auto_trading ? "🟢 ON" : "🔴 OFF";

        await bot.sendMessage(
            msg.chat.id,
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

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.message}`
        );

    }

});

console.log("✅ Commands Loaded");

// ==========================
// HELP
// ==========================

bot.onText(/^\/help$/, async (msg) => {

    await bot.sendMessage(
        msg.chat.id,
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
// UNKNOWN COMMAND
// ==========================

bot.on("message", async (msg) => {

    if (!msg.text) return;

    if (
        msg.text === "/starttrade" ||
        msg.text === "/stoptrade" ||
        msg.text === "/status" ||
        msg.text === "/help"
    ) {
        return;
    }

    if (msg.text.startsWith("/")) {

        await bot.sendMessage(
            msg.chat.id,
            `❌ Unknown Command

Type /help`
        );

    }

});

module.exports = bot;