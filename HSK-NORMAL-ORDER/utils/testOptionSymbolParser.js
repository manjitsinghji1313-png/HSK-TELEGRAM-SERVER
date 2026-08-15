const {
    parseOptionSymbol
} = require("./optionSymbolParser");

async function testOptionSymbolParser() {

    try {

        console.log("================================");
        console.log("🧪 TESTING OPTION SYMBOL PARSER");
        console.log("================================");

        // =====================================
        // CE TEST
        // =====================================

        const ceResult =
            parseOptionSymbol(
                "CRUDEOILM260817C7700"
            );

        console.log("================================");
        console.log("✅ CE PARSER TEST SUCCESS");
        console.log("================================");

        console.log(
            JSON.stringify(
                ceResult,
                null,
                2
            )
        );


        // =====================================
        // PE TEST
        // =====================================

        const peResult =
            parseOptionSymbol(
                "CRUDEOILM260817P7700"
            );

        console.log("================================");
        console.log("✅ PE PARSER TEST SUCCESS");
        console.log("================================");

        console.log(
            JSON.stringify(
                peResult,
                null,
                2
            )
        );


        console.log("================================");
        console.log("✅ OPTION SYMBOL PARSER TEST SUCCESS");
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ OPTION SYMBOL PARSER TEST FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testOptionSymbolParser();