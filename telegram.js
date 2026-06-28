require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: false,
});

async function sendTelegramMessage(message) {
    try {
        await bot.sendMessage(process.env.CHANNEL_ID, message, {
            parse_mode: "Markdown"
        });

        console.log("✅ Telegram message sent");

    } catch (error) {
        console.error("❌ Telegram Error:", error.response?.body || error.message);
    }
}

module.exports = { sendTelegramMessage };