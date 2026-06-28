// ======================================
// HSK BRAHMASTRA REPORT MANAGER V1
// ======================================

const report = {

    totalTrades: 0,

    wins: 0,

    losses: 0,

    totalPoints: 0,

    bestTrade: 0,

    worstTrade: 0

};

// ======================================
// ADD CLOSED TRADE
// ======================================

function addTrade(result, points) {

    report.totalTrades++;

    if (result === "TARGET HIT") {

        report.wins++;

    } else if (result === "STOP LOSS") {

        report.losses++;

    }

    report.totalPoints += points;

    if (points > report.bestTrade)
        report.bestTrade = points;

    if (points < report.worstTrade)
        report.worstTrade = points;

}

// ======================================
// GET REPORT
// ======================================

function getReport() {

    const accuracy =
        report.totalTrades > 0
            ? ((report.wins / report.totalTrades) * 100).toFixed(2)
            : "0.00";

    return {

        ...report,

        accuracy

    };

}

// ======================================
// RESET REPORT
// ======================================

function resetReport() {

    report.totalTrades = 0;
    report.wins = 0;
    report.losses = 0;
    report.totalPoints = 0;
    report.bestTrade = 0;
    report.worstTrade = 0;

}

// ======================================
// EXPORTS
// ======================================

module.exports = {

    addTrade,

    getReport,

    resetReport

};