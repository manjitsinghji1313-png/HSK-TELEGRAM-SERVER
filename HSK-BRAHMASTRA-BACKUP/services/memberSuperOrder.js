const axios = require("axios");

const buildSuperOrder =
    require("../broker/buildSuperOrder");

const memberDhanService =
    require("./memberDhanService");


// ==========================================
// MEMBER SUPER ORDER
// ==========================================

async function placeMemberSuperOrder(
    telegramId,
    orderData
) {

    try {

        // ==================================
        // GET MEMBER DHAN CREDENTIALS
        // ==================================

        const member =
            await memberDhanService
                .getMemberDhanCredentials(
                    telegramId
                );


        // ==================================
        // MEMBER DHAN API INSTANCE
        // ==================================

        const memberDhan =
            axios.create({

                baseURL:
                    "https://api.dhan.co/v2",

                headers: {

                    "Content-Type":
                        "application/json",

                    "access-token":
                        member.dhan_access_token,

                    "client-id":
                        member.dhan_client_id

                }

            });


        // ==================================
        // BUILD SUPER ORDER
        // ==================================

        const order =
            await buildSuperOrder(
                orderData
            );


        // ==================================
        // PLACE MEMBER SUPER ORDER
        // ==================================

        const response =
            await memberDhan.post(
                "/super/orders",
                order
            );


        // ==================================
        // GET ORDER DETAILS
        // ==================================

        const orderId =
            response.data?.orderId ||
            response.data?.data?.orderId ||
            null;


        const orderStatus =
            response.data?.orderStatus ||
            response.data?.data?.orderStatus ||
            null;


        if (!orderId) {

            throw new Error(
                "Member Super Order ID not received"
            );

        }


        console.log(
            `✅ MEMBER SUPER ORDER PLACED: ${member.name}`
        );


        console.log(
            "Order ID:",
            orderId
        );


        return {

            memberId:
                member.id,

            memberName:
                member.name,

            telegramId:
                member.telegram_id,

            orderId,

            orderStatus,

            brokerResponse:
                response.data

        };

    } catch (err) {

        console.error(
            "❌ MEMBER SUPER ORDER ERROR:",
            err.response?.data ||
            err.message
        );

        throw err;

    }

}


module.exports =
    placeMemberSuperOrder;