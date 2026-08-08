const dhan = require("./dhanApi");
const buildSuperOrder = require("./buildSuperOrder");
const tradeService = require("../services/tradeService");

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