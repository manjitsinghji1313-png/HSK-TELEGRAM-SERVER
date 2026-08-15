const {
    placeBuyOrder
} = require("./buyOrder");

async function testBuyOrder() {

    try {

        console.log("================================");
        console.log("🧪 TESTING BUY ORDER");
        console.log("================================");

        const result =
            await placeBuyOrder({

                // CRUDEOILM 7700 CE
                securityId: "573889",

                exchange: "MCX_COMM",

                quantity: 1,

                // TradingView ENTRY PRICE
                price: 176,

                correlationId:
                    "HSKN_TEST_" + Date.now(),

                // =================================
                // 🔐 DRY RUN ONLY
                // =================================
                dryRun: true

            });


        console.log("================================");
        console.log("✅ BUY DRY RUN SUCCESS");
        console.log("================================");

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        console.log("================================");
        console.log("🚫 NO DHAN ORDER WAS PLACED");
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ BUY DRY RUN FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testBuyOrder();