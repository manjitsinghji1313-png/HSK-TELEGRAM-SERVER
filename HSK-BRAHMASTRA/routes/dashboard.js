const express = require("express");

console.log("✅ dashboardRoutes Loaded");

const router = express.Router();

const dashboardService = require("../services/dashboardService");
const systemService = require("../services/systemService");
const supabase = require("../config/supabase");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// TEST
// ==========================

router.get("/hello", (req, res) => {
    res.send("Dashboard Route Working");
});

// ==========================
// DASHBOARD STATS
// ==========================

router.get("/stats", async (req, res) => {

    try {

        const stats = await dashboardService.getDashboardStats();

        res.json(stats);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ==========================
// TODAY REPORT
// ==========================

router.get("/report/today", async (req, res) => {

    try {

        const report = await dashboardService.getTodayReport();

        res.json(report);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ==========================
// GET SETTINGS
// ==========================

router.get("/settings", async (req, res) => {

    try {

        const settings = await systemService.getSettings();

        res.json({
            success: true,
            settings
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ==========================
// SAVE SETTINGS
// ==========================

router.post("/settings", async (req, res) => {

    try {

        const {
            auto_trading,
            paper_mode,
            lots
        } = req.body;

        const { error } = await supabase
            .from("system_settings")
            .update({
                auto_trading,
                paper_mode,
                lots,
                updated_at: new Date().toISOString()
            })
            .eq("id", 1);

        if (error) throw error;

        res.json({
            success: true,
            message: "Settings Updated"
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