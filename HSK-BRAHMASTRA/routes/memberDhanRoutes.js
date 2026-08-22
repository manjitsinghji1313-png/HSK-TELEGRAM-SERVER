const express = require("express");

const router = express.Router();

const memberDhanService =
    require("../services/memberDhanService");

const memberSuperOrder =
    require("../services/memberSuperOrder");
// ==========================================
// MEMBER DHAN CONNECTION PAGE
// ==========================================

router.get("/connect/:telegramId", async (req, res) => {

    try {

        const telegramId =
            String(req.params.telegramId);

        const member =
            await memberDhanService
                .getMemberDhan(telegramId);

        if (!member) {

            return res
                .status(404)
                .send("Member not found");

        }

        if (member.status !== "ACTIVE") {

            return res
                .status(403)
                .send("Member is not ACTIVE");

        }

        res.sendFile(
            "member-dhan-connect.html",
            {
                root: "./public"
            }
        );

    } catch (err) {

        console.error(
            "❌ MEMBER DHAN PAGE ERROR:",
            err
        );

        res
            .status(500)
            .send("Server error");

    }

});


// ==========================================
// GET MEMBER DHAN INFO
// ==========================================

router.get("/info/:telegramId", async (req, res) => {

    try {

        const telegramId =
            String(req.params.telegramId);

        const member =
            await memberDhanService
                .getMemberDhan(telegramId);

        if (!member) {

            return res
                .status(404)
                .json({
                    success: false,
                    message: "Member not found"
                });

        }

        if (member.status !== "ACTIVE") {

            return res
                .status(403)
                .json({
                    success: false,
                    message: "Member is not ACTIVE"
                });

        }

        return res.json({

            success: true,

            member: {

                name:
                    member.name,

                dhanClientId:
                    member.dhan_client_id || null,

                dhanConnected:
                    member.dhan_connected || false

            }

        });

    } catch (err) {

        console.error(
            "❌ MEMBER DHAN INFO ERROR:",
            err
        );

        return res
            .status(500)
            .json({
                success: false,
                message: "Server error"
            });

    }

});


// ==========================================
// SAVE MEMBER DHAN CONNECTION
// ==========================================

router.post("/connect/:telegramId", async (req, res) => {

    try {

        const telegramId =
            String(req.params.telegramId);


        // ======================================
        // DEBUG: CHECK COMPLETE REQUEST BODY
        // ======================================

        console.log(
            "📥 DHAN REQUEST BODY:",
            req.body
        );


        const {
            dhanClientId,
            dhanAccessToken
        } = req.body;


        // ======================================
        // DEBUG: CHECK RECEIVED VALUES
        // ======================================

        console.log(
            "👤 DHAN CLIENT ID RECEIVED:",
            dhanClientId
        );

        console.log(
            "🔑 DHAN TOKEN RECEIVED:",
            !!dhanAccessToken
        );


        if (
            !dhanClientId ||
            !dhanAccessToken
        ) {

            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Dhan Client ID and Access Token are required"
                });

        }


        // ======================================
        // SAVE DHAN DETAILS
        // ======================================

        const member =
            await memberDhanService
                .saveMemberDhan(
                    telegramId,
                    dhanClientId,
                    dhanAccessToken
                );


        // ======================================
        // DEBUG: CHECK SAVED DATA
        // ======================================

        console.log(
            "✅ SAVED MEMBER DHAN DATA:",
            member
        );


        return res.json({

            success: true,

            message:
                "Dhan account connected successfully",

            member: {

                name:
                    member.name,

                clientId:
                    member.dhan_client_id

            }

        });

    } catch (err) {

        console.error(
            "❌ SAVE MEMBER DHAN ERROR:",
            err
        );

        return res
            .status(500)
            .json({
                success: false,
                message:
                    err.message
            });

    }

});
// ==========================================
// TEST MEMBER DHAN CREDENTIALS
// ==========================================

router.get(
    "/test-credentials/:telegramId",

    async (req, res) => {

        try {

            const telegramId =
                String(
                    req.params.telegramId
                );


            const member =
                await memberDhanService
                    .getMemberDhanCredentials(
                        telegramId
                    );


            console.log(
                `✅ MEMBER DHAN TEST: ${member.name}`
            );


            return res.json({

                success: true,

                message:
                    "Member Dhan credentials verified successfully",

                member: {

                    id:
                        member.id,

                    name:
                        member.name,

                    telegramId:
                        member.telegram_id,

                    dhanClientId:
                        member.dhan_client_id,

                    dhanConnected:
                        member.dhan_connected

                }

            });

        } catch (err) {

            console.error(
                "❌ MEMBER DHAN TEST ERROR:",
                err.message
            );


            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        err.message

                });

        }

    }

);

module.exports = router;