const supabase = require("../config/supabase");

// ==========================
// OPEN TRADE
// ==========================

async function openTrade(data) {

    try {

        // ==========================
        // Duplicate Check
        // ==========================

        const { data: existingTrade, error: checkError } = await supabase
            .from("trades")
            .select("id")
            .eq("trade_key", data.tradeKey)
            .maybeSingle();

        if (checkError) {
            console.error("❌ Duplicate Check Error:", checkError);
            throw checkError;
        }

        if (existingTrade) {
            console.log("⚠ Trade Already Exists:", data.tradeKey);
            return;
        }

        // ==========================
        // Save Trade
        // ==========================

        const { error } = await supabase
            .from("trades")
            .insert([{
                trade_key: data.tradeKey,
                trade_id: data.tradeKey,
                market: data.symbol,
                symbol: data.symbol,
                timeframe: data.timeframe,
                strike: data.strike,
                side: data.cmd,
                entry: Number(data.price),
                sl: Number(data.sl),
                tg1: Number(data.tg1),
                points: 0,
                status: "ACTIVE",
                open_time: new Date().toISOString()
            }]);

        if (error) {
            console.error("❌ Open Trade Error:", error);
            throw error;
        }

        console.log("✅ Trade Saved:", data.tradeKey);

    } catch (err) {

        console.error("❌ openTrade():", err);

    }

}

// ==========================
// CLOSE TRADE
// ==========================

async function closeTrade(data) {

    try {

                              let finalStatus = data.status || data.cmd;

// Convert webhook commands to readable status
if (finalStatus === "TG1_HIT") {
    finalStatus = "TARGET HIT";
}

if (finalStatus === "SL_HIT") {
    finalStatus = "STOP LOSS";
}

const updateData = {
    status: finalStatus,
    close_time: new Date().toISOString()
};

        // Update points if received
        if (data.points !== undefined) {
            updateData.points = Number(data.points);
        }

        const { error } = await supabase
            .from("trades")
            .update(updateData)
            .eq("trade_key", data.tradeKey);

        if (error) {
            console.error("❌ Close Trade Error:", error);
            throw error;
        }

        console.log("✅ Trade Closed:", data.tradeKey);

    } catch (err) {

        console.error("❌ closeTrade():", err);

    }

}

module.exports = {
    openTrade,
    closeTrade
};