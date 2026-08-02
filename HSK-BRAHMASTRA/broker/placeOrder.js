const dhan = require("./dhanApi");
const buildOrder = require("./buildOrder");
const tradeService = require("../services/tradeService");

async function placeOrder(orderData) {

    try {

        // ==========================
        // Build Order
        // ==========================

        const order = await buildOrder(orderData);

        console.log("📤 Sending Order...");
        console.log(order);

        // ==========================
        // Place Order
        // ==========================

        const response = await dhan.post("/orders", order);

        console.log("✅ ORDER PLACED");
        console.log(response.data);

        // ==========================
        // Save Broker Order
        // ==========================

        const orderId =
    response.data.orderId ||
    response.data.data?.orderId ||
    null;

if (!orderId) {
    throw new Error("Broker Order ID not received");
}

await tradeService.saveBrokerOrder({

    tradeKey: orderData.tradeKey,

    orderId: orderId,

    securityId: order.securityId,

    exchangeSegment: order.exchangeSegment,

    quantity: order.quantity,

    productType: order.productType,

    status: "OPEN"

});

        return {

    orderId,

    brokerResponse: response.data

};

    } catch (err) {

        console.log("❌ ORDER FAILED");

        if (err.response) {

            console.log(err.response.data);

        } else {

            console.log(err.message);

        }

        throw err;

    }

}

module.exports = placeOrder;