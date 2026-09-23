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


// ==========================================
// USA AUTH MESSAGE BOX
// ==========================================

function showAuthMessage(
    title,
    message,
    type = "success",
    buttonText = "Continue",
    onClose = null
) {

    const oldMessage =
        document.getElementById(
            "usaAuthMessage"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "usaAuthMessage";

    overlay.className =
        "auth-message-overlay";


    const box =
        document.createElement("div");

    box.className =
        "auth-message-box " +
        (
            type === "error"
                ? "auth-message-error"
                : "auth-message-success"
        );


    box.innerHTML = `
        <div class="auth-message-header">
            ${title}
        </div>

        <table class="auth-message-table">

            <tr>
                <td class="auth-message-label">
                    Status
                </td>

                <td class="auth-message-value">
                    ${
                        type === "error"
                            ? "Error"
                            : "Success"
                    }
                </td>
            </tr>

            <tr>
                <td class="auth-message-label">
                    Message
                </td>

                <td class="auth-message-value">
                    ${message}
                </td>
            </tr>

        </table>

        <div class="auth-message-button-area">

            <button
                type="button"
                class="auth-message-button"
                id="authMessageButton"
            >
                ${buttonText}
            </button>

        </div>
    `;


    overlay.appendChild(box);

    document.body.appendChild(overlay);


    const closeButton =
        document.getElementById(
            "authMessageButton"
        );


    closeButton.addEventListener(
        "click",
        function () {

            overlay.remove();

            if (typeof onClose === "function") {
                onClose();
            }

        }
    );


    overlay.addEventListener(
        "click",
        function (event) {

            if (event.target === overlay) {

                overlay.remove();

                if (typeof onClose === "function") {
                    onClose();
                }

            }

        }
    );
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

                showAuthMessage(
                    "Password Error",
                    "Password must be at least 8 characters long.",
                    "error"
                );

                return;
            }


            if (password !== confirmPassword) {

                showAuthMessage(
                    "Password Error",
                    "Passwords do not match.",
                    "error"
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

                    showAuthMessage(
                        "Account Error",
                        data.message ||
                        "Unable to create account.",
                        "error"
                    );

                    return;
                }


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                showAuthMessage(
                    "Account Created",
                    "Your account was created successfully! 🎉",
                    "success",
                    "Continue",
                    function () {

                        // Save login status

                        localStorage.setItem(
                            "usaLoggedIn",
                            "true"
                        );


                        localStorage.setItem(
                            "buyBuddyLoggedIn",
                            "true"
                        );


                        // Save user information

                        localStorage.setItem(
                            "usaUser",
                            JSON.stringify(data.user)
                        );


                        localStorage.setItem(
                            "buyBuddyUser",
                            JSON.stringify(data.user)
                        );


                        // -------------------------------------
                        // GO DIRECTLY TO DASHBOARD
                        // -------------------------------------

                        window.location.href =
                            "/Pages/home/home.html";

                    }
                );

            }


            catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                showAuthMessage(
                    "Connection Error",
                    "Unable to connect to the USA server.",
                    "error"
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

                showAuthMessage(
                    "Login Error",
                    "Please enter your email and password.",
                    "error"
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

                    showAuthMessage(
                        "Login Error",
                        data.message ||
                        "Incorrect email or password.",
                        "error"
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


                    localStorage.setItem(
                        "buyBuddyLoggedIn",
                        "true"
                    );


                    // Save user information

                    localStorage.setItem(
                        "usaUser",
                        JSON.stringify(data.user)
                    );


                    localStorage.setItem(
                        "buyBuddyUser",
                        JSON.stringify(data.user)
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

                showAuthMessage(
                    "Connection Error",
                    "Unable to connect to the USA server.",
                    "error"
                );

            }

        }
    );

}