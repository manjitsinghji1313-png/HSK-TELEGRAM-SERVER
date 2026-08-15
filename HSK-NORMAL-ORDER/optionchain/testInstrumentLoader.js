const {
    loadInstruments,
    getInstruments
} = require("./instrumentLoader");

async function testInstrumentLoader() {

    try {

        console.log("================================");
        console.log("🧪 TESTING INSTRUMENT LOADER");
        console.log("================================");

        await loadInstruments();

        const instruments = getInstruments();

        console.log("================================");
        console.log("✅ INSTRUMENT LOADER SUCCESS");
        console.log("TOTAL INSTRUMENTS :", instruments.length);
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ INSTRUMENT LOADER FAILED");
        console.log("================================");

        console.log("ERROR :", err.message);

    }

}

testInstrumentLoader();