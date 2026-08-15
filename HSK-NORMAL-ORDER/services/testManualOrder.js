const {
    loadInstruments
} = require("../optionchain/instrumentLoader");

const {
    manualNormalBuy
} = require("./manualOrder");

// =====================================
// TEST MANUAL NORMAL LIMIT ORDER
// =====================================

async function testManualOrder() {

    try {

        console.log("================================");
        console.log("🧪 TEST MANUAL NORMAL LIMIT ORDER");
        console.log("================================");

        // =================================
        // LOAD INSTRUMENT MASTER
        // =================================

        await loadInstruments();

        // =================================
        // MANUAL ORDER TEST
        // =================================

        const result =
            await manualNormalBuy({

                symbol: "NIFTY",

                strike: 23300,

                optionType: "CE",

                lots: 1,

                price: 120,

                expiry: null

            });

        console.log("================================");
        console.log("✅ MANUAL ORDER TEST SUCCESS");
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
        console.log("❌ MANUAL ORDER TEST FAILED");
        console.log("================================");

        console.log(
            err.message
        );

    }

}

testManualOrder();