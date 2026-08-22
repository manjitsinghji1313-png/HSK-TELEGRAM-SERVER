const supabase = require("../config/supabase");


// ==========================================
// GET MEMBER DHAN DETAILS
// ==========================================

async function getMemberDhan(telegramId) {

    const { data, error } = await supabase
        .from("members")
        .select(`
            id,
            name,
            status,
            telegram_id,
            dhan_client_id,
            dhan_access_token,
            dhan_token_expiry,
            dhan_connected
        `)
        .eq("telegram_id", String(telegramId))
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;

}


// ==========================================
// SAVE MEMBER DHAN CONNECTION
// ==========================================

async function saveMemberDhan(
    telegramId,
    dhanClientId,
    dhanAccessToken,
    tokenExpiry = null
) {

    const { data, error } = await supabase
        .from("members")
        .update({

            dhan_client_id: String(dhanClientId),

            dhan_access_token: String(dhanAccessToken),

            dhan_token_expiry: tokenExpiry,

            dhan_connected: true

        })
        .eq("telegram_id", String(telegramId))
        .eq("status", "ACTIVE")
        .select(`
            id,
            name,
            dhan_client_id,
            dhan_connected
        `)
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


// ==========================================
// DISCONNECT MEMBER DHAN
// ==========================================

async function disconnectMemberDhan(
    telegramId
) {

    const { data, error } = await supabase
        .from("members")
        .update({

            dhan_client_id: null,

            dhan_access_token: null,

            dhan_token_expiry: null,

            dhan_connected: false

        })
        .eq("telegram_id", String(telegramId))
        .eq("status", "ACTIVE")
        .select(`
            id,
            name,
            dhan_connected
        `)
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


module.exports = {

    getMemberDhan,

    saveMemberDhan,

    disconnectMemberDhan

};