console.log("🔥 SERVER VERSION 999");
 
const express = require("express"); 
const dotenv = require("dotenv");

const { sendTelegramMessage } = require("./telegram");
const {
    formatMessage,
    formatReport
} = require("./formatter");

const reportManager = require("./reportManager");
const tradeManager = require("./tradeManager");

dotenv.config();

const app = express();

app.use(express.json());

// ==========================
// WEBHOOK
// ==========================
app.post("/webhook", async (req, res) => {

    try {

        console.log("📩 TradingView Alert Received");
        console.log(req.body);

        /// TradingView nu turant response
res.status(200).send("OK");

// ==========================
// TRADE MANAGER
// ==========================

let result;

// ENTRY
if (req.body.cmd === "CE_ENTRY" || req.body.cmd === "PE_ENTRY") {

    result = tradeManager.openTrade(req.body);

}

// TG1
else if (req.body.cmd === "TG1_HIT") {

    result = tradeManager.updateTrade(req.body, "PARTIAL BOOKED");

} 
 
// TG2
else if (req.body.cmd === "TG2_HIT") {

    result = tradeManager.closeTrade(req.body, "TARGET HIT");

    if (result.success) {

        const entry = Number(result.trade.entry);
        const tg2 = Number(result.trade.tg2);

        const points = Math.abs(tg2 - entry);

        reportManager.addTrade("TARGET HIT", points);

    }

}

// SL
else if (req.body.cmd === "SL_HIT") {

    result = tradeManager.closeTrade(req.body, "STOP LOSS");

    if (result.success) {

        const entry = Number(result.trade.entry);
        const sl = Number(result.trade.sl);

        const points = -Math.abs(entry - sl);

        reportManager.addTrade("STOP LOSS", points);

    }

}

// Unknown Commands
else {

    result = {
        success: true,
        trade: req.body
    };

}

if (!result.success) {

    console.log("⚠️ " + result.message);

    return;

}

// Debug
console.log("REQ BODY:", req.body);
console.log("RESULT TRADE:", result.trade);

// Telegram Message
const message = formatMessage({
    ...req.body,
    ...result.trade
});

// Telegram Message
const message = formatMessage({
    ...req.body,
    ...result.trade
});

        console.log("========== MESSAGE ==========");
        console.log(message);
        console.log("=============================");

        // Telegram background vich
        sendTelegramMessage(message)
            .catch(err => {
                console.error("❌ Telegram Background Error:", err);
            });

    } catch (err) {

        console.error("❌ WEBHOOK ERROR:");
        console.error(err);

        // Headers pehlan hi send ho chuke hon taan dubara response na bhejo
        if (!res.headersSent) {
            res.status(500).send(err.message);
        }

    }

});

// ==========================
// HOME
// ==========================
app.get("/", async (req, res) => {

    await sendTelegramMessage(
        "🛡 HSK BRAHMASTRA\n\n✅ HSK TELEGRAM SERVER V1 Successfully Started!"
    );

    res.send("🛡 HSK TELEGRAM SERVER V1 RUNNING");

});

// ==========================
// DAILY REPORT (JSON)
// ==========================
app.get("/report", (req, res) => {

    const report = reportManager.getReport();

    res.json(report);

});

// ==========================
// SEND DAILY REPORT
// ==========================
app.get("/sendReport", async (req, res) => {

    const report = reportManager.getReport();

    const message = formatReport(report);

    await sendTelegramMessage(message);

    res.send("✅ Daily Report Sent");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 HSK TELEGRAM SERVER V1 running on port ${PORT}`);
});