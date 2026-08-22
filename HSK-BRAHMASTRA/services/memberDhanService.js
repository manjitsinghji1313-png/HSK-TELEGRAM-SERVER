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
// CHECK VALID DHAN CLIENT ID
// ==========================================

function hasValidClientId(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return false;

    }


    const clientId =
        String(value)
            .trim();


    if (
        !clientId ||
        clientId.toLowerCase() === "null" ||
        clientId.toLowerCase() === "undefined"
    ) {

        return false;

    }


    return true;

}


// ==========================================
// SAVE / UPDATE MEMBER DHAN
// ==========================================

async function saveMemberDhan(
    telegramId,
    dhanClientId,
    dhanAccessToken,
    tokenExpiry = null
) {

    // ======================================
    // GET EXISTING MEMBER
    // ======================================

    const existingMember =
        await getMemberDhan(telegramId);


    if (!existingMember) {

        throw new Error(
            "Member not found"
        );

    }


    if (existingMember.status !== "ACTIVE") {

        throw new Error(
            "Member is not ACTIVE"
        );

    }


    // ======================================
    // BUILD UPDATE DATA
    // ======================================

    const updateData = {

        dhan_access_token:
            String(dhanAccessToken)
                .trim(),

        dhan_token_expiry:
            tokenExpiry,

        dhan_connected:
            true

    };


    // ======================================
    // CHECK EXISTING CLIENT ID
    // ======================================

    const clientIdExists =
        hasValidClientId(
            existingMember.dhan_client_id
        );


    // ======================================
    // SAVE CLIENT ID IF NOT ALREADY VALID
    // ======================================

    if (!clientIdExists) {

        if (
            !hasValidClientId(
                dhanClientId
            )
        ) {

            throw new Error(
                "Dhan Client ID is required"
            );

        }


        updateData.dhan_client_id =
            String(dhanClientId)
                .trim();

    }


    // ======================================
    // DEBUG
    // ======================================

    console.log(
        "💾 EXISTING CLIENT ID:",
        existingMember.dhan_client_id
    );


    console.log(
        "💾 CLIENT ID EXISTS:",
        clientIdExists
    );


    console.log(
        "💾 NEW CLIENT ID:",
        dhanClientId
    );


    console.log(
        "📤 UPDATE DATA:",
        {
            dhan_client_id:
                updateData.dhan_client_id,

            dhan_connected:
                updateData.dhan_connected
        }
    );


    // ======================================
    // UPDATE MEMBER
    // ======================================

    const { data, error } = await supabase
        .from("members")
        .update(updateData)
        .eq("telegram_id", String(telegramId))
        .eq("status", "ACTIVE")
        .select(`
            id,
            name,
            telegram_id,
            dhan_client_id,
            dhan_connected
        `)
        .maybeSingle();


    if (error) {

        console.error(
            "❌ SUPABASE DHAN UPDATE ERROR:",
            error
        );

        throw error;

    }


    if (!data) {

        throw new Error(
            "Active member not found"
        );

    }


    console.log(
        "✅ SAVED MEMBER DHAN DATA:",
        data
    );


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