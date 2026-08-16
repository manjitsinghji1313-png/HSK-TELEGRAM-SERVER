const dhan = require("./dhanApi");
const config = require("../config/config");

// =====================================
// MARKET BUY ORDER
// =====================================

async function marketBuyOrder({

    securityId,
    exchange,
    quantity,
    correlationId

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

    if (
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0
    ) {
        throw new Error("Invalid quantity");
    }

    // =====================================
    // MARKET ORDER PAYLOAD
    // =====================================

    const orderPayload = {

        dhanClientId:
            config.CLIENT_ID,

        transactionType:
            "BUY",

        exchangeSegment:
            exchange,

        productType:
            "INTRADAY",

        orderType:
            "MARKET",

        validity:
            "DAY",

        securityId:
            String(securityId),

        quantity:
            Number(quantity),

        disclosedQuantity:
            "",

        price:
            "",

        triggerPrice:
            "",

        afterMarketOrder:
            false,

        correlationId:
            correlationId ||
            `MARKET_${Date.now()}`

    };

    // =====================================
    // SHOW PAYLOAD
    // =====================================

    console.log("================================");
    console.log("🚀 MARKET BUY ORDER");
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
    // PLACE DHAN MARKET ORDER
    // =====================================

    const response =
        await dhan.post(
            "/orders",
            orderPayload
        );

    // =====================================
    // RESPONSE
    // =====================================

    console.log("================================");
    console.log("✅ DHAN MARKET BUY RESPONSE");
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
    marketBuyOrder
};