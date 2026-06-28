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
    "15S": "15 Sec",
    "30S": "30 Sec",
    "45S": "45 Sec",

    "1": "1 Min",
    "2": "2 Min",
    "3": "3 Min",
    "5": "5 Min",
    "15": "15 Min",
    "30": "30 Min",
    "45": "45 Min",

    "60": "1 Hour",
    "120": "2 Hours",
    "240": "4 Hours",

    "D": "1 Day",
    "W": "1 Week",
    "M": "1 Month"
};

    const timeframe = tfMap[data.timeframe] || data.timeframe || "N/A";

    // ==========================
// POINTS CALCULATION
// ==========================

const entry = Number(data.price || 0);
const sl = Number(data.sl || 0);
const tg1 = Number(data.tg1 || 0);
const tg2 = Number(data.tg2 || 0);

const slPoints = Math.abs(entry - sl);
const tg1Points = Math.abs(tg1 - entry);
const tg2Points = Math.abs(tg2 - entry); 
 
// ==========================
// RISK REWARD
// ==========================

const rr1 =
    slPoints > 0 ? (tg1Points / slPoints).toFixed(2) : "0";

const rr2 =
    slPoints > 0 ? (tg2Points / slPoints).toFixed(2) : "0";

// ==========================
// CE ENTRY
// ==========================
if (data.cmd === "CE_ENTRY") {

    return `
🛡 HSK BRAHMASTRA

🆔 Trade ID : ${data.tradeId || "N/A"}

🟢 CE ENTRY
🟢 Status : ${data.status || "ACTIVE"}

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : CE ${data.strike}

💰 Entry : ${data.price}
🛑 SL : ${data.sl}     (-${slPoints} Points)

🎯 TG1 : ${data.tg1}   (+${tg1Points} Points)
🏆 TG2 : ${data.tg2}   (+${tg2Points} Points) 

━━━━━━━━━━━━━━
🕒 Time : ${timestamp}
━━━━━━━━━━━━━━
📚 **Educational Purpose Only**
⚠️ **Disclaimer**
• I am NOT a SEBI Registered Investment Adviser.
• This content is for educational and informational purposes only.
• This is NOT financial or investment advice.
• Please consult your Financial Advisor before making any trading or investment decisions.
• Trade at your own risk.

`;
}

// ==========================
// PE ENTRY
// ==========================
if (data.cmd === "PE_ENTRY") {

    return `
🛡 HSK BRAHMASTRA
🆔 Trade ID : ${data.tradeId || "N/A"}

🔴 PE ENTRY
🟢 Status : ${data.status || "ACTIVE"}

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : PE ${data.strike}

💰 Entry : ${data.price}
🛑 SL : ${data.sl}     (-${slPoints} Points)

🎯 TG1 : ${data.tg1}   (+${tg1Points} Points)
🏆 TG2 : ${data.tg2}   (+${tg2Points} Points) 

🕒 Time : ${timestamp}
━━━━━━━━━━━━━━
📚 Educational Purpose Only
⚠️ Disclaimer
• I am NOT a SEBI Registered Investment Adviser or Research Analyst.
• This content is for educational and informational purposes only.
• This is NOT financial or investment advice.
• Please consult your Financial Advisor before making any trading or investment decisions.
• Trade at your own risk.
`;

}

// ==========================
// TG1 HIT
// ==========================
if (data.cmd === "TG1_HIT") {

    return `
🛡 HSK BRAHMASTRA
🆔 Trade ID : ${data.tradeId || "N/A"}

🎯 TG1 HIT

🟢 Status : ${data.status || "PARTIAL BOOKED"}

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : ${data.strike}

✅ Partial Profit Booked
🔒 Stop Loss Shifted To Cost

🕒 Time : ${timestamp}
━━━━━━━━━━━━━━
📚 Educational Purpose Only
⚠️ Trade at Your Own Risk
`;

}

// ==========================
// TG2 HIT
// ==========================
if (data.cmd === "TG2_HIT") {

    return `
🛡 HSK BRAHMASTRA

🆔 Trade ID : ${data.tradeId || "N/A"}
🏆 TARGET 2 HIT

🟢 Status : ${data.status || "TARGET HIT"}

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : ${data.strike}

🎉 Final Target Achieved

🕒 Time : ${timestamp}
━━━━━━━━━━━━━━
📚 Educational Purpose Only
⚠️ Trade at Your Own Risk
`;

} 
 
// ==========================
// SL HIT
// ==========================
if (data.cmd === "SL_HIT") {

    return `
🛡 HSK BRAHMASTRA

🆔 Trade ID : ${data.tradeId || "N/A"}

🛑 STOP LOSS HIT

🔴 Status : ${data.status || "STOP LOSS"}

📊 Symbol : ${data.symbol}
⏱ Time Frame : ${timeframe}
🎯 Strike : ${data.strike}

❌ Trade Closed At Stop Loss

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