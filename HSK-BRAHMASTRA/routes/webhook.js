
// const settings = require("../config/settings");
const express = require("express");
const router = express.Router();

const tradeService = require("../services/tradeService");
const telegramService = require("../services/telegramService");

const placeOrder = require("../broker/placeOrder");
const exitOrder = require("../broker/exitOrder");
// console.log("📦 Current Lots:", settings.lots);
const systemService = require("../services/systemService");
// ==========================
// TradingView Webhook
// ==========================

router.post("/", (req, res) => {

    const data = req.body;

    console.log("=================================");
    console.log("📩 WEBHOOK RECEIVED");
    console.log(data);
    console.log("=================================");

    // TradingView Response
    res.status(200).json({
        success: true,
        message: "OK"
    });

    (async () => {

        try {

            let message = "";

            switch (data.cmd) {

// =====================================
// CE ENTRY / PE ENTRY
// =====================================

case "CE_ENTRY":
case "PE_ENTRY": {

    // ==========================
    // CREATE ENTRY MESSAGE
    // ==========================

    message =
`${data.cmd === "CE_ENTRY" ? "🟢" : "🔴"} <b>${data.cmd.replace("_"," ")}</b>

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}
🎯 Strike : ${data.strike}
💰 Entry : ${data.price}
🛑 SL : ${data.sl}
🎯 TG1 : ${data.tg1}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━`;

    // ==========================
    // AUTO TRADING CHECK
    // ==========================

    const settings =
    await systemService.getSettings();

    console.log("===== DATABASE SETTINGS =====");
    console.log(settings);
    console.log("=============================");
    console.log("Paper Mode =", settings.paper_mode);

    const autoTrading =
    settings.auto_trading;

    

    if (!autoTrading) {

        console.log("⛔ AUTO TRADING DISABLED");

        message +=
`

🚫 <b>Broker Order Blocked</b>

⚙ Auto Trading : OFF

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

        break;

    }
    // ==========================
// LOTS & QUANTITY
// ==========================



console.log("📦 Lots :", settings.lots);
console.log("📊 Quantity :", quantity);

// ==========================
// PAPER MODE
// ==========================

if (settings.paper_mode) {

    console.log("================================");
    console.log("📝 PAPER MODE ENABLED");
    console.log("================================");

    await tradeService.openTrade({
    ...data,
    lots: settings.lots,
    mode: "PAPER",
    status: "OPEN"
});

    console.log("✅ PAPER TRADE SAVED");
message += `

📝 <b>PAPER TRADE</b>

🚫 Broker Order Not Sent

📦 Lots : ${settings.lots}

📈 Mode : PAPER`;

    break;
}


    try {

        console.log("================================");
        console.log("🚀 CALLING PLACE ORDER");
        console.log(data.tradeKey);
        console.log("================================");

        const orderResult = await placeOrder({

            tradeKey: data.tradeKey,

            transactionType:
                data.transactionType || "BUY",

            productType:
                data.productType || "INTRADAY",

            orderType:
                data.orderType || "LIMIT",

            symbol: data.symbol,

            strike: Number(data.strike),

            optionType:
                data.optionType ||
                (data.cmd === "CE_ENTRY" ? "CE" : "PE"),

            price: Number(data.limitPrice || data.price),

            sl: Number(data.sl),

            tg1: Number(data.tg1),

            lots: settings.lots,
            quantity: quantity

        });

        console.log("================================");
        console.log("✅ PLACE ORDER RETURNED");
        console.log(orderResult);
        console.log("================================");

        message +=
`

✅ <b>Broker : ORDER PLACED</b>

🆔 Order ID : ${orderResult.orderId || "N/A"}`;

        try {

            await tradeService.openTrade({

    ...data,

    lots: settings.lots,

    quantity: quantity,

    mode: "LIVE",

    status: "OPEN",

    orderId: orderResult.orderId

});

console.log("✅ LIVE TRADE SAVED");

        } catch (err) {

            console.log("❌ TRADE SAVE FAILED");
            console.log(err.message);

            message +=
`

⚠️ <b>Trade Save Failed</b>

Reason :
${err.message}`;

            try {

                await exitOrder({

                    tradeKey: data.tradeKey

                });

                console.log("✅ POSITION CLOSED");

            } catch (exitErr) {

                console.log("❌ POSITION CLOSE FAILED");
                console.log(exitErr.message);

            }

        }

    } catch (err) {

        console.log("❌ DHAN ORDER FAILED");
        console.log(err.message);

        message +=
`

❌ <b>Broker Order Failed</b>

Reason :
${err.message}`;

    }

    message +=
`

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

    break;
}
case "TG1_HIT": {

    const settings = await systemService.getSettings();

    if (!settings) {

        console.log("❌ System Settings Not Found");

        break;

    }

    if (settings.paper_mode) {

        console.log("📝 PAPER TARGET HIT");

    } else {

        try {

            await exitOrder({
                tradeKey: data.tradeKey
            });

            console.log("✅ TARGET EXIT SUCCESS");

        } catch (err) {

            console.log("❌ TARGET EXIT FAILED");
            console.log(err.message);

        }

    }

    break;
}

// =====================================
// STOP LOSS
// =====================================

case "SL_HIT": {
    const settings =
    await systemService.getSettings();

    if (settings.paper_mode) {

    console.log("📝 PAPER STOP LOSS");

} else {

    try {

        await exitOrder({
            tradeKey: data.tradeKey
        });

        console.log("✅ STOP LOSS EXIT SUCCESS");

    } catch (err) {

        console.log("❌ STOP LOSS EXIT FAILED");
        console.log(err.message);

    }

}

    await tradeService.closeTrade(data);

    message =
`🛑 <b>STOP LOSS HIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

❌ Position Closed

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

    break;
}

// =====================================
// MANUAL EXIT
// =====================================

case "EXIT": {
    const settings =
    await systemService.getSettings();

    if (settings.paper_mode) {

    console.log("📝 PAPER MANUAL EXIT");

} else {

    try {

        await exitOrder({
            tradeKey: data.tradeKey
        });

        console.log("✅ MANUAL EXIT SUCCESS");

    } catch (err) {

        console.log("❌ MANUAL EXIT FAILED");
        console.log(err.message);

    }

}

    await tradeService.closeTrade(data);

    message =
`📤 <b>TRADE EXIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

📦 Position Closed Successfully

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

    break;
}
                // =====================================
                // UNKNOWN COMMAND
                // =====================================

                default: {

                    console.log("⚠ Unknown Command :", data.cmd);

                    message =
`⚠ <b>UNKNOWN COMMAND</b>

📩 Command :
${data.cmd}

━━━━━━━━━━━━━━━━━━
⚠️ <b>Disclaimer</b>

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

                    break;
                }

            } // ================= END SWITCH =================


            // =====================================
            // SEND TELEGRAM MESSAGE
            // =====================================

            if (message) {

                try {

                    await telegramService.sendMessage(message);

                    console.log("================================");
                    console.log("✅ TELEGRAM MESSAGE SENT");
                    console.log("================================");

                } catch (err) {

                    console.log("================================");
                    console.log("❌ TELEGRAM MESSAGE FAILED");
                    console.log(err.message);
                    console.log("================================");

                }

            }

        } catch (err) {

            console.log("================================");
            console.log("❌ BACKGROUND PROCESS FAILED");
            console.log(err);
            console.log("================================");

        }

    })();

});

module.exports = router;                