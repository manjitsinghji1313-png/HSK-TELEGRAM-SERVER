    const { getInstruments } = require("./instrumentLoader");
    

async function findInstrument(symbol, strike, optionType) {

    const symbolMap = {
        NIFTY: "NIFTY",
        BANKNIFTY: "BANKNIFTY",
        SENSEX: "SENSEX",
        CRUDEOIL: "CRUDEOIL",
        CRUDEOILM: "CRUDEOILM"
    };

    const searchSymbol = symbolMap[symbol] || symbol;
    const rows = getInstruments();

    console.log(`📦 Loaded in Memory : ${rows.length}`);

    const options = [];

    for (const row of rows) {

        if (
            row.SEM_TRADING_SYMBOL &&
            row.SEM_TRADING_SYMBOL.startsWith(searchSymbol + "-") &&
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
                    row.SEM_TRADING_SYMBOL.startsWith("CRUDEOIL") ||
                    row.SEM_TRADING_SYMBOL.startsWith("CRUDEOILM") ||
                    row.SEM_TRADING_SYMBOL.startsWith("NATURALGAS")
                        ? "MCX_COMM"
                        : row.SEM_TRADING_SYMBOL.startsWith("SENSEX")
                        ? "BSE_FNO"
                        : "NSE_FNO"
            });

        }

    }

    if (options.length === 0) {

        console.log("================================");
        console.log("❌ INSTRUMENT NOT FOUND");
        console.log("Symbol :", searchSymbol);
        console.log("Strike :", strike);
        console.log("Option :", optionType);
        console.log("================================");

        return null;

    }

    const now = new Date();

    const valid = options.filter(x => x.expiry >= now);

    if (valid.length > 0) {

        valid.sort((a, b) => a.expiry - b.expiry);

        console.log("================================");
        console.log("✅ USING CONTRACT");
        console.log(valid[0]);

        console.log("================================");
        console.log("RAW CSV ROW");
        console.log(
            rows.find(r => r.SEM_SMST_SECURITY_ID == valid[0].securityId)
        );
        console.log("================================");

        return valid[0];

    }

    options.sort((a, b) => a.expiry - b.expiry);

    console.log("================================");
    console.log("⚠ USING FALLBACK");
    console.log(options[0]);
    console.log("================================");

    return options[0];

}

module.exports = {
    findInstrument
};