const dhan = require("./dhanApi");
const buildOrder = require("./buildOrder");

async function placeOrder(orderData) {

    try {

        // ==========================
        // BUILD NORMAL BUY ORDER
        // ==========================

        const order = await buildOrder(orderData);

        console.log("📤 SENDING NORMAL BUY ORDER");

        console.log("================================");
        console.log("FINAL ORDER PAYLOAD");
        console.log(JSON.stringify(order, null, 2));
        console.log("================================");

        // ==========================
        // PLACE NORMAL ORDER
        // ==========================

        const response = await dhan.post(
            "/orders",
            order
        );

        console.log("================================");
        console.log("✅ NORMAL BUY ORDER PLACED");
        console.log("================================");

        console.log(
            JSON.stringify(
                response.data,
                null,
                2
            )
        );

        // ==========================
        // ORDER ID
        // ==========================

        const orderId =
            response.data?.orderId ||
            response.data?.data?.orderId ||
            null;

        if (!orderId) {

            throw new Error(
                "Broker Order ID not received"
            );

        }

        return {

            orderId,

            brokerResponse:
                response.data

        };

    } catch (err) {

        console.log("================================");
        console.log("❌ NORMAL BUY ORDER FAILED");
        console.log("================================");

        if (err.response) {

            console.log(
                "STATUS :",
                err.response.status
            );

            console.log(
                "DHAN RESPONSE :"
            );

            console.log(
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

        throw err;

    }

}

module.exports = placeOrder;