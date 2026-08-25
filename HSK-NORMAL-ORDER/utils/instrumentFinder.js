const { getInstruments } = require("./instrumentLoader");

async function findInstrument(
    symbol,
    strike,
    optionType,
    requestedExpiry = null
) {

    // =====================================
    // SYMBOL MAP
    // =====================================

    const symbolMap = {
        NIFTY: "NIFTY",
        BANKNIFTY: "BANKNIFTY",
        SENSEX: "SENSEX",

        // BIG CRUDE
        CRUDEOIL: "CRUDEOIL",

        // MINI CRUDE
        CRUDEOILM: "CRUDEOILM",
        CRUDEOIL_MINI: "CRUDEOILM",

        NATURALGAS: "NATURALGAS",
        NATURALGAS_MINI: "NATGASMINT"
    };


    const searchSymbol =
        symbolMap[symbol] || symbol;


    const rows = getInstruments();


    console.log("================================");
    console.log("🔎 FIND INSTRUMENT");
    console.log("Symbol        :", searchSymbol);
    console.log("Strike        :", strike);
    console.log("Option        :", optionType);
    console.log("Requested Exp :", requestedExpiry);
    console.log("📦 Loaded in Memory :", rows.length);
    console.log("================================");


    // =====================================
    // FIND MATCHING OPTIONS
    // =====================================

    const options = [];


    for (const row of rows) {

        if (

            row.SEM_TRADING_SYMBOL &&

            row.SEM_TRADING_SYMBOL.startsWith(
                searchSymbol + "-"
            ) &&

            Number(row.SEM_STRIKE_PRICE) ===
                Number(strike) &&

            String(
                row.SEM_OPTION_TYPE || ""
            ).toUpperCase() ===
                String(optionType).toUpperCase()

        ) {

            // =====================================
            // EXPIRY
            // Example:
            // 2026-08-11 14:30:00
            // =====================================

            const rawExpiry =
                row.SEM_EXPIRY_DATE || "";


            const expiryDateOnly =
                rawExpiry.substring(0, 10);


            // =====================================
            // EXCHANGE
            // =====================================

            const tradingSymbol =
                row.SEM_TRADING_SYMBOL;


            const isMCX =
                tradingSymbol.startsWith(
                    "CRUDEOIL-"
                ) ||
                tradingSymbol.startsWith(
                    "CRUDEOILM-"
                ) ||
                tradingSymbol.startsWith(
                    "NATURALGAS-"
                ) ||
                tradingSymbol.startsWith(
                    "NATGASMINT-"
                );


            options.push({

                securityId:
                    row.SEM_SMST_SECURITY_ID,

                tradingSymbol:
                    tradingSymbol,

                strike:
                    Number(
                        row.SEM_STRIKE_PRICE
                    ),

                optionType:
                    String(
                        row.SEM_OPTION_TYPE || ""
                    ).toUpperCase(),

                expiry:
                    new Date(rawExpiry),

                expiryDate:
                    expiryDateOnly,

                expiryFlag:
                    row.SEM_EXPIRY_FLAG,

                lotSize:
                    Number(
                        row.SEM_LOT_UNITS
                    ),

                exchange:
                    isMCX
                        ? "MCX_COMM"
                        : tradingSymbol.startsWith(
                            "SENSEX-"
                        )
                            ? "BSE_FNO"
                            : "NSE_FNO"

            });

        }

    }


    // =====================================
    // NO INSTRUMENT
    // =====================================

    if (options.length === 0) {

        console.log("================================");
        console.log("❌ INSTRUMENT NOT FOUND");
        console.log("Symbol :", searchSymbol);
        console.log("Strike :", strike);
        console.log("Option :", optionType);
        console.log("Expiry :", requestedExpiry);
        console.log("================================");

        return null;

    }


    // =====================================
    // EXPIRY REQUESTED
    // =====================================

    if (requestedExpiry) {

        const expiryMatch =
            options.filter(
                x =>
                    x.expiryDate ===
                    requestedExpiry
            );


        // =====================================
        // EXACT EXPIRY FOUND
        // =====================================

        if (expiryMatch.length > 0) {

            expiryMatch.sort(
                (a, b) =>
                    a.expiry - b.expiry
            );


            const selected =
                expiryMatch[0];


            console.log("================================");
            console.log("✅ USING EXACT EXPIRY CONTRACT");
            console.log("================================");

            console.log(
                "Requested Expiry :",
                requestedExpiry
            );

            console.log(
                "Selected Expiry  :",
                selected.expiryDate
            );

            console.log(
                "Trading Symbol   :",
                selected.tradingSymbol
            );

            console.log(
                "Security ID      :",
                selected.securityId
            );

            console.log(
                "Strike           :",
                selected.strike
            );

            console.log(
                "Option           :",
                selected.optionType
            );

            console.log(
                "Lot Size         :",
                selected.lotSize
            );

            console.log(
                "Exchange         :",
                selected.exchange
            );

            console.log("================================");


            return selected;

        }


        // =====================================
        // REQUESTED EXPIRY NOT FOUND
        // =====================================

        console.log("================================");
        console.log("❌ REQUESTED EXPIRY NOT FOUND");
        console.log("================================");

        console.log(
            "Requested Expiry :",
            requestedExpiry
        );

        console.log(
            "Symbol           :",
            searchSymbol
        );

        console.log(
            "Strike           :",
            strike
        );

        console.log(
            "Option           :",
            optionType
        );

        console.log("================================");

        console.log(
            "Available Expiries:"
        );


        const availableExpiries =
            [
                ...new Set(
                    options.map(
                        x => x.expiryDate
                    )
                )
            ];


        availableExpiries
            .sort()
            .forEach(
                expiry => {

                    console.log(
                        "➡️",
                        expiry
                    );

                }
            );


        console.log("================================");


        // Do not select another expiry
        return null;

    }


    // =====================================
    // NO EXPIRY PROVIDED
    // SELECT NEAREST ACTIVE CONTRACT
    // =====================================

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const valid =
        options.filter(
            x => {

                if (!x.expiryDate) {
                    return false;
                }


                const expiryDate =
                    new Date(
                        x.expiryDate +
                        "T00:00:00"
                    );


                return expiryDate >= today;

            }
        );


    // =====================================
    // ACTIVE CONTRACT FOUND
    // =====================================

    if (valid.length > 0) {

        valid.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.expiryDate +
                        "T00:00:00"
                    );


                const dateB =
                    new Date(
                        b.expiryDate +
                        "T00:00:00"
                    );


                return dateA - dateB;

            }
        );


        const selected =
            valid[0];


        console.log("================================");
        console.log("🟢 ACTIVE CONTRACT SELECTED");
        console.log("================================");

        console.log(
            "Symbol         :",
            searchSymbol
        );

        console.log(
            "Expiry         :",
            selected.expiryDate
        );

        console.log(
            "Trading Symbol :",
            selected.tradingSymbol
        );

        console.log(
            "Security ID    :",
            selected.securityId
        );

        console.log(
            "Strike         :",
            selected.strike
        );

        console.log(
            "Option         :",
            selected.optionType
        );

        console.log(
            "Lot Size       :",
            selected.lotSize
        );

        console.log(
            "Exchange       :",
            selected.exchange
        );

        console.log("================================");


        console.log("================================");
        console.log("RAW CSV ROW");
        console.log(
            rows.find(
                r =>
                    String(
                        r.SEM_SMST_SECURITY_ID
                    ) ===
                    String(
                        selected.securityId
                    )
            )
        );
        console.log("================================");


        return selected;

    }


    // =====================================
    // NO ACTIVE CONTRACT FOUND
    // =====================================

    console.log("================================");
    console.log("❌ NO ACTIVE CONTRACT FOUND");
    console.log("================================");

    console.log(
        "Symbol :",
        searchSymbol
    );

    console.log(
        "Strike :",
        strike
    );

    console.log(
        "Option :",
        optionType
    );


    console.log(
        "Available contracts:"
    );


    options
        .sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.expiryDate +
                        "T00:00:00"
                    );

                const dateB =
                    new Date(
                        b.expiryDate +
                        "T00:00:00"
                    );

                return dateA - dateB;

            }
        )
        .forEach(
            x => {

                console.log(
                    x.expiryDate,
                    "|",
                    x.tradingSymbol,
                    "| Security ID:",
                    x.securityId
                );

            }
        );


    console.log("================================");


    return null;

}


// =====================================
// EXPORT
// =====================================

module.exports = {
    findInstrument
};