const { executeBuyOrder } = require("./broker/buyOrder");
const { findInstrument } = require("./optionchain/instrumentFinder");

// =====================================
// MANUAL NORMAL LIMIT BUY
// =====================================

async function manualNormalBuy({
    symbol,
    strike,
    optionType,
    lots,
    price,
    expiry = null
}) {

    console.log("================================");
    console.log("🟢 MANUAL NORMAL LIMIT BUY");
    console.log("================================");

    // =================================
    // VALIDATION
    // =================================

    if (!symbol) {
        throw new Error("Symbol is required");
    }

    if (!strike) {
        throw new Error("Strike is required");
    }

    if (!optionType) {
        throw new Error("Option type is required");
    }

    if (!lots || Number(lots) <= 0) {
        throw new Error("Valid lots required");
    }

    if (!price || Number(price) <= 0) {
        throw new Error("Valid LIMIT price required");
    }

    // =================================
    // FIND INSTRUMENT
    // =================================

    const instrument = await findInstrument(
        symbol.toUpperCase(),
        Number(strike),
        optionType.toUpperCase(),
        expiry
    );

    if (!instrument) {
        throw new Error(
            "Exact option contract not found"
        );
    }

    console.log("================================");
    console.log("✅ INSTRUMENT FOUND");
    console.log("Security ID :", instrument.securityId);
    console.log("Symbol      :", instrument.tradingSymbol);
    console.log("Lot Size    :", instrument.lotSize);
    console.log("Exchange    :", instrument.exchange);
    console.log("================================");

    // =================================
    // QUANTITY
    // =================================

    const quantity =
        Number(lots) * Number(instrument.lotSize);

    // =================================
    // NORMAL LIMIT ORDER DATA
    // =================================

    const orderData = {

        securityId:
            instrument.securityId,

        exchange:
            instrument.exchange,

        quantity,

        price:
            Number(price),

        orderType:
            "LIMIT",

        productType:
            "INTRADAY"

    };

    console.log("================================");
    console.log("📦 FINAL MANUAL ORDER");
    console.log("================================");

    console.log(
        JSON.stringify(
            orderData,
            null,
            2
        )
    );

    // =================================
    // PLACE NORMAL BUY
    // =================================

    const result =
    await executeBuyOrder(
        orderData,
        {
            dryRun: false
        }
    );
    console.log("================================");
    console.log("✅ MANUAL NORMAL ORDER SUCCESS");
    console.log("ORDER ID :", result.orderId);
    console.log("================================");

    return {

        success: true,

        orderId:
            result.orderId,

        instrument,

        quantity,

        price:
            Number(price),

        orderType:
            "LIMIT"

    };
}

module.exports = {
    manualNormalBuy
};