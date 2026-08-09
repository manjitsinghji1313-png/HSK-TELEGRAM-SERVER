// ==========================
// ORDER MODE
// ==========================

bot.command("ordermode", async (ctx) => {

    try {

        const currentMode =
            await systemService.getOrderMode();

        await ctx.reply(
            `🤖 HSK BRAHMASTRA

━━━━━━━━━━━━━━━━━━

📌 ORDER MODE

Current Mode : ${
                currentMode === "MARKET"
                    ? "🔵 MARKET"
                    : "🟢 LIMIT"
            }

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
// LIMIT BUTTON
// ==========================

bot.action("ORDER_MODE_LIMIT", async (ctx) => {

    try {

        const mode =
            await systemService.setOrderMode("LIMIT");

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


// ==========================
// MARKET BUTTON
// ==========================

bot.action("ORDER_MODE_MARKET", async (ctx) => {

    try {

        const mode =
            await systemService.setOrderMode("MARKET");

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