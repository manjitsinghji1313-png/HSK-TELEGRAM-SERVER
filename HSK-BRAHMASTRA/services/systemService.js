const supabase = require("../config/supabase");

// ==========================
// GET AUTO TRADING STATUS
// ==========================

async function isAutoTradingEnabled() {

    const { data, error } = await supabase
        .from("settings")
        .select("auto_trading")
        .eq("id", 1)
        .single();

    if (error) {
        throw error;
    }

    return data.auto_trading;
}


// ==========================
// ENABLE / DISABLE AUTO TRADING
// ==========================

async function setAutoTrading(status) {

    const { error } = await supabase
        .from("settings")
        .update({
            auto_trading: status,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) {
        throw error;
    }

    return true;
}


// ==========================
// ENABLE / DISABLE PAPER MODE
// ==========================

async function setPaperMode(status) {

    const { error } = await supabase
        .from("settings")
        .update({
            paper_mode: status,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) {
        throw error;
    }

    return true;
}


// ==========================
// GET SETTINGS
// ==========================

async function getSettings() {

    const { data, error } = await supabase
        .from("settings")
        .select("*");

    console.log("================================");
    console.log("ALL SETTINGS:", data);
    console.log("ERROR:", error);
    console.log("================================");

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("No settings found");
    }

    return data[0];
}


module.exports = {

    isAutoTradingEnabled,
    setAutoTrading,
    setPaperMode,
    getSettings

};