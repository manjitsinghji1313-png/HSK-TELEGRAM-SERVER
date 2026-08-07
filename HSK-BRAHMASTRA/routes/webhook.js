
// const settings = require("../config/settings");
const express = require("express");
const router = express.Router();
const { getLotSize } =
require("../utils/marketLots");
const { findInstrument } = require("../optionchain/instrumentFinder");
const {
    extractStrikeFromSymbol,
    extractMarket,
    extractOptionType
} = require("../utils/extractStrike");

const tradeService = require("../services/tradeService");
const telegramService = require("../services/telegramService");

const placeOrder = require("../broker/placeOrder");
const exitOrder = require("../broker/exitOrder");

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

case "BUY":
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

const settings = await systemService.getSettings();

console.log("===== DATABASE SETTINGS =====");
console.log(settings);
console.log("=============================");
console.log("Paper Mode =", settings.paper_mode);

const autoTrading = settings.auto_trading;

// ==========================
// ALWAYS EXTRACT STRIKE
// ==========================

const extractedStrike = extractStrikeFromSymbol(data.symbol);

if (extractedStrike > 0) {

    data.strike = extractedStrike;
    console.log("✅ Strike Extracted :", data.strike);

} else {

    console.log("❌ Unable to Extract Strike :", data.symbol);

    // Fallback to TradingView strike if available
    data.strike = Number(data.strike) || 0;

}

console.log("🎯 Final Strike :", data.strike);

// ==========================
// AUTO TRADING OFF
// ==========================

if (!autoTrading) {

    console.log("⛔ AUTO TRADING DISABLED");

    message += `

🚫 Broker Order Blocked

⚙ Auto Trading : OFF

━━━━━━━━━━━━━━━━━━
⚠️ Disclaimer

• Educational Purpose Only
• Not SEBI Registered
• Trade At Your Own Risk`;

    break;

}
    // ==========================
// ==========================
// LOTS & QUANTITY
// ==========================
// ==========================
// ==========================
// FIND INSTRUMENT
// ==========================

const market = extractMarket(data.symbol);

// Detect Option Type from Command / Symbol
let optionType;

if (data.cmd === "CE_ENTRY") {

    optionType = "CE";

} else if (data.cmd === "PE_ENTRY") {

    optionType = "PE";

} else if (data.cmd === "BUY") {

    optionType = extractOptionType(data.symbol);

    if (!optionType) {

        throw new Error(`Unable to detect option type from symbol: ${data.symbol}`);

    }

}

console.log("📦 Market :", market);
console.log("🎯 Strike :", data.strike);
console.log("📈 Option :", optionType);

const instrument = await findInstrument(
    market,
    Number(data.strike),
    optionType
);

if (!instrument) {

    throw new Error("Instrument not found");


}

const lotSize =
    getLotSize(market);

const quantity =
    lotSize * settings.lots;

console.log("📦 Instrument :", instrument.tradingSymbol);
console.log("🆔 Security ID :", instrument.securityId);
console.log("📦 Exchange :", instrument.exchange);
console.log("📦 Expiry :", instrument.expiry);
console.log("📦 Option :", instrument.optionType);
console.log("📦 Market :", market);
console.log("📦 Exchange Lot :", lotSize);
console.log("📦 User Lots :", settings.lots);
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

    lotSize,

    quantity,

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
                data.orderType || "MARKET",

            symbol: instrument.tradingSymbol,

            strike: instrument.strike,

            securityId: instrument.securityId,

            exchange: instrument.exchange,

            optionType: optionType,

            price: 0,

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

    lotSize,

    quantity,

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

    // ==========================
    // PAPER MODE
    // ==========================

    if (settings.paper_mode) {

        console.log("================================");
        console.log("📝 PAPER TARGET HIT");
        console.log("================================");

        await tradeService.closeTrade({
            tradeKey: data.tradeKey,
            cmd: "TG1_HIT",
            status: "TARGET HIT"
        });

        await telegramService.sendMessage(

`🎯 TARGET HIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

📝 PAPER TRADE

✅ Target Achieved
🚫 Broker Exit Not Sent

📦 Lots : ${settings.lots}
📈 Mode : PAPER`

        );

        console.log("✅ PAPER TARGET MESSAGE SENT");

    }

    // ==========================
    // LIVE MODE
    // ==========================

    else {

        try {

            await exitOrder({
                tradeKey: data.tradeKey
            });

            await tradeService.closeTrade({
                tradeKey: data.tradeKey,
                cmd: "TG1_HIT",
                status: "TARGET HIT"
            });

            console.log("================================");
            console.log("✅ TARGET EXIT SUCCESS");
            console.log("================================");

            await telegramService.sendMessage(

`🎯 TARGET HIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

🤖 LIVE TRADE

✅ Broker Exit Successful

📦 Lots : ${settings.lots}
📈 Mode : LIVE`

            );

            console.log("✅ LIVE TARGET MESSAGE SENT");

        } catch (err) {

            console.log("================================");
            console.log("❌ TARGET EXIT FAILED");
            console.log(err.message);
            console.log("================================");

            await telegramService.sendMessage(

`❌ TARGET EXIT FAILED

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}

🆔 Trade ID : ${data.tradeKey}

⚠️ ${err.message}`

            );

        }

    }

    break;

}
// =====================================
// STOP LOSS
// =====================================

