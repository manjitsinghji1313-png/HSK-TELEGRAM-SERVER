const axios = require("axios");
const fs = require("fs");

async function downloadInstrumentFile() {

    try {

        console.log("Downloading Dhan Instrument List...");

        const response = await axios.get(
            "https://images.dhan.co/api-data/api-scrip-master.csv",
            {
                responseType: "stream"
            }
        );

        const writer = fs.createWriteStream("./optionchain/instruments.csv");

        response.data.pipe(writer);

        writer.on("finish", () => {

            console.log("✅ Download Complete");

        });

        writer.on("error", console.error);

    } catch (err) {

        console.log(err.message);

    }

}

downloadInstrumentFile();