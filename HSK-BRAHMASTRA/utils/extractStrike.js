function extractStrikeFromSymbol(symbol) {

    if (!symbol) return null;

    // MCX OPTIONS
    if (
        symbol.startsWith("CRUDE") ||
        symbol.startsWith("NATURALGAS")
    ) {

        const match = symbol.match(/[CP](\d+)$/);

        return match ? Number(match[1]) : null;
    }

    // NSE / BSE OPTIONS
    const match = symbol.match(/(\d+)(CE|PE)$/);

    return match ? Number(match[1]) : null;
}

function extractMarket(symbol) {

    if (!symbol) return null;

    if (symbol.startsWith("BANKNIFTY")) return "BANKNIFTY";
    if (symbol.startsWith("NIFTY")) return "NIFTY";
    if (symbol.startsWith("SENSEX")) return "SENSEX";
    if (symbol.startsWith("CRUDEOILM")) return "CRUDEOILM";
    if (symbol.startsWith("CRUDEOIL")) return "CRUDEOIL";
    if (symbol.startsWith("NATURALGAS")) return "NATURALGAS";

    return symbol;
}

module.exports = {
    extractStrikeFromSymbol,
    extractMarket
};