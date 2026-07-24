import { supabase } from "./supabase.js";

// Check Login
const {
    data: { session }
} = await supabase.auth.getSession();

if (!session) {

    window.location.href = "login.html";

}

// Logout Function
window.logout = async function () {

    await supabase.auth.signOut();

    window.location.href = "login.html";

};