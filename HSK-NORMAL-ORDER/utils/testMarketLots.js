const {
    getMarketLots,
    setMarketLots,
    getAllMarketLots
} = require("./marketLots");

async function testMarketLots() {

    try {

        console.log("================================");
        console.log("🧪 TESTING MARKET LOTS");
        console.log("================================");

        // =====================================
        // DEFAULT LOT
        // =====================================

        console.log(
            "NIFTY DEFAULT LOTS :",
            getMarketLots("NIFTY")
        );

        // =====================================
        // CHANGE NIFTY LOTS
        // =====================================

        setMarketLots(
            "NIFTY",
            2
        );

        console.log(
            "NIFTY UPDATED LOTS :",
            getMarketLots("NIFTY")
        );

        // =====================================
        // SHOW ALL
        // =====================================

        console.log("================================");
        console.log("ALL MARKET LOTS");
        console.log("================================");

        console.log(
            JSON.stringify(
                getAllMarketLots(),
                null,
                2
            )
        );

        console.log("================================");
        console.log("✅ MARKET LOTS TEST SUCCESS");
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ MARKET LOTS TEST FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testMarketLots();