// =====================================
// QUANTITY CALCULATOR
// =====================================

function calculateQuantity(
    lotSize,
    selectedLots
) {

    const baseLotSize = Number(lotSize);
    const lots = Number(selectedLots);

    // =====================================
    // VALIDATION
    // =====================================

    if (
        !Number.isInteger(baseLotSize) ||
        baseLotSize <= 0
    ) {

        throw new Error(
            "Invalid instrument lot size"
        );

    }

    if (
        !Number.isInteger(lots) ||
        lots < 1 ||
        lots > 30
    ) {

        throw new Error(
            "Lots must be between 1 and 30"
        );

    }

    // =====================================
    // FINAL QUANTITY
    // =====================================

    const quantity =
        baseLotSize * lots;

    console.log("================================");
    console.log("📦 QUANTITY CALCULATED");
    console.log("LOT SIZE :", baseLotSize);
    console.log("LOTS     :", lots);
    console.log("QUANTITY :", quantity);
    console.log("================================");

    return quantity;
}


// =====================================
// EXPORT
// =====================================

module.exports = {
    calculateQuantity
};