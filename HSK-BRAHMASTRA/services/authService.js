const supabase = require("../config/supabase");

async function login(email, password) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw error;
    }

    return data;
}

module.exports = {
    login
};