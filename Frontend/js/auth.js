// =====================================================
// USA AUTHENTICATION JAVASCRIPT
// =====================================================


// =====================================================
// PASSWORD VISIBILITY
// =====================================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }
}


// =====================================================
// SIGN UP
// =====================================================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -----------------------------------------
            // GET VALUES
            // -----------------------------------------

            const firstName =
                document
                    .getElementById("firstName")
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById("lastName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            // -----------------------------------------
            // PASSWORD VALIDATION
            // -----------------------------------------

            if (password.length < 8) {

                alert(
                    "Password must be at least 8 characters long."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            // -----------------------------------------
            // SEND SIGNUP DATA TO FLASK
            // -----------------------------------------

            try {

                const response =
                    await fetch(
                        "/api/signup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                firstName:
                                    firstName,

                                lastName:
                                    lastName,

                                email:
                                    email,

                                password:
                                    password

                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------
                // CHECK RESPONSE
                // -------------------------------------

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to create account."
                    );

                    return;
                }


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                alert(
                    "Account created successfully! 🎉"
                );


                // Go to login page

                window.location.href =
                    "/login.html";

            }


            catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                alert(
                    "Unable to connect to USA server."
                );

            }

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -----------------------------------------
            // GET LOGIN VALUES
            // -----------------------------------------

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            // -----------------------------------------
            // BASIC VALIDATION
            // -----------------------------------------

            if (!email || !password) {

                alert(
                    "Please enter your email and password."
                );

                return;
            }


            // -----------------------------------------
            // SEND LOGIN DATA TO FLASK
            // -----------------------------------------

            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email:
                                    email,

                                password:
                                    password

                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------
                // LOGIN FAILED
                // -------------------------------------

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Login failed."
                    );

                    return;
                }


                // -------------------------------------
                // LOGIN SUCCESSFUL
                // -------------------------------------

                if (data.success) {

                    // Save login status
                    localStorage.setItem(
                        "usaLoggedIn",
                        "true"
                    );


                    // Save user information
                    localStorage.setItem(
                        "usaUser",
                        JSON.stringify(data.user)
                    );


                    alert(
                        "Welcome back, " +
                        data.user.firstName +
                        "! 🛍️"
                    );


                    // ---------------------------------
                    // GO TO HOMEPAGE
                    // ---------------------------------

                    window.location.href =
                        "/Pages/home/home.html";

                }

            }


            catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    "Unable to connect to USA server."
                );

            }

        }
    );

}