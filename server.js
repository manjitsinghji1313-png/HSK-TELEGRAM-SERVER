console.log("🔥 SERVER VERSION 999");
 
const express = require("express"); 
const dotenv = require("dotenv");
const { sendTelegramMessage } = require("./telegram");
const { formatMessage } = require("./formatter");

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

        // TradingView nu turant response
        res.status(200).send("OK");

        const message = formatMessage(req.body);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 HSK TELEGRAM SERVER V1 running on port ${PORT}`);
});