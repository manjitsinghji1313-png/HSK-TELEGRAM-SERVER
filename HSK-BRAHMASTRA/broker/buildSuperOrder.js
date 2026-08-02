const { findInstrument } = require("../optionchain/instrumentFinder");
const config = require("./config");

async function buildSuperOrder({
    tradeKey,
    transactionType = "BUY",
    productType = "INTRADAY",
    orderType = "LIMIT",
    symbol,
    strike,
    optionType,
    price,
    sl,
    tg1,
    lots = 1
}) {

    const option = await findInstrument(
        symbol,
        strike,
        optionType
    );

    console.log("================================");
    console.log("SUPER ORDER OPTION");
    console.log(option);
    console.log("================================");

    if (!option) {
        throw new Error("Instrument Not Found");
    }

    return {

        dhanClientId: config.CLIENT_ID,

        correlationId: tradeKey,

        transactionType,

        exchangeSegment: option.exchange,

        productType,

        orderType,

        securityId: option.securityId,

        quantity: option.lotSize * lots,

        price: Number(price),

        targetPrice: Number(tg1),

        stopLossPrice: Number(sl),

        trailingJump: 0

    };

}

module.exports = buildSuperOrder;