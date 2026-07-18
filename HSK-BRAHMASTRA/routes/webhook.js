const express = require("express");

const router = express.Router();

const tradeService = require("../services/tradeService");
const telegramService = require("../services/telegramService");

// ==========================
// TradingView Webhook
// ==========================

router.post("/", async (req, res) => {

    try {

        console.log("=================================");
        console.log("📩 WEBHOOK RECEIVED");
        console.log(req.body);
        console.log("=================================");

        const data = req.body;

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

            // ==========================
            // UNKNOWN
            // ==========================

            default:

                console.log("⚠ Unknown Command :", data.cmd);

        }

        // ==========================
        // SEND TELEGRAM MESSAGE
        // ==========================

        if (message) {
            await telegramService.sendMessage(message);
        }

        res.status(200).json({
            success: true,
            message: "Webhook Received"
        });

    } catch (err) {

        console.error("❌ Webhook Error:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;