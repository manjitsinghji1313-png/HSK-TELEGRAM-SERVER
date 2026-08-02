const { findInstrument } = require("../optionchain/instrumentFinder");
const config = require("./config");

async function buildOrder({
    transactionType = "BUY",
    productType = "INTRADAY",
    orderType = "LIMIT",
    symbol,
    strike,
    optionType,
    price,
    lots = 1
}) {

    const option = await findInstrument(
        symbol,
        strike,
        optionType
    );

    console.log("================================");
    console.log("OPTION FOUND");
    console.log(option);
    console.log("================================");

    if (!option) {
        throw new Error("Instrument Not Found");
    }

    const order = {

        dhanClientId: config.CLIENT_ID,

        transactionType,

        exchangeSegment: option.exchange,

        productType,

        orderType,

        validity: "DAY",

        securityId: option.securityId,

        quantity: option.lotSize * lots

    };

    // LIMIT order me hi price bhejna
    if (orderType === "LIMIT") {
        order.price = Number(price);
    }

    console.log("================================");
    console.log("FINAL ORDER OBJECT");
    console.log(JSON.stringify(order, null, 2));
    console.log("================================");

    return order;

}

module.exports = buildOrder;