const fs = require("fs");
const csv = require("csv-parser");

async function findInstrument(symbol, strike, optionType) {

    return new Promise((resolve, reject) => {

        const options = [];

        fs.createReadStream("./optionchain/instruments.csv")
            .pipe(csv())
            .on("data", (row) => {

                if (
                    row.SEM_TRADING_SYMBOL &&
                    row.SEM_TRADING_SYMBOL.startsWith(symbol + "-") &&
                    Number(row.SEM_STRIKE_PRICE) === Number(strike) &&
                    row.SEM_OPTION_TYPE === optionType
                ) {

                    options.push({

                        securityId: row.SEM_SMST_SECURITY_ID,

                        tradingSymbol: row.SEM_TRADING_SYMBOL,

                        strike: Number(row.SEM_STRIKE_PRICE),

                        optionType: row.SEM_OPTION_TYPE,

                        expiry: new Date(row.SEM_EXPIRY_DATE),

                        expiryFlag: row.SEM_EXPIRY_FLAG,

                        lotSize: Number(row.SEM_LOT_UNITS),

                        exchange:
                            row.SEM_EXM_EXCH_ID === "BSE"
                                ? "BSE_FNO"
                                : "NSE_FNO"

                    });

                }

            })

            .on("end", () => {

                if (options.length === 0)
                    return resolve(null);

                // Weekly First
                let weekly = options.filter(x => x.expiryFlag === "W");

                if (weekly.length > 0) {

                    weekly.sort((a,b)=>a.expiry-b.expiry);

                    return resolve(weekly[0]);

                }

                // Monthly

                options.sort((a,b)=>a.expiry-b.expiry);

                resolve(options[0]);

            })

            .on("error", reject);

    });

}

module.exports = {

    findInstrument

};