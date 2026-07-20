const express = require("express");

const router = express.Router();

const tradeService = require("../services/tradeService");
const telegramService = require("../services/telegramService");

// ==========================
// TradingView Webhook
// ==========================

router.post("/", (req, res) => {

    const data = req.body;

    console.log("=================================");
    console.log("📩 WEBHOOK RECEIVED");
    console.log(data);
    console.log("=================================");

    // ✅ TradingView ko turant response
    res.status(200).json({
        success: true,
        message: "OK"
    });

    // ==========================
    // Background Processing
    // ==========================

    (async () => {

        try {

            let message = "";

            switch (data.cmd) {

                // ==========================
                // CE ENTRY
                // ==========================

                case "CE_ENTRY":

                    await tradeService.openTrade(data);

                    message =
`🟢 <b>CE ENTRY</b>

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}
🎯 Strike : ${data.strike}
💰 Entry : ${data.price}
🛑 SL : ${data.sl}
🎯 TG1 : ${data.tg1}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>
• Educational Purpose Only
• Not SEBI Registered
• Trade at Your Own Risk`;

                    break;

                // ==========================
                // PE ENTRY
                // ==========================

                case "PE_ENTRY":

                    await tradeService.openTrade(data);

                    message =
`🔴 <b>PE ENTRY</b>

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}
🎯 Strike : ${data.strike}
💰 Entry : ${data.price}
🛑 SL : ${data.sl}
🎯 TG1 : ${data.tg1}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>
• Educational Purpose Only
• Not SEBI Registered
• Trade at Your Own Risk`;

                    break;

                // ==========================
                // TARGET HIT
                // ==========================

                case "TG1_HIT":

                    await tradeService.closeTrade(data);

                    message =
`🎯 <b>TARGET HIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;

                // ==========================
                // STOP LOSS
                // ==========================

                case "SL_HIT":

                    await tradeService.closeTrade(data);

                    message =
`🛑 <b>STOP LOSS HIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;

                // ==========================
                // EXIT
                // ==========================

                case "EXIT":

                    await tradeService.closeTrade(data);

                    message =
`📤 <b>TRADE EXIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;

                default:
                    console.log("⚠ Unknown Command :", data.cmd);
            }

            // ==========================
            // SEND TELEGRAM
            // ==========================

            if (message) {
                await telegramService.sendMessage(message);
            }

        } catch (err) {

            console.error("❌ Background Processing Error:", err);

        }

    })();

});

module.exports = router;