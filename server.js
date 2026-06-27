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

        const message = formatMessage(req.body);

        console.log("========== MESSAGE ==========");
        console.log(message);
        console.log("=============================");

        await sendTelegramMessage(message);

        res.status(200).send("Webhook Received");

    } catch (err) {

        console.error("❌ WEBHOOK ERROR:");
        console.error(err);

        res.status(500).send(err.message);

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