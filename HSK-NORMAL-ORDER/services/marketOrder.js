const { findInstrument } = require("../utils/instrumentFinder");
const { marketBuyOrder } = require("../broker/marketBuyOrder");

// =====================================
// MANUAL MARKET BUY
// =====================================

async function manualMarketBuy({

    symbol,
    strike,
    optionType,
    lots,
    expiry = null

}) {

    console.log("================================");
    console.log("🟢 MANUAL MARKET BUY");
    console.log("================================");

    // =====================================
    // VALIDATION
    // =====================================

    if (!symbol) {
        throw new Error("Symbol is required");
    }

    if (!strike) {
        throw new Error("Strike is required");
    }

    if (!["CE", "PE"].includes(
        String(optionType).toUpperCase()
    )) {
        throw new Error(
            "Option type must be CE or PE"
        );
    }

    if (
        !Number.isFinite(Number(lots)) ||
        Number(lots) <= 0
    ) {
        throw new Error(
            "Valid lots required"
        );
    }

    // =====================================
    // FIND INSTRUMENT
    // =====================================

    const instrument =
        await findInstrument(
            String(symbol).toUpperCase(),
            Number(strike),
            String(optionType).toUpperCase(),
            expiry
        );

    if (!instrument) {
        throw new Error(
            "Exact option contract not found"
        );
    }

    // =====================================
    // QUANTITY
    // =====================================

    const quantity =
        Number(lots) *
        Number(instrument.lotSize);

    // =====================================
    // SHOW ORDER
    // =====================================

    console.log("================================");
    console.log("📦 MANUAL MARKET BUY ORDER");
    console.log("================================");

    console.log(
        "Trading Symbol :",
        instrument.tradingSymbol
    );

    console.log(
        "Security ID    :",
        instrument.securityId
    );

    console.log(
        "Exchange       :",
        instrument.exchange
    );

    console.log(
        "Lot Size       :",
        instrument.lotSize
    );

    console.log(
        "Lots           :",
        Number(lots)
    );

    console.log(
        "Quantity       :",
        quantity
    );

    console.log(
        "Order Type     : MARKET"
    );

    console.log(
        "Product Type   : INTRADAY"
    );

    console.log("================================");

    // =====================================
    // MARKET BUY
    // =====================================

    const result =
        await marketBuyOrder({

            securityId:
                instrument.securityId,

            exchange:
                instrument.exchange,

            quantity:
                quantity,

            correlationId:
                `MARKET_${Date.now()}`

        });

    // =====================================
    // RESULT
    // =====================================

    console.log("================================");
    console.log("✅ MANUAL MARKET ORDER SUCCESS");

    console.log(
        "ORDER ID :",
        result?.orderId || "-"
    );

    console.log(
        "STATUS   :",
        result?.orderStatus || "-"
    );

    console.log("================================");

    return {

        success: true,

        orderId:
            result?.orderId || null,

        orderStatus:
            result?.orderStatus || null,

        instrument,

        quantity,

        orderType:
            "MARKET",

        productType:
            "INTRADAY"

    };

}

// =====================================
// EXPORT
// =====================================

module.exports = {
    manualMarketBuy
};