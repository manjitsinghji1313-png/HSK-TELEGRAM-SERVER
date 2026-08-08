require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log("================================");
console.log("🔌 SUPABASE CONFIG");
console.log("URL EXISTS :", !!process.env.SUPABASE_URL);
console.log(
    "SERVICE KEY EXISTS :",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log("================================");

module.exports = supabase;