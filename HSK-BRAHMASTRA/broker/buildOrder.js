const { findInstrument } = require("../optionchain/instrumentFinder");
const { extractMarket } = require("../utils/extractStrike");
const { getLotSize } = require("../utils/marketLots");
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

    // ==========================
    // GET MARKET
    // ==========================

    const market = extractMarket(symbol);

    console.log("================================");
    console.log("MARKET :", market);
    console.log("SYMBOL :", symbol);
    console.log("STRIKE :", strike);
    console.log("OPTION :", optionType);
    console.log("================================");

    // ==========================
    // FIND INSTRUMENT
    // ==========================

    const option = await findInstrument(

        market,

        Number(strike),

        optionType

    );

    if (!option) {

        throw new Error("Instrument Not Found");

    }

    console.log("================================");
    console.log("OPTION FOUND");
    console.log("SECOND LOOKUP");
    console.log(option);
    
    console.log("================================");

    // ==========================
    // LOT SIZE
    // ==========================

    const exchangeLot = getLotSize(market);

    const quantity = exchangeLot * lots;

    console.log("================================");
    console.log("LOT DETAILS");
    console.log("Exchange Lot :", exchangeLot);
    console.log("User Lots    :", lots);
    console.log("Quantity     :", quantity);
    console.log("================================");

    // ==========================
    // BUILD ORDER
    // ==========================
    const order = {

        dhanClientId: config.CLIENT_ID,

        correlationId: "HSK_" + Date.now(),

        transactionType,

        exchangeSegment: option.exchange,

        productType,

        orderType,

        validity: "DAY",

        securityId: option.securityId,

        quantity,

        disclosedQuantity: 0,

        triggerPrice: 0,

        afterMarketOrder: false,

        amoTime: ""

};

if (orderType === "LIMIT") {

        order.price = Number(price);

}

    console.log("================================");
    console.log("FINAL ORDER OBJECT");
    console.log(JSON.stringify(order, null, 2));
    console.log("================================");

    console.log("ORDER KEYS");
    console.log(Object.keys(order));
    console.log("================================");

    return order;

}

module.exports = buildOrder;