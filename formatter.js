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

    if (data.cmd === "CE_ENTRY") {

        return `
🛡 HSK BRAHMASTRA

🟢 CE ENTRY

📊 Symbol : ${data.symbol}
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

    if (data.cmd === "PE_ENTRY") {

        return `
🛡 HSK BRAHMASTRA

🔴 PE ENTRY

📊 Symbol : ${data.symbol}
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

    return `
🛡 HSK BRAHMASTRA

⚠️ Unknown Alert Received

🕒 Time : ${timestamp}
`;
}

module.exports = { formatMessage };