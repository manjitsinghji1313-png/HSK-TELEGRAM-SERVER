// =====================================
// MARKET WISE LOTS
// =====================================

const marketLots = {

    NIFTY: 1,

    BANKNIFTY: 1,

    SENSEX: 1,

    CRUDEOIL: 1,

    CRUDEOIL_MINI: 1,

    NATURALGAS: 1,

    NATURALGAS_MINI: 1

};


// =====================================
// GET MARKET LOTS
// =====================================

function getMarketLots(symbol) {

    const market =
        String(symbol)
            .toUpperCase()
            .trim();

    return marketLots[market] || 1;
}


// =====================================
// SET MARKET LOTS
// =====================================

function setMarketLots(symbol, lots) {

    const market =
        String(symbol)
            .toUpperCase()
            .trim();

    const value = Number(lots);

    if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 30
    ) {

        throw new Error(
            "Lots must be between 1 and 30"
        );

    }

    if (
        !Object.prototype.hasOwnProperty.call(
            marketLots,
            market
        )
    ) {

        throw new Error(
            "Invalid market"
        );

    }

    marketLots[market] = value;

    console.log("================================");
    console.log("✅ MARKET LOTS UPDATED");
    console.log("MARKET :", market);
    console.log("LOTS   :", value);
    console.log("================================");

    return value;
}


// =====================================
// GET ALL MARKET LOTS
// =====================================

function getAllMarketLots() {

    return {
        ...marketLots
    };

}


// =====================================
// EXPORT
// =====================================

module.exports = {

    getMarketLots,

    setMarketLots,

    getAllMarketLots

};