import { supabase } from "./supabase.js";

window.login = async function () {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter email and password.");

        return;

    }

    const { error } =
        await supabase.auth.signInWithPassword({

            email,
            password

        });

    if (error) {

        alert(error.message);

        return;

    }

    alert("Login Successful");

    window.location.href = "admin.html";

};