case "SL_HIT": {

    const settings = await systemService.getSettings();

    if (!settings) {

        console.log("❌ System Settings Not Found");

        break;

    }

    // ==========================
    // PAPER MODE
    // ==========================

    if (settings.paper_mode) {

        console.log("================================");
        console.log("📝 PAPER STOP LOSS");
        console.log("================================");

        await tradeService.closeTrade({
            tradeKey: data.tradeKey,
            cmd: "SL_HIT",
            status: "STOP LOSS"
        });

        await telegramService.sendMessage(

`🛑 STOP LOSS HIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

📝 PAPER TRADE

❌ Stop Loss Hit
🚫 Broker Exit Not Sent

📦 Lots : ${settings.lots}
📈 Mode : PAPER`

        );

        console.log("✅ PAPER STOP LOSS MESSAGE SENT");

    }

    // ==========================
    // LIVE MODE
    // ==========================

    else {

        try {

            await exitOrder({
                tradeKey: data.tradeKey
            });

            await tradeService.closeTrade({
                tradeKey: data.tradeKey,
                cmd: "SL_HIT",
                status: "STOP LOSS"
            });

            console.log("================================");
            console.log("✅ STOP LOSS EXIT SUCCESS");
            console.log("================================");

            await telegramService.sendMessage(

`🛑 STOP LOSS HIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

🤖 LIVE TRADE

✅ Broker Exit Successful

📦 Lots : ${settings.lots}
📈 Mode : LIVE`

            );

            console.log("✅ LIVE STOP LOSS MESSAGE SENT");

        } catch (err) {

            console.log("================================");
            console.log("❌ STOP LOSS EXIT FAILED");
            console.log(err.message);
            console.log("================================");

            await telegramService.sendMessage(

`❌ STOP LOSS EXIT FAILED

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}

🆔 Trade ID : ${data.tradeKey}

⚠️ ${err.message}`

            );

        }

    }

    break;

}

// =====================================
// MANUAL EXIT
// =====================================

case "EXIT": {

    const settings = await systemService.getSettings();

    if (!settings) {

        console.log("❌ System Settings Not Found");

        break;

    }

    // ==========================
    // PAPER MODE
    // ==========================

    if (settings.paper_mode) {

        console.log("================================");
        console.log("📝 PAPER MANUAL EXIT");
        console.log("================================");

        await tradeService.closeTrade({
            tradeKey: data.tradeKey,
            cmd: "EXIT",
            status: "MANUAL EXIT"
        });

        await telegramService.sendMessage(

`📤 MANUAL EXIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

📝 PAPER TRADE

📦 Position Closed

📦 Lots : ${settings.lots}
📈 Mode : PAPER`

        );

        console.log("✅ PAPER EXIT MESSAGE SENT");

    }

    // ==========================
    // LIVE MODE
    // ==========================

    else {

        try {

            await exitOrder({
                tradeKey: data.tradeKey
            });

            await tradeService.closeTrade({
                tradeKey: data.tradeKey,
                cmd: "EXIT",
                status: "MANUAL EXIT"
            });

            console.log("================================");
            console.log("✅ MANUAL EXIT SUCCESS");
            console.log("================================");

            await telegramService.sendMessage(

`📤 MANUAL EXIT

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}
⏱ Timeframe : ${data.timeframe}

🆔 Trade ID : ${data.tradeKey}

━━━━━━━━━━━━━━━━━━

🤖 LIVE TRADE

✅ Broker Exit Successful

📦 Lots : ${settings.lots}
📈 Mode : LIVE`

            );

            console.log("✅ LIVE EXIT MESSAGE SENT");

        } catch (err) {

            console.log("================================");
            console.log("❌ MANUAL EXIT FAILED");
            console.log(err.message);
            console.log("================================");

            await telegramService.sendMessage(

`❌ MANUAL EXIT FAILED

━━━━━━━━━━━━━━━━━━

📊 Symbol : ${data.symbol}

🆔 Trade ID : ${data.tradeKey}

⚠️ ${err.message}`

            );

        }

    }

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