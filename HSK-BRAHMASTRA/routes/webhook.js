const express = require("express");

const router = express.Router();

// ==========================
// TradingView Webhook
// ==========================

router.post("/", async (req, res) => {

    try {

        console.log("=================================");
        console.log("📩 WEBHOOK RECEIVED");
        console.log(req.body);
        console.log("=================================");

        res.status(200).json({
            success: true,
            message: "Webhook Received"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;