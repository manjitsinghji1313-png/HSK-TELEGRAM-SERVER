const placeOrder = require("../broker/placeOrder");

// =====================================
// NORMAL BUY ORDER SERVICE
// =====================================

async function executeBuyOrder(orderData, options = {}) {

    if (!orderData) {
        throw new Error("Order data is required");
    }

    console.log("================================");
    console.log("🚀 EXECUTING NORMAL BUY ORDER");
    console.log("================================");

    // =====================================
    // FORCE BUY
    // =====================================

    const order = {

        ...orderData,

        transactionType: "BUY"

    };
        // =====================================
    // SAFE DRY RUN
    // =====================================

    if (options.dryRun === true) {

        console.log("================================");
        console.log("🧪 DRY RUN - NO DHAN ORDER");
        console.log("================================");

        return {
            dryRun: true,
            order
        };
    }



    // =====================================
    // PLACE ORDER
    // =====================================

    const result = await placeOrder(order);

    console.log("================================");
    console.log("✅ NORMAL BUY ORDER COMPLETED");
    console.log("ORDER ID :", result.orderId);
    console.log("================================");

    return result;
}

module.exports = {
    executeBuyOrder
};
