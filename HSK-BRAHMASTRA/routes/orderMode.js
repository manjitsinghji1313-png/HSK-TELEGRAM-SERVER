// =====================================
// ORDER MODE
// =====================================

let orderMode = "LIMIT";

// =====================================
// GET CURRENT ORDER MODE
// =====================================

function getOrderMode() {

    return orderMode;

}

// =====================================
// SET ORDER MODE
// =====================================

function setOrderMode(mode) {

    mode = String(mode).toUpperCase();

    if (mode !== "LIMIT" && mode !== "MARKET") {

        throw new Error(
            "Invalid Order Mode: " + mode
        );

    }

    orderMode = mode;

    console.log("================================");
    console.log("🔄 ORDER MODE CHANGED");
    console.log("ORDER MODE :", orderMode);
    console.log("================================");

    return orderMode;

}

// =====================================
// EXPORT
// =====================================

module.exports = {

    getOrderMode,

    setOrderMode

};