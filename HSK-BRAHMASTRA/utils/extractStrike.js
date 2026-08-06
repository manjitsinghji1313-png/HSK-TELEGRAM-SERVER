function extractStrikeFromSymbol(symbol) {

    if (!symbol) return null;

    // ==========================
    // CRUDEOIL / CRUDEOILM
    // Example:
    // CRUDEOILM260817C7200
    // CRUDEOIL260810P6000
    // ==========================

    if (
        symbol.startsWith("CRUDEOILM") ||
        symbol.startsWith("CRUDEOIL")
    ) {

        const match = symbol.match(/[CP](\d+)$/);

        return match ? Number(match[1]) : null;

    }

    // ==========================
    // NATURAL GAS
    // Example:
    // NATURALGAS260817C210
    // ==========================

    if (symbol.startsWith("NATURALGAS")) {

        const match = symbol.match(/[CP](\d+)$/);

        return match ? Number(match[1]) : null;

    }

    // ==========================
    // NIFTY
    // Example:
    // NIFTY26081325000CE
    // ==========================

    if (symbol.startsWith("NIFTY")) {

        const match = symbol.match(/^NIFTY\d{6}(\d+)(CE|PE)$/);

        return match ? Number(match[1]) : null;

    }

    // ==========================
    // BANKNIFTY
    // Example:
    // BANKNIFTY26081356000CE
    // ==========================

    if (symbol.startsWith("BANKNIFTY")) {

        const match = symbol.match(/^BANKNIFTY\d{6}(\d+)(CE|PE)$/);

        return match ? Number(match[1]) : null;

    }

    // ==========================
    // SENSEX
    // Example:
    // SENSEX26081384000CE
    // ==========================

    if (symbol.startsWith("SENSEX")) {

        const match = symbol.match(/^SENSEX\d{6}(\d+)(CE|PE)$/);

        return match ? Number(match[1]) : null;

    }

    return null;

}

// ==========================
// MARKET NAME
// ==========================

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