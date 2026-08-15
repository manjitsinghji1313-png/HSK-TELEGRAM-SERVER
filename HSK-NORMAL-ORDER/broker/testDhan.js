const dhan = require("./dhanApi");

async function testDhan() {

    try {

        console.log("================================");
        console.log("🔎 TESTING DHAN CONNECTION");
        console.log("================================");

        const response = await dhan.get("/orders");

        console.log("✅ DHAN CONNECTION SUCCESS");

        console.log(
            JSON.stringify(response.data, null, 2)
        );

    } catch (err) {

        console.log("❌ DHAN CONNECTION FAILED");

        if (err.response) {

            console.log("STATUS :", err.response.status);

            console.log(
                JSON.stringify(
                    err.response.data,
                    null,
                    2
                )
            );

        } else {

            console.log("ERROR :", err.message);

        }

    }

}

testDhan();