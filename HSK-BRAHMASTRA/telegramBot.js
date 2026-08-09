require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
const {
    setOrderMode
} = require("./routes/orderMode");

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
// ENTRY BUFFER
// ==========================

bot.command("buffer", async (ctx) => {

    try {

        const args = ctx.message.text.trim().split(/\s+/);

        // /buffer -> show current buffer
        if (args.length === 1) {

            const settings =
                await systemService.getSettings();

            const buffer =
                Number(settings.entry_buffer || 0);

            await ctx.reply(
`📊 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

📈 CE LIMIT BUFFER

💰 Current Buffer : ₹${buffer}

━━━━━━━━━━━━━━━━━━

Commands:

/buffer 0 → OFF
/buffer 1 → ₹1
/buffer 2 → ₹2

━━━━━━━━━━━━━━━━━━`
            );

            return;
        }

        const buffer = Number(args[1]);

        // Only 0, 1, 2 allowed
        if (![0, 1, 2].includes(buffer)) {

            await ctx.reply(
`❌ INVALID BUFFER

Only these values are allowed:

0 = OFF
1 = ₹1
2 = ₹2`
            );

            return;
        }

        await systemService.setEntryBuffer(buffer);

        const status =
            buffer === 0
                ? "🔴 OFF"
                : `🟢 ₹${buffer}`;

        await ctx.reply(
`✅ BUFFER UPDATED

━━━━━━━━━━━━━━━━━━

📈 CE LIMIT BUFFER
💰 Buffer : ${status}

━━━━━━━━━━━━━━━━━━

🎯 Only CE LIMIT Entry
🛑 SL / TG unchanged

━━━━━━━━━━━━━━━━━━

Dhan Entry Buffer Updated`
        );

        console.log(
            `✅ CE Entry Buffer Set: ₹${buffer}`
        );

    } catch (err) {

        console.error(err);

        await ctx.reply(
            `❌ BUFFER UPDATE FAILED\n\n${err.message}`
        );

    }

});
// ==========================
// ORDER MODE
// ==========================

bot.command("ordermode", async (ctx) => {

    try {

        const currentMode = await systemService.getOrderMode();

        await ctx.reply(
            `🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

📌 ORDER MODE

Current Mode : ${currentMode}

Select Order Type:

━━━━━━━━━━━━━━━━━━`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "🟢 LIMIT",
                        "ORDER_MODE_LIMIT"
                    ),
                    Markup.button.callback(
                        "🔵 MARKET",
                        "ORDER_MODE_MARKET"
                    )
                ]
            ])
        );

    } catch (err) {

        console.error(err);

        await ctx.reply(
            `❌ ORDER MODE FAILED\n\n${err.message}`
        );

    }

});
// ==========================
// ORDER MODE BUTTON HANDLER
// ==========================

bot.action("ORDER_MODE_LIMIT", async (ctx) => {

    try {

        const mode =
            await setOrderMode("LIMIT");

        await ctx.answerCbQuery(
            "LIMIT MODE SELECTED"
        );

        await ctx.editMessageText(
            `🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

📌 ORDER MODE

Current Mode : 🟢 ${mode}

━━━━━━━━━━━━━━━━━━

⏱️ LIMIT ORDER
3 Minute Pending Check
→ PENDING = CANCEL

━━━━━━━━━━━━━━━━━━

✅ LIMIT MODE ACTIVE`
        );

        console.log(
            "🟢 Telegram Order Mode : LIMIT"
        );

    } catch (err) {

        console.error(err);

        await ctx.answerCbQuery(
            "❌ Failed"
        );

    }

});


bot.action("ORDER_MODE_MARKET", async (ctx) => {

    try {

        const mode =
            await setOrderMode("MARKET");

        await ctx.answerCbQuery(
            "MARKET MODE SELECTED"
        );

        await ctx.editMessageText(
            `🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

📌 ORDER MODE

Current Mode : 🔵 ${mode}

━━━━━━━━━━━━━━━━━━

⚡ MARKET ORDER
No 3 Minute Pending Cancel

━━━━━━━━━━━━━━━━━━

✅ MARKET MODE ACTIVE`
        );

        console.log(
            "🔵 Telegram Order Mode : MARKET"
        );

    } catch (err) {

        console.error(err);

        await ctx.answerCbQuery(
            "❌ Failed"
        );

    }

});

// ==========================
// STATUS
// ==========================

bot.command("status", async (ctx) => {

    try {

        const settings =
            await systemService.getSettings();

        const currentIST = new Intl.DateTimeFormat(
                "en-IN",
            {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "medium"
            }
        ).format(new Date());

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
${currentIST}

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
⚙️ /ordermode

📈 CE LIMIT BUFFER
💰 /buffer
💰 /buffer 0
💰 /buffer 1
💰 /buffer 2

❓ /help

━━━━━━━━━━━━━━━━━━

HSK BRAHMASTRA`
    );

});

// ==========================
// TELEGRAM GLOBAL ERROR HANDLER
// ==========================

bot.catch((err, ctx) => {

    console.error("================================");
    console.error("❌ TELEGRAM BOT ERROR");
    console.error("Update Type :", ctx.updateType);
    console.error("Error :", err);
    console.error("================================");

});

module.exports = bot;

