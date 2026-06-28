// ======================================
// HSK BRAHMASTRA TRADE MANAGER V1
// ======================================

const tradeData = {
    NIFTY: {
        active: {},
        closed: []
    },

    BANKNIFTY: {
        active: {},
        closed: []
    },

    CRUDEOIL: {
        active: {},
        closed: []
    },

    NATURALGAS: {
        active: {},
        closed: []
    },

    BTCUSD: {
        active: {},
        closed: []
    }
};

// ======================================
// TRADE COUNTERS
// ======================================

const tradeCounter = {
    NIFTY: 0,
    BANKNIFTY: 0,
    CRUDEOIL: 0,
    NATURALGAS: 0,
    BTCUSD: 0
};

// ======================================
// MARKET DETECTOR
// ======================================

function getMarket(symbol) {

    symbol = symbol.toUpperCase();

    if (symbol.includes("BANKNIFTY"))
        return "BANKNIFTY";

    if (symbol.includes("NIFTY"))
        return "NIFTY";

    if (symbol.includes("CRUDE"))
        return "CRUDEOIL";

    if (symbol.includes("NATURAL"))
        return "NATURALGAS";

    if (symbol.includes("BTC"))
        return "BTCUSD";

    return symbol;

}

// ======================================
// OPEN NEW TRADE
// ======================================

function openTrade(data) {

    const market = getMarket(data.symbol);

    if (!tradeData[market]) {
        return {
            success: false,
            message: "Unknown Market"
        };
    }

    const tradeKey =
    `${market}_${data.timeframe}_${data.strike}_${data.cmd}`;

    // Duplicate Check
    if (tradeData[market].active[tradeKey]) {

        return {
            success: false,
            message: "Trade Already Active"
        };

    }

    // Generate Trade ID
    tradeCounter[market]++;

    const tradeId =
        `HSK-${market}-${String(tradeCounter[market]).padStart(4, "0")}`;

    // Save Active Trade
    tradeData[market].active[tradeKey] = {

        tradeId: tradeId,

        symbol: data.symbol,
        timeframe: data.timeframe,
        strike: data.strike,

        side: data.cmd,

        entry: data.price,
        sl: data.sl,

        tg1: data.tg1,
        tg2: data.tg2,

        status: "ACTIVE",

        openTime: new Date()

    };

    return {

        success: true,
        trade: tradeData[market].active[tradeKey]

    };

} 
// ======================================
// UPDATE TRADE
// ======================================

function updateTrade(data, status) {

    const market = getMarket(data.symbol);

    // Search Active Trade
    for (const key in tradeData[market].active) {

        const trade = tradeData[market].active[key];

        if (
            trade.symbol === data.symbol &&
            trade.timeframe == data.timeframe &&
            trade.strike == data.strike
        ) {

            trade.status = status;
            trade.updateTime = new Date();

            return {
                success: true,
                trade
            };

        }

    }

    return {
        success: false,
        message: "Trade Not Found"
    };

}

// ======================================
// CLOSE TRADE
// ======================================

function closeTrade(data, result) {

    const market = getMarket(data.symbol);

    for (const key in tradeData[market].active) {

        const trade = tradeData[market].active[key];

        if (
            trade.symbol === data.symbol &&
            trade.timeframe == data.timeframe &&
            trade.strike == data.strike
        ) {

            trade.status = result;
            trade.closeTime = new Date();

            // Save in History
            tradeData[market].closed.push(trade);

            // Remove from Active
            delete tradeData[market].active[key];

            return {
                success: true,
                trade
            };

        }

    }

    return {
        success: false,
        message: "Trade Not Found"
    };

}
 
// ======================================
// EXPORTS
// ======================================

module.exports = {
    tradeData,
    openTrade,
    updateTrade,
    closeTrade
};