const supabase = require("../config/supabase");

// ==========================
// GET AUTO TRADING STATUS
// ==========================

async function isAutoTradingEnabled() {

    const { data, error } = await supabase
        .from("system_settings")
        .select("auto_trading")
        .eq("id", 1)
        .single();

    if (error) {
        throw error;
    }

    return data.auto_trading;
}

// ==========================
// ENABLE / DISABLE
// ==========================

async function setAutoTrading(status) {

    const { error } = await supabase
        .from("system_settings")
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
// GET SETTINGS (TEMP TEST)
// ==========================

async function getSettings() {

    const { data, error } = await supabase
        .from("system_settings")
        .select("*");

    console.log("================================");
    console.log("ALL SETTINGS DATA:", data);
    console.log("ALL SETTINGS ERROR:", error);
    console.log("================================");

    if (error) {
        throw error;
    }

    return data[0];
}

module.exports = {

    isAutoTradingEnabled,

    setAutoTrading,

    getSettings

};