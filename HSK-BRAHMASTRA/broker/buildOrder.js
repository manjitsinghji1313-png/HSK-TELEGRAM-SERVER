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

    if (!option) {
        throw new Error("Instrument Not Found");
    }

    return {

        dhanClientId: config.CLIENT_ID,

        transactionType,

        exchangeSegment: option.exchange,

        productType,

        orderType,

        validity: "DAY",

        securityId: option.securityId,

        quantity: option.lotSize * lots,

        price: Number(price),

        triggerPrice: 0,

        afterMarketOrder: false,

        amoTime: "",

        disclosedQuantity: 0

    };

}

module.exports = buildOrder;