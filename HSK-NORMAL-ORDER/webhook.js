const express = require("express");

const {
    parseOptionSymbol
} = require("./utils/optionSymbolParser");

const {
    findInstrument
} = require("./utils/instrumentFinder");

const {
    loadInstruments
} = require("./optionchain/instrumentLoader");

const {
    getMarketLots
} = require("./utils/marketLots");

const {
    calculateQuantity
} = require("./utils/quantityCalculator");

const {
    executeBuyOrder
} = require("./services/orderService");

const {
    manualNormalBuy
} = require("./services/manualOrder");


const app = express();

app.use(express.json());


// ======================================================
// TRADINGVIEW WEBHOOK
// ======================================================

app.post("/webhook", async (req, res) => {

    try {

        console.log("================================");
        console.log("📩 WEBHOOK RECEIVED");
        console.log("================================");

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );


        // =====================================
        // READ TRADINGVIEW DATA
        // =====================================

        const data = req.body;

        const cmd =
            String(data.cmd || "")
                .trim()
                .toUpperCase();

        const tradingViewSymbol =
            String(data.symbol || "")
                .trim()
                .toUpperCase();

        const price =
            Number(data.price);


        // =====================================
        // ONLY BUY ALLOWED
        // =====================================

        if (cmd !== "BUY") {

            console.log(
                "🚫 NON-BUY COMMAND IGNORED"
            );

            return res.status(200).json({

                success: false,

                message:
                    "Only BUY command is allowed",

                orderPlaced: false

            });

        }


        // =====================================
        // VALIDATE SYMBOL
        // =====================================

        if (!tradingViewSymbol) {

            throw new Error(
                "TradingView symbol is required"
            );

        }


        // =====================================
        // VALIDATE PRICE
        // =====================================

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {

            throw new Error(
                "Invalid BUY entry price"
            );

        }


        // =====================================
        // LOAD INSTRUMENT MASTER
        // =====================================

        await loadInstruments();


        // =====================================
        // PARSE TRADINGVIEW SYMBOL
        // =====================================

        const parsed =
            parseOptionSymbol(
                tradingViewSymbol
            );


        // =====================================
        // FIND EXACT INSTRUMENT
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
                "Exact option contract not found"
            );

        }


        // =====================================
        // MARKET LOTS
        // =====================================

        const selectedLots =
            getMarketLots(
                parsed.symbol
            );


        // =====================================
        // FINAL QUANTITY
        // =====================================

        const quantity =
            calculateQuantity(

                instrument.lotSize,

                selectedLots

            );


        // =====================================
        // FINAL ORDER DATA
        // =====================================

        const orderData = {

            securityId:
                instrument.securityId,

            exchange:
                instrument.exchange,

            quantity,

            price,

            orderType:
                "LIMIT",

            productType:
                "INTRADAY"

        };


        // =====================================
        // SHOW FINAL PIPELINE
        // =====================================

        console.log("================================");
        console.log("🎯 NORMAL BUY PIPELINE");
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
            "Exchange           :",
            instrument.exchange
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
            "Quantity            :",
            quantity
        );

        console.log(
            "BUY Price           :",
            price
        );

        console.log("================================");


        // =====================================
        // SAFE DRY RUN
        // =====================================

        const result =
            await executeBuyOrder(

                orderData,

                {
                    dryRun: true
                }

            );


        // =====================================
        // RESPONSE
        // =====================================

        return res.status(200).json({

            success: true,

            message:
                "BUY pipeline dry run successful",

            orderPlaced: false,

            dryRun: true,

            parsed,

            instrument: {

                securityId:
                    instrument.securityId,

                tradingSymbol:
                    instrument.tradingSymbol,

                lotSize:
                    instrument.lotSize,

                exchange:
                    instrument.exchange

            },

            quantity,

            price,

            order: result.order

        });


    } catch (err) {

        console.log("================================");
        console.log("❌ WEBHOOK ERROR");
        console.log("================================");

        console.log(
            err.message
        );

        return res.status(400).json({

            success: false,

            error:
                err.message,

            orderPlaced: false

        });

    }

});


// ======================================================
// MANUAL NORMAL LIMIT ORDER
// ======================================================

app.post("/manual-order", async (req, res) => {

    try {

        console.log("================================");
        console.log("📩 MANUAL NORMAL ORDER RECEIVED");
        console.log("================================");

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );


        // =====================================
        // READ MANUAL ORDER DATA
        // =====================================

        const data =
            req.body;


        const symbol =
            String(
                data.symbol || ""
            )
                .trim()
                .toUpperCase();


        const strike =
            Number(
                data.strike
            );


        const optionType =
            String(
                data.optionType || ""
            )
                .trim()
                .toUpperCase();


        const lots =
            Number(
                data.lots
            );


        const price =
            Number(
                data.price
            );


        const expiry =
            data.expiry ||
            null;


        // =====================================
        // VALIDATE SYMBOL
        // =====================================

        if (!symbol) {

            throw new Error(
                "Symbol is required"
            );

        }


        // =====================================
        // VALIDATE STRIKE
        // =====================================

        if (
            !Number.isFinite(strike) ||
            strike <= 0
        ) {

            throw new Error(
                "Invalid strike"
            );

        }


        // =====================================
        // VALIDATE CE / PE
        // =====================================

        if (
            !["CE", "PE"].includes(
                optionType
            )
        ) {

            throw new Error(
                "Option type must be CE or PE"
            );

        }


        // =====================================
        // VALIDATE LOTS
        // =====================================

        if (
            !Number.isFinite(lots) ||
            lots <= 0
        ) {

            throw new Error(
                "Invalid lots"
            );

        }


        // =====================================
        // VALIDATE LIMIT PRICE
        // =====================================

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {

            throw new Error(
                "Invalid LIMIT price"
            );

        }


        // =====================================
        // LOAD INSTRUMENT MASTER
        // =====================================

        await loadInstruments();


        // =====================================
        // MANUAL NORMAL LIMIT BUY
        // =====================================

        const result =
            await manualNormalBuy({

                symbol,

                strike,

                optionType,

                lots,

                price,

                expiry

            });


        // =====================================
        // RESPONSE
        // =====================================

        return res.status(200).json({

            success: true,

            message:
                "Manual normal LIMIT dry run successful",

            orderPlaced: false,

            dryRun: true,

            instrument:
                result.instrument,

            quantity:
                result.quantity,

            price:
                result.price,

            orderType:
                "LIMIT",

            productType:
                "INTRADAY",

            order:
                result.order

        });


    } catch (err) {

        console.log("================================");
        console.log("❌ MANUAL ORDER ERROR");
        console.log("================================");

        console.log(
            err.message
        );


        return res.status(400).json({

            success: false,

            error:
                err.message,

            orderPlaced: false

        });

    }

});

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 3002;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================"
        );

        console.log(
            "🚀 HSK NORMAL ORDER SERVER"
        );

        console.log(
            "PORT :",
            PORT
        );

        console.log(
            "================================"
        );

    }
);