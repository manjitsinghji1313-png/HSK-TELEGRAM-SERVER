const config = require("../config/config");

async function buildOrder({

    productType = "INTRADAY",

    orderType = "LIMIT",

    securityId,

    exchange,

    quantity,

    price

}) {

    console.log("================================");
    console.log("BUILD NORMAL BUY ORDER");
    console.log("Security :", securityId);
    console.log("Exchange :", exchange);
    console.log("Quantity :", quantity);
    console.log("Price    :", price);
    console.log("================================");

    const order = {

        dhanClientId: config.CLIENT_ID,

        correlationId: "HSKN_" + Date.now(),

        transactionType: "BUY",

        exchangeSegment: exchange,

        productType,

        orderType,

        validity: "DAY",

        securityId: String(securityId),

        quantity: Number(quantity),

        price:
            orderType === "MARKET"
                ? 0
                : Number(price)

    };

    console.log("================================");
    console.log("FINAL NORMAL BUY ORDER");
    console.log(JSON.stringify(order, null, 2));
    console.log("================================");

    return order;

}

module.exports = buildOrder;