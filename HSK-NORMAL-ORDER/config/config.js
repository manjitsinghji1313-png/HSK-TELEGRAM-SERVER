require("dotenv").config();

module.exports = {

    CLIENT_ID: process.env.DHAN_CLIENT_ID,

    ACCESS_TOKEN: process.env.DHAN_ACCESS_TOKEN

};

console.log("================================");
console.log("🔐 DHAN CONFIG CHECK");
console.log(
    "CLIENT ID PRESENT :",
    !!process.env.DHAN_CLIENT_ID
);
console.log(
    "ACCESS TOKEN PRESENT :",
    !!process.env.DHAN_ACCESS_TOKEN
);
console.log("================================");