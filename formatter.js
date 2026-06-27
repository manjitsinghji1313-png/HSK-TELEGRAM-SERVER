function formatMessage(data) {

    const now = new Date();

    const timestamp = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    console.log("Timestamp:", timestamp);

    // ==========================
    // TIMEFRAME FORMAT
    // ==========================
    const tfMap = {
        "30S": "30 Seconds",
        "1": "1 Minute",
        "3": "3 Minutes",
        "5": "5 Minutes",
        "15": "15 Minutes",
        "30": "30 Minutes",
        "45": "45 Minutes",
        "60": "1 Hour",
        "120": "2 Hours",
        "240": "4 Hours",
        "D": "1 Day",
        "W": "1 Week",
        "M": "1 Month"
    };

    const timeframe = tfMap[data.timeframe] || data.timeframe || "N/A";

    // ==========================
    // CE ENTRY
    // ==========================
    if (data.cmd === "CE_ENTRY") {

        return `
🛡 HSK BRAHMASTRA

🟢 CE ENTRY

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : CE ${data.strike}

💰 Entry : ${data.price}
🛑 SL : ${data.sl}

🎯 TG1 : ${data.tg1}
🎯 TG2 : ${data.tg2}

🕒 Time : ${timestamp}

━━━━━━━━━━━━━━
📚 Educational Purpose Only
⚠️ Trade at Your Own Risk
`;
    }

    // ==========================
    // PE ENTRY
    // ==========================
    if (data.cmd === "PE_ENTRY") {

        return `
🛡 HSK BRAHMASTRA

🔴 PE ENTRY

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : PE ${data.strike}

💰 Entry : ${data.price}
🛑 SL : ${data.sl}

🎯 TG1 : ${data.tg1}
🎯 TG2 : ${data.tg2}

🕒 Time : ${timestamp}

━━━━━━━━━━━━━━
📚 Educational Purpose Only
⚠️ Trade at Your Own Risk
`;
    }

    // ==========================
    // UNKNOWN
    // ==========================
    return `
🛡 HSK BRAHMASTRA

⚠️ Unknown Alert Received

🕒 Time : ${timestamp}
`;
}

module.exports = { formatMessage };