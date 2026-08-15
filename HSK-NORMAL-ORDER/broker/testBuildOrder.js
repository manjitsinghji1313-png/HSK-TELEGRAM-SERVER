const buildOrder = require("./buildOrder");

async function testBuildOrder() {

    try {

        const order = await buildOrder({

            securityId: "123456",

            exchange: "NSE_FNO",

            quantity: 75,

            price: 100,

            orderType: "LIMIT",

            productType: "INTRADAY"

        });

        console.log("================================");
        console.log("✅ BUY ORDER PAYLOAD TEST SUCCESS");
        console.log("================================");

        console.log(
            JSON.stringify(
                order,
                null,
                2
            )
        );

    } catch (err) {

        console.log("❌ BUILD ORDER TEST FAILED");
        console.log(err.message);

    }

}

testBuildOrder();