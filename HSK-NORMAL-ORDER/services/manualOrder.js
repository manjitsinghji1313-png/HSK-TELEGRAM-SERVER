const { findInstrument } = require("../utils/instrumentFinder");
const { executeBuyOrder } = require("../broker/buyOrder");

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

    if (
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        throw new Error(
            "Valid LIMIT price required"
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
    // SHOW FINAL ORDER
    // =====================================

    console.log("================================");
    console.log("📦 MANUAL NORMAL LIMIT ORDER");
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
        "Price          :",
        Number(price)
    );

    console.log(
        "Order Type     : LIMIT"
    );

    console.log(
        "Product Type   : INTRADAY"
    );

    console.log("================================");

    // =====================================
    // NORMAL LIMIT BUY
    // DRY RUN = TRUE
    // =====================================

    const result =
        await executeBuyOrder({

            securityId:
                instrument.securityId,

            exchange:
                instrument.exchange,

            quantity:
                quantity,

            price:
                Number(price),

            correlationId:
                `MANUAL_${Date.now()}`,

        });

    // =====================================
    // RESULT
    // =====================================

    console.log("================================");

    if (result.dryRun) {

        console.log(
            "🧪 MANUAL NORMAL ORDER DRY RUN SUCCESS"
        );

        console.log(
            "❌ NO DHAN ORDER PLACED"
        );

    } else {

        console.log(
            "✅ MANUAL NORMAL ORDER SUCCESS"
        );

        console.log(
            "ORDER ID :",
            result.orderId
        );

    }

    console.log("================================");

    return {

        success: true,

        dryRun:
            result.dryRun || false,

        orderId:
            result.orderId || null,

        instrument,

        quantity,

        price:
            Number(price),

        orderType:
            "LIMIT",

        productType:
            "INTRADAY",

        order:
            result.order || null

    };

}

// =====================================
// EXPORT
// =====================================

module.exports = {
    manualNormalBuy
};