const {
    executeBuyOrder
} = require("./orderService");

async function testOrderService() {

    try {

        console.log("================================");
        console.log("🧪 TESTING NORMAL BUY SERVICE");
        console.log("================================");

        const result = await executeBuyOrder({

            securityId: "123456",

            exchange: "NSE_FNO",

            quantity: 75,

            price: 100,

            orderType: "LIMIT",

            productType: "INTRADAY"

        }, {

            dryRun: true

        });

        console.log("================================");
        console.log("✅ SERVICE DRY RUN SUCCESS");
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
        console.log("❌ SERVICE TEST FAILED");
        console.log("================================");

        console.log(err.message);

    }

}

testOrderService();