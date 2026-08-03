require("dotenv").config();

const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;

const API = "https://hsk-telegram-server.onrender.com/api/auto";

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
});

console.log("🤖 Telegram Bot Started");

// ==========================
// START TRADE
// ==========================

bot.onText(/^\/starttrade$/, async (msg) => {

    try {

        const { data } = await axios.get(`${API}/start`);

        await bot.sendMessage(
            msg.chat.id,
`🟢 AUTO TRADING ENABLED

🤖 Broker : DHAN
📈 Status : ACTIVE

━━━━━━━━━━━━━━━━━━

${data.message}`
        );

    } catch (err) {

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.response?.data?.error || err.message}`
        );

    }

});

// ==========================
// STOP TRADE
// ==========================

bot.onText(/^\/stoptrade$/, async (msg) => {

    try {

        const { data } = await axios.get(`${API}/stop`);

        await bot.sendMessage(
            msg.chat.id,
`🔴 AUTO TRADING DISABLED

🤖 Broker : DHAN
📉 Status : STOPPED

━━━━━━━━━━━━━━━━━━

${data.message}`
        );

    } catch (err) {

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.response?.data?.error || err.message}`
        );

    }

});

// ==========================
// STATUS
// ==========================

bot.onText(/^\/status$/, async (msg) => {

    try {

        const { data } = await axios.get(`${API}/status`);

        const status =
            data.autoTrading ? "🟢 ON" : "🔴 OFF";

        await bot.sendMessage(
            msg.chat.id,
`🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

Auto Trading : ${status}

Updated :
${data.updatedAt}

━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {

        await bot.sendMessage(
            msg.chat.id,
            `❌ ${err.response?.data?.error || err.message}`
        );

    }

});

console.log("✅ Commands Loaded");

module.exports = bot;