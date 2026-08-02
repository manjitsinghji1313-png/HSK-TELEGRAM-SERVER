const dhan = require("./dhanApi");
const buildSuperOrder = require("./buildSuperOrder");
const tradeService = require("../services/tradeService");
const axios = require("axios");

async function placeSuperOrder(orderData) {

    try {

        const order = await buildSuperOrder(orderData);

        console.log("================================");
        console.log("SUPER ORDER PAYLOAD");
        console.log(JSON.stringify(order, null, 2));
        console.log("================================");

        const { data } = await axios.get("https://api.ipify.org?format=json");

        console.log("================================");
        console.log("CURRENT SERVER IP");
        console.log(data.ip);
        console.log("================================");

        const response = await dhan.post(
            "/super/orders",
            order
        );

        console.log("================================");
        console.log("SUPER ORDER SUCCESS");
        console.log(response.data);
        console.log("================================");

        const orderId =
            response.data.orderId ||
            response.data.data?.orderId ||
            null;

        if (!orderId) {
            throw new Error("Broker Order ID not received");
        }

        await tradeService.saveBrokerOrder({

            tradeKey: orderData.tradeKey,

            orderId,

            securityId: order.securityId,

            exchangeSegment: order.exchangeSegment,

            quantity: order.quantity,

            productType: order.productType,

            status: "OPEN"

        });

        return {

            orderId,

            brokerResponse: response.data

        };

    } catch (err) {

        console.log("================================");
        console.log("SUPER ORDER FAILED");

        if (err.response) {

            console.log(JSON.stringify(err.response.data, null, 2));

        } else {

            console.log(err.message);

        }

        console.log("================================");

        throw err;

    }

}

module.exports = placeSuperOrder;