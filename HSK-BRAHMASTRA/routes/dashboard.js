const express = require("express");

console.log("✅ dashboardRoutes Loaded");

const router = express.Router();

const dashboardService = require("../services/dashboardService");

// ==========================
// TODAY REPORT
// ==========================

router.get("/hello", (req, res) => {
    res.send("Dashboard Route Working");
});

router.get("/report/today", async (req, res) => {

    try {

        const report = await dashboardService.getTodayReport();

        res.json(report);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load today's report"
        });

    }

});

module.exports = router;