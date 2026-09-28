const supabase = require("../config/supabase");

// ==========================
// GET MEMBER BY TELEGRAM ID
// ==========================

async function getMemberByTelegramId(telegramId) {

    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("telegram_id", String(telegramId))
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}


// ==========================
// SET MEMBER AUTO TRADING
// ==========================

async function setMemberAutoTrading(
    telegramId,
    status
) {

    const { data, error } = await supabase
        .from("members")
        .update({
            auto_trading: Boolean(status)
        })
        .eq("telegram_id", String(telegramId))
        .eq("status", "ACTIVE")
        .select("id, name, auto_trading, status")
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(
            "Active member not found"
        );
    }

    return data;
}


// ==========================
// GET MEMBER AUTO STATUS
// ==========================

async function getMemberAutoTrading(
    telegramId
) {

    const member =
        await getMemberByTelegramId(
            telegramId
        );

    if (!member) {
        throw new Error(
            "Member not found"
        );
    }

    return Boolean(
        member.auto_trading
    );
}


module.exports = {

    getMemberByTelegramId,

    setMemberAutoTrading,

    getMemberAutoTrading

};