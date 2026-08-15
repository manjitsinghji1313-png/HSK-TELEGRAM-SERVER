const {
    loadInstruments
} = require("../optionchain/instrumentLoader");

const {
    findInstrument
} = require("./instrumentFinder");

async function testInstrumentFinder() {

    try {

        await loadInstruments();

        console.log("================================");
        console.log("🧪 TESTING INSTRUMENT FINDER");
        console.log("================================");

        const result = await findInstrument(
            "NIFTY",
            25000,
            "CE"
        );

        if (!result) {

            console.log("❌ INSTRUMENT NOT FOUND");

            return;
        }

        console.log("================================");
        console.log("✅ INSTRUMENT FINDER SUCCESS");
        console.log("================================");

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

    } catch (err) {

        console.log("================================");
        console.log("❌ INSTRUMENT FINDER FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testInstrumentFinder();