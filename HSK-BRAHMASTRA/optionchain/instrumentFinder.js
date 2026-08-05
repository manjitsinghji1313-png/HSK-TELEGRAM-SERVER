const fs = require("fs");
const csv = require("csv-parser");

async function findInstrument(symbol, strike, optionType) {

    return new Promise((resolve, reject) => {
        const symbolMap = {

    NIFTY: "NIFTY",

    BANKNIFTY: "BANKNIFTY",

    SENSEX: "SENSEX",

    CRUDEOIL: "CRUDEOIL",

    CRUDEOILM: "CRUDEOILM"

};

const searchSymbol = symbolMap[symbol] || symbol;

        const options = [];

        fs.createReadStream("./optionchain/instruments.csv")
            .pipe(csv())
            .on("data", (row) => {

if (
    row.SEM_TRADING_SYMBOL &&
    row.SEM_TRADING_SYMBOL.startsWith(searchSymbol + "-") &&
    Number(row.SEM_STRIKE_PRICE) === Number(strike) &&
    row.SEM_OPTION_TYPE === optionType
) {

                    console.log("================================");
                    console.log("MATCH FOUND");
                    console.log("================================");

                    console.log("Trading Symbol :", row.SEM_TRADING_SYMBOL);
                    console.log("Security ID    :", row.SEM_SMST_SECURITY_ID);
                    console.log("Exchange ID    :", row.SEM_EXM_EXCH_ID);
                    console.log("Strike Price   :", row.SEM_STRIKE_PRICE);
                    console.log("Option Type    :", row.SEM_OPTION_TYPE);
                    console.log("Expiry Date    :", row.SEM_EXPIRY_DATE);
                    console.log("Expiry Flag    :", row.SEM_EXPIRY_FLAG);
                    console.log("Lot Size       :", row.SEM_LOT_UNITS);

                    console.log("================================");

                    options.push({

                        securityId: row.SEM_SMST_SECURITY_ID,

                        tradingSymbol: row.SEM_TRADING_SYMBOL,

                        strike: Number(row.SEM_STRIKE_PRICE),

                        optionType: row.SEM_OPTION_TYPE,

                        expiry: new Date(row.SEM_EXPIRY_DATE),

                        expiryFlag: row.SEM_EXPIRY_FLAG,

                        lotSize: Number(row.SEM_LOT_UNITS),

                    exchange:
                        row.SEM_EXM_EXCH_ID === "MCX"
                        ? "MCX"
                        : row.SEM_EXM_EXCH_ID === "BSE"
                        ? "BSE_FNO"
                        : "NSE_FNO"

                    });

                }

            })

            .on("end", () => {

                if (options.length === 0) {

                    console.log("❌ NO MATCH FOUND");
                    return resolve(null);

                }

                // Weekly First
                let weekly = options.filter(x => x.expiryFlag === "W");

                if (weekly.length > 0) {

                    weekly.sort((a, b) => a.expiry - b.expiry);

                    console.log("✅ USING WEEKLY CONTRACT");
                    console.log(weekly[0]);

                    return resolve(weekly[0]);

                }

                // Monthly
                options.sort((a, b) => a.expiry - b.expiry);

                console.log("✅ USING MONTHLY CONTRACT");
                console.log(options[0]);

                resolve(options[0]);

            })

            .on("error", reject);

    });

}

module.exports = {
    findInstrument
};