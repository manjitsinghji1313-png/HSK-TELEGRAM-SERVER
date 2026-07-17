const express = require("express");

const router = express.Router();

const tradeService = require("../services/tradeService");

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

        switch (data.cmd) {

            // ==========================
            // ENTRY
            // ==========================

            case "CE_ENTRY":
            case "PE_ENTRY":

                await tradeService.openTrade(data);
                break;

            // ==========================
            // TARGET
            // ==========================

            case "TG1_HIT":

                await tradeService.closeTrade(data);
                break;

            // ==========================
            // STOP LOSS / EXIT
            // ==========================

            case "SL_HIT":
            case "EXIT":

                await tradeService.closeTrade(data);
                break;

            // ==========================
            // UNKNOWN
            // ==========================

            default:

                console.log("⚠ Unknown Command :", data.cmd);

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