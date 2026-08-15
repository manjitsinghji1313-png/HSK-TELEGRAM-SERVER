// =====================================
// OPTION SYMBOL PARSER
// =====================================
// Example:
// CRUDEOILM260817C7700
//
// Result:
// symbol     = CRUDEOILM
// expiry     = 2026-08-17
// optionType = CE
// strike     = 7700
// =====================================

function parseOptionSymbol(optionSymbol) {

    if (!optionSymbol) {
        throw new Error("Option symbol is required");
    }

    const value =
        String(optionSymbol)
            .trim()
            .toUpperCase();

    console.log("================================");
    console.log("🔎 PARSING OPTION SYMBOL");
    console.log("SYMBOL :", value);
    console.log("================================");


    // =====================================
    // SYMBOL PATTERN
    // =====================================

    const match =
        value.match(
            /^([A-Z]+)(\d{6})(C|P)(\d+(?:\.\d+)?)$/
        );


    if (!match) {

        throw new Error(
            `Invalid option symbol format: ${value}`
        );

    }


    // =====================================
    // EXTRACT PARTS
    // =====================================

    const underlying =
        match[1];

    const expiryRaw =
        match[2];

    const optionCode =
        match[3];

    const strike =
        Number(match[4]);


    // =====================================
    // EXPIRY
    // YYMMDD
    // =====================================

    const year =
        2000 +
        Number(
            expiryRaw.substring(0, 2)
        );

    const month =
        expiryRaw.substring(2, 4);

    const day =
        expiryRaw.substring(4, 6);

    const expiry =
        `${year}-${month}-${day}`;


    // =====================================
    // OPTION TYPE
    // =====================================

    const optionType =
        optionCode === "C"
            ? "CE"
            : "PE";


    // =====================================
    // RESULT
    // =====================================

    const result = {

        symbol:
            underlying,

        expiry,

        optionType,

        strike

    };


    console.log("================================");
    console.log("✅ OPTION SYMBOL PARSED");
    console.log("================================");

    console.log(
        "Underlying  :",
        result.symbol
    );

    console.log(
        "Expiry      :",
        result.expiry
    );

    console.log(
        "Option      :",
        result.optionType
    );

    console.log(
        "Strike      :",
        result.strike
    );

    console.log("================================");


    return result;
}


// =====================================
// EXPORT
// =====================================

module.exports = {

    parseOptionSymbol

};