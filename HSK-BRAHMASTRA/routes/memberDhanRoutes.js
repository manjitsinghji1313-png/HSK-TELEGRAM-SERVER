const express = require("express");

const router = express.Router();

const memberDhanService =
    require("../services/memberDhanService");


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
// SAVE MEMBER DHAN CONNECTION
// ==========================================

router.post("/connect/:telegramId", async (req, res) => {

    try {

        const telegramId =
            String(req.params.telegramId);

        const {
            dhanClientId,
            dhanAccessToken
        } = req.body;

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

        const member =
            await memberDhanService
                .saveMemberDhan(
                    telegramId,
                    dhanClientId,
                    dhanAccessToken
                );

        return res.json({
            success: true,
            message:
                "Dhan account connected successfully",
            member: {
                name: member.name,
                clientId: member.dhan_client_id
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
module.exports = router;