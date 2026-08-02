const express = require("express");
const router = express.Router();

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

                case "CE_ENTRY":
                case "PE_ENTRY": {

                    // ==========================
                    // AUTO TRADING CHECK
                    // ==========================

                    const autoTrading =
                        await systemService.isAutoTradingEnabled();

                    if (!autoTrading) {

                        console.log("⛔ AUTO TRADING DISABLED");

                        message =
`⛔ <b>AUTO TRADING DISABLED</b>

📊 Symbol : ${data.symbol}

⚠ Signal Received

🚫 Broker Order Blocked`;

                        break;
                    }

                    try {


                        console.log("================================");
                        console.log("🚀 CALLING PLACE ORDER");
                        console.log(data.tradeKey);
                        console.log("================================");
                        // ==========================
                        // PLACE DHAN ORDER
                        // ==========================

                        await placeOrder({

                        

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
                                (data.cmd === "CE_ENTRY"
                                    ? "CE"
                                    : "PE"),

                            price: Number(
                                data.limitPrice || data.price
                            ),

                            lots: Number(data.lots || 1)

                        });


                        console.log("================================");
                        console.log("✅ PLACE ORDER RETURNED");
                        console.log("================================");


                        console.log("✅ DHAN ORDER SUCCESS");

                        // ==========================
                        // SAVE TRADE
                        // ==========================

                        try {

                            await tradeService.openTrade(data);

                            console.log("✅ TRADE SAVED");

                        } catch (err) {

                            console.log("❌ TRADE SAVE FAILED");
                            console.log(err.message);

                            console.log("⚠ Closing Position...");

                            try {

                                await exitOrder({

                                    tradeKey: data.tradeKey

                                });

                                console.log("✅ POSITION CLOSED");

                            } catch (exitErr) {

                                console.log("❌ POSITION CLOSE FAILED");
                                console.log(exitErr.message);

                            }

                            return;

                        }

                    } catch (err) {

                        console.log("❌ DHAN ORDER FAILED");
                        console.log(err.message);

                        return;

                    }

                    message =
`${data.cmd === "CE_ENTRY" ? "🟢" : "🔴"} <b>${data.cmd.replace("_"," ")}</b>

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
• Trade At Your Own Risk`;

                    break;
                }

                // =====================================
                // TARGET HIT
                // =====================================

                case "TG1_HIT": {

                    try {

                        await exitOrder({

                            tradeKey: data.tradeKey

                        });

                        console.log("✅ TARGET EXIT SUCCESS");

                    } catch (err) {

                        console.log("❌ TARGET EXIT FAILED");
                        console.log(err.message);

                    }

                    await tradeService.closeTrade(data);

                    message =
`🎯 <b>TARGET HIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;
                }

                // =====================================
                // STOP LOSS
                // =====================================

                case "SL_HIT": {

                    try {

                        await exitOrder({

                            tradeKey: data.tradeKey

                        });

                        console.log("✅ STOP LOSS EXIT SUCCESS");

                    } catch (err) {

                        console.log("❌ STOP LOSS EXIT FAILED");
                        console.log(err.message);

                    }

                    await tradeService.closeTrade(data);

                    message =
`🛑 <b>STOP LOSS HIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;
                }

                // =====================================
                // MANUAL EXIT
                // =====================================

                case "EXIT": {

                    try {

                        await exitOrder({

                            tradeKey: data.tradeKey

                        });

                        console.log("✅ MANUAL EXIT SUCCESS");

                    } catch (err) {

                        console.log("❌ MANUAL EXIT FAILED");
                        console.log(err.message);

                    }

                    await tradeService.closeTrade(data);

                    message =
`📤 <b>TRADE EXIT</b>

📊 Symbol : ${data.symbol}
🆔 Trade : ${data.tradeKey}`;

                    break;
                }

                // =====================================
                // UNKNOWN COMMAND
                // =====================================

                        default:

                    console.log("⚠ Unknown Command :", data.cmd);

                    break;

            } // <-- switch END

            // =====================================
            // SEND TELEGRAM MESSAGE
            // =====================================

            if (message) {

                try {

                    await telegramService.sendMessage(message);

                    console.log("✅ Telegram Message Sent");

                } catch (err) {

                    console.log("❌ Telegram Message Failed");
                    console.log(err.message);

                }

            }

        } catch (err) {

            console.error("=================================");
            console.error("❌ BACKGROUND PROCESSING ERROR");
            console.error(err);
            console.error("=================================");

        }

    })();

});

module.exports = router;