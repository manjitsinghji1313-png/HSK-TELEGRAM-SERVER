const {
    parseOptionSymbol
} = require("./optionSymbolParser");

const {
    findInstrument
} = require("./instrumentFinder");

const {
    loadInstruments
} = require("../optionchain/instrumentLoader");

const {
    getMarketLots
} = require("./marketLots");

const {
    calculateQuantity
} = require("./quantityCalculator");

async function testOrderPipeline() {

    try {

        console.log("================================");
        console.log("🧪 TESTING COMPLETE ORDER PIPELINE");
        console.log("================================");


        // =====================================
        // STEP 1 — LOAD INSTRUMENT MASTER
        // =====================================

        await loadInstruments();


        // =====================================
        // STEP 2 — TRADINGVIEW SYMBOL
        // =====================================

        const tradingViewSymbol =
            "CRUDEOILM260817C7700";

        console.log("================================");
        console.log("📡 TRADINGVIEW SYMBOL");
        console.log(
            tradingViewSymbol
        );
        console.log("================================");


        // =====================================
        // STEP 3 — PARSE SYMBOL
        // =====================================

        const parsed =
            parseOptionSymbol(
                tradingViewSymbol
            );


        // =====================================
        // STEP 4 — FIND INSTRUMENT
        // =====================================

        const instrument =
            await findInstrument(

                parsed.symbol,

                parsed.strike,

                parsed.optionType,

                parsed.expiry

            );


        if (!instrument) {

            throw new Error(
                "Instrument not found"
            );

        }


        // =====================================
        // STEP 5 — MARKET LOTS
        // =====================================

        const selectedLots =
            getMarketLots(
                parsed.symbol
            );


        console.log("================================");
        console.log("📦 MARKET LOTS");
        console.log(
            "MARKET :",
            parsed.symbol
        );
        console.log(
            "LOTS   :",
            selectedLots
        );
        console.log("================================");


        // =====================================
        // STEP 6 — FINAL QUANTITY
        // =====================================

        const quantity =
            calculateQuantity(

                instrument.lotSize,

                selectedLots

            );


        // =====================================
        // FINAL RESULT
        // =====================================

        console.log("================================");
        console.log("🎯 COMPLETE PIPELINE SUCCESS");
        console.log("================================");

        console.log(
            "TradingView Symbol :",
            tradingViewSymbol
        );

        console.log(
            "Underlying         :",
            parsed.symbol
        );

        console.log(
            "Expiry             :",
            parsed.expiry
        );

        console.log(
            "Option             :",
            parsed.optionType
        );

        console.log(
            "Strike             :",
            parsed.strike
        );

        console.log(
            "Security ID        :",
            instrument.securityId
        );

        console.log(
            "Trading Symbol     :",
            instrument.tradingSymbol
        );

        console.log(
            "Lot Size           :",
            instrument.lotSize
        );

        console.log(
            "Selected Lots      :",
            selectedLots
        );

        console.log(
            "Final Quantity     :",
            quantity
        );

        console.log(
            "Exchange           :",
            instrument.exchange
        );

        console.log("================================");
        console.log("🚫 NO DHAN ORDER PLACED");
        console.log("================================");


    } catch (err) {

        console.log("================================");
        console.log("❌ ORDER PIPELINE FAILED");
        console.log("================================");

        console.log(
            "ERROR :",
            err.message
        );

    }

}

testOrderPipeline();