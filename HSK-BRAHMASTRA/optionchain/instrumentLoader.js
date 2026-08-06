const fs = require("fs");
const csv = require("csv-parser");

let instruments = [];

async function loadInstruments() {

    return new Promise((resolve, reject) => {

        instruments = [];

        fs.createReadStream("./optionchain/instruments.csv")
            .pipe(csv())

            .on("data", (row) => {

                instruments.push(row);

            })

            .on("end", () => {

                console.log(`✅ Loaded ${instruments.length} instruments`);

                resolve();

            })

            .on("error", reject);

    });

}

function getInstruments() {

    return instruments;

}

module.exports = {

    loadInstruments,

    getInstruments

};