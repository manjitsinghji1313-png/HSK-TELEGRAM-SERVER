const {
    calculateQuantity
} = require("./quantityCalculator");

async function testQuantityCalculator() {

    try {

        console.log("================================");
        console.log("🧪 TESTING QUANTITY CALCULATOR");
        console.log("================================");

        const quantity =
            calculateQuantity(
                65,
                2
            );

        console.log("================================");
        console.log("✅ QUANTITY TEST SUCCESS");
        console.log("FINAL QUANTITY :", quantity);
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ QUANTITY TEST FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testQuantityCalculator();