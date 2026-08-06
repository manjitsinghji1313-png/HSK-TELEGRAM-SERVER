function extractStrikeFromSymbol(symbol) {

    if (!symbol) return null;

    // ==========================
    // MCX OPTIONS
    // CRUDEOILM260817C7200
    // CRUDEOIL260817P7100
    // NATURALGAS260817C210
    // ==========================

    if (
        symbol.startsWith("CRUDE") ||
        symbol.startsWith("NATURALGAS")
    ) {

        const match = symbol.match(/[CP](\d+)$/);

        return match ? Number(match[1]) : null;

    }

    // ==========================
    // NSE / BSE OPTIONS
    // NIFTY11AUG24550CE
    // BANKNIFTY11AUG56000PE
    // SENSEX11AUG84000CE
    // ==========================

    const match = symbol.match(/(\d+)(CE|PE)$/);

    return match ? Number(match[1]) : null;

}

module.exports = {
    extractStrikeFromSymbol
};