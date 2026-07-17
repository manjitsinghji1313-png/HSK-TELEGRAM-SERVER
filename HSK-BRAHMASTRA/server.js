require("dotenv").config();


const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const webhookRoutes = require("./routes/webhook");
const express = require("express");
const db = require("./database/db");

const http = require("http");
const path = require("path");
const cors = require("cors");

const supabase = require("./config/supabase");

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", dashboardRoutes);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/webhook", webhookRoutes);
// ==============================
// Health Check API
// ==============================

app.get("/api/health", (req, res) => {

    res.json({

        status: "ONLINE",
        project: "HSK BRAHMASTRA",
        version: "1.0.0"

    });

});

app.get("/api/test", (req, res) => {
    res.send("API Working");
});

const PORT = process.env.PORT || 3001;
// ==============================
// Start Server
// ==============================

server.listen(PORT, async () => {

    console.log("====================================");
    console.log("🚀 HSK BRAHMASTRA SERVER STARTED");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`❤️ Health : http://localhost:${PORT}/api/health`);

    try {

        const { error } = await supabase
            .from("members")
            .select("id")
            .limit(1);

        if (error) {

            console.log("❌ Supabase Error:", error.message);

        } else {

            console.log("✅ Supabase Connected Successfully");

        }

    } catch (err) {

        console.log("❌ Connection Failed:", err.message);

    }

    console.log("====================================");

});

// ==========================
// DASHBOARD STATS API
// ==========================

app.get("/api/stats", async (req, res) => {

    try {

        const stats = await db.getDashboardStats();

        res.json(stats);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load stats"
        });

    }

});


// ==========================
// ACTIVE TRADES API
// ==========================

app.get("/api/trades/active", async (req, res) => {

    try {

        const trades = await db.getActiveTrades();

        res.json(trades);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load active trades"
        });

    }

});

app.get("/api/report/today", async (req, res) => {

    try {

        const report = await db.getClosedTrades();

        res.json(report);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed"
        });

    }

});

// ==========================
// CLOSED TRADES API
// ==========================

app.get("/api/trades/closed", async (req, res) => {

    try {

        const trades = await db.getClosedTrades();

        res.json(trades);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load closed trades"
        });

    }

});