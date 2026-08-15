const dhan = require("./dhanApi");

// =====================================
// BUY NORMAL ORDER
// =====================================

async function placeBuyOrder({
    securityId,
    exchange,
    quantity,
    price,
    correlationId,
    dryRun = true
}) {

    // =====================================
    // VALIDATION
    // =====================================

    if (!securityId) {
        throw new Error("Security ID is required");
    }

    if (!exchange) {
        throw new Error("Exchange segment is required");
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        throw new Error("Invalid quantity");
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
        throw new Error("Invalid BUY price");
    }


    // =====================================
    // ORDER PAYLOAD
    // =====================================

    const orderPayload = {

        transactionType: "BUY",

        exchangeSegment: exchange,

        productType: "INTRADAY",

        orderType: "LIMIT",

        validity: "DAY",

        securityId: String(securityId),

        quantity: Number(quantity),

        price: Number(price),

        disclosedQuantity: 0,

        triggerPrice: 0,

        afterMarketOrder: false

    };


    // =====================================
    // CORRELATION ID
    // =====================================

    orderPayload.correlationId =
        correlationId ||
        `HSKN_${Date.now()}`;


    // =====================================
    // SHOW PAYLOAD
    // =====================================

    console.log("================================");
    console.log("🛒 BUY ORDER PAYLOAD");
    console.log("================================");

    console.log(
        JSON.stringify(
            orderPayload,
            null,
            2
        )
    );

    console.log("================================");


    // =====================================
    // DRY RUN
    // =====================================

    if (dryRun) {

        console.log("================================");
        console.log("🧪 DRY RUN - NO DHAN ORDER");
        console.log("================================");

        return {

            dryRun: true,

            order: orderPayload

        };

    }


    // =====================================
    // ACTUAL DHAN BUY ORDER
    // =====================================

    console.log("================================");
    console.log("🚀 PLACING DHAN BUY ORDER");
    console.log("================================");


    const response =
        await dhan.post(
            "/orders",
            orderPayload
        );


    console.log("================================");
    console.log("✅ DHAN BUY ORDER RESPONSE");
    console.log("================================");

    console.log(
        JSON.stringify(
            response.data,
            null,
            2
        )
    );

    console.log("================================");


    return response.data;

}


// =====================================
// EXPORT
// =====================================

module.exports = {
    placeBuyOrder
};
