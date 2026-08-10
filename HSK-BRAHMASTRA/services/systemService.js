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
// ENABLE / DISABLE AUTO TRADING
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
// ENABLE / DISABLE PAPER MODE
// ==========================

async function setPaperMode(status) {

    const { error } = await supabase
        .from("system_settings")
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
// SET CE ENTRY BUFFER
// ==========================

async function setEntryBuffer(buffer) {

    const value = Number(buffer);

    if (![0, 1, 2].includes(value)) {
        throw new Error("Buffer must be 0, 1 or 2");
    }

    const { error } = await supabase
        .from("system_settings")
        .update({
            entry_buffer: value,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) {
        throw error;
    }

    return true;
}


// ==========================
// GET CE ENTRY BUFFER
// ==========================

async function getEntryBuffer() {

    const { data, error } = await supabase
        .from("system_settings")
        .select("entry_buffer")
        .eq("id", 1)
        .single();

    if (error) {
        throw error;
    }

    return Number(data.entry_buffer || 0);
}

// ==========================
// GET ORDER MODE
// ==========================

async function getOrderMode() {

    const { data, error } = await supabase
        .from("system_settings")
        .select("order_mode")
        .eq("id", 1)
        .single();

    if (error) {
        throw error;
    }

    return data.order_mode || "LIMIT";
}
// ==========================
// SET ORDER MODE
// ==========================

async function setOrderMode(mode) {

    const value = String(mode).toUpperCase();

    if (!["LIMIT", "MARKET"].includes(value)) {
        throw new Error(
            "Order mode must be LIMIT or MARKET"
        );
    }

    const { data, error } = await supabase
        .from("system_settings")
        .update({
            order_mode: value,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1)
        .select("id, order_mode, updated_at")
        .single();

    if (error) {
        console.error(
            "❌ SET ORDER MODE ERROR:",
            error
        );

        throw error;
    }

    if (!data) {
        throw new Error(
            "Settings row was not updated"
        );
    }

    console.log("================================");
    console.log("✅ ORDER MODE UPDATED");
    console.log("ID         :", data.id);
    console.log("ORDER MODE :", data.order_mode);
    console.log("UPDATED AT :", data.updated_at);
    console.log("================================");

    return data.order_mode;
}
// ==========================
// GET SETTINGS
// ==========================

async function getSettings() {

    const { data, error } = await supabase
        .from("system_settings")
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

    setEntryBuffer,
    getEntryBuffer,

    getOrderMode,
    setOrderMode,

    getSettings
};