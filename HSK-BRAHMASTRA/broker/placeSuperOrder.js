const dhan = require("./dhanApi");
const buildSuperOrder = require("./buildSuperOrder");
const tradeService = require("../services/tradeService");
const cancelSuperOrder = require("./cancelSuperOrder");
const getSuperOrderStatus = require("./getSuperOrderStatus");

async function placeSuperOrder(orderData) {

    try {

        // ==========================
        // BUILD SUPER ORDER
        // ==========================

        const order = await buildSuperOrder(orderData);

        console.log("================================");
        console.log("🚀 PLACE SUPER ORDER");
        console.log("================================");

        console.log("FINAL SUPER ORDER PAYLOAD");
        console.log(JSON.stringify(order, null, 2));

        // ==========================
        // DHAN REQUEST
        // ==========================

        console.log("================================");
        console.log("🚀 DHAN SUPER ORDER REQUEST");
        console.log("URL :", dhan.defaults.baseURL + "/super/orders");
        console.log("METHOD : POST");
        console.log("BODY :");
        console.log(JSON.stringify(order, null, 2));
        console.log("================================");

        const response = await dhan.post(
            "/super/orders",
            order
        );

        // ==========================
        // DHAN RESPONSE
        // ==========================

        console.log("================================");
        console.log("✅ DHAN SUPER ORDER RESPONSE");
        console.log("STATUS :", response.status);
        console.log(JSON.stringify(response.data, null, 2));
        console.log("================================");

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
                "Super Order ID not received from Dhan"
            );
        }

        console.log("================================");
        console.log("✅ SUPER ORDER PLACED");
        console.log("Order ID :", orderId);
        console.log("Status   :", orderStatus);
        console.log("================================");

        // ==========================
        // SAVE BROKER ORDER
        // ==========================

        await tradeService.saveBrokerOrder({

            tradeKey: orderData.tradeKey,

            orderId,

            securityId: order.securityId,

            exchangeSegment: order.exchangeSegment,

            quantity: order.quantity,

            productType: order.productType,

            status: orderStatus || "OPEN"

        });

        console.log("✅ Super Order Saved");
// ==========================
// 3 MINUTE PENDING CHECK - LIMIT ONLY
// ==========================

if (order.orderType === "LIMIT") {

    setTimeout(async () => {

        try {

            console.log("================================");
            console.log("⏱️ 3 MINUTES COMPLETED");
            console.log("Order ID :", orderId);
            console.log("Order Type :", order.orderType);
            console.log("================================");

            // ==========================
            // CHECK LATEST STATUS
            // ==========================

            const latestOrder =
                await getSuperOrderStatus(orderId);

            if (!latestOrder) {

                console.log("⚠️ SUPER ORDER NOT FOUND");

                return;
            }

            const status =
                latestOrder.orderStatus;

            console.log(
                "📊 CURRENT ORDER STATUS :",
                status
            );

            // ==========================
            // CANCEL ONLY IF PENDING
            // ==========================

            if (status === "PENDING") {

                console.log("❌ ORDER STILL PENDING");
                console.log("🚫 CANCELLING SUPER ORDER");

                await cancelSuperOrder(orderId);

                console.log(
                    "✅ PENDING SUPER ORDER CANCELLED"
                );

            } else {

                console.log(
                    "✅ ORDER NOT PENDING - NO CANCEL"
                );

            }

        } catch (err) {

            console.log("================================");
            console.log("❌ 3 MINUTE CHECK FAILED");
            console.log("================================");

            if (err.response) {

                console.log(
                    "STATUS :",
                    err.response.status
                );

                console.log(
                    "DHAN RESPONSE :",
                    JSON.stringify(
                        err.response.data,
                        null,
                        2
                    )
                );

            } else {

                console.log(
                    "ERROR :",
                    err.message
                );

            }

            console.log("================================");

        }

    }, 3 * 60 * 1000);

}


// ==========================
// RETURN RESULT
// ==========================

return {

    orderId,

    orderStatus,

    brokerResponse: response.data

};

    } catch (err) {

        console.log("================================");
        console.log("❌ DHAN SUPER ORDER FAILED");
        console.log("================================");

        if (err.response) {

            console.log("STATUS :", err.response.status);

            console.log("DHAN RESPONSE :");

            console.log(
                JSON.stringify(
                    err.response.data,
                    null,
                    2
                )
            );

            console.log("================================");

        } else {

            console.log(
                "ERROR :",
                err.message
            );

        }

        throw err;

    }

}

module.exports = placeSuperOrder;