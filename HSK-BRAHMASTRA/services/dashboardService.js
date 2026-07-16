const supabase = require("../config/supabase");

async function getTodayReport() {

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("trades")
        .select("*")
        .neq("status", "ACTIVE")
        .gte("close_time", start.toISOString())
        .order("close_time", { ascending: false });

    if (error) throw error;

    return data;

}

module.exports = {

    getTodayReport

};