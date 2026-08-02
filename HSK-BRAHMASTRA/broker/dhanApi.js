const axios = require("axios");
const config = require("./config");

const dhan = axios.create({
    baseURL: "https://api.dhan.co/v2",
    headers: {
        "access-token": config.ACCESS_TOKEN,
        "client-id": config.CLIENT_ID,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

module.exports = dhan;