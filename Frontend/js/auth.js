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


function saveAuthenticatedUser(user) {
    localStorage.setItem(
        "usaLoggedIn",
        "true"
    );
    localStorage.setItem(
        "buyBuddyLoggedIn",
        "true"
    );
    localStorage.setItem(
        "usaUser",
        JSON.stringify(user)
    );
    localStorage.setItem(
        "buyBuddyUser",
        JSON.stringify(user)
    );
}


// =====================================================
// GOOGLE SIGN-IN
// =====================================================

const googleAuthButton =
    document.querySelector(".google-btn");

if (googleAuthButton) {
    let googleTokenClient = null;
    let googleAuthError =
        "Google sign-in is still initializing. Please try again shortly.";

    async function initializeGoogleSignIn() {
        try {
            if (window.location.protocol === "file:") {
                throw new Error(
                    "Open this page through Flask at http://127.0.0.1:5000/Signup.html instead of opening the HTML file directly."
                );
            }

            let response;
            try {
                response = await fetch(
                    "/api/auth/google/config"
                );
            } catch (error) {
                throw new Error(
                    "Could not reach the USA server. Start the Flask app and open the site through its local address."
                );
            }

            let config;
            try {
                config = await response.json();
            } catch (error) {
                throw new Error(
                    "The USA server returned an invalid Google sign-in configuration."
                );
            }

            if (!response.ok || !config.clientId) {
                throw new Error(
                    config.message ||
                    "Google sign-in is not configured on this server."
                );
            }

            if (!window.google?.accounts?.oauth2) {
                await new Promise((resolve, reject) => {
                    const googleScript =
                        document.createElement("script");
                    googleScript.src =
                        "https://accounts.google.com/gsi/client";
                    googleScript.async = true;
                    googleScript.addEventListener(
                        "load",
                        resolve,
                        { once: true }
                    );
                    googleScript.addEventListener(
                        "error",
                        () => reject(
                            new Error(
                                "Google sign-in could not be loaded. Check your internet connection."
                            )
                        ),
                        { once: true }
                    );
                    document.head.appendChild(googleScript);
                });
            }

            if (!window.google?.accounts?.oauth2) {
                throw new Error(
                    "Google sign-in could not be loaded. Check your internet connection."
                );
            }

            googleTokenClient =
                window.google.accounts.oauth2.initTokenClient({
                    client_id: config.clientId,
                    scope: "openid email profile",
                    callback: async (tokenResponse) => {
                        if (
                            tokenResponse.error
                            || !tokenResponse.access_token
                        ) {
                            showAuthMessage(
                                "Google Sign-In Error",
                                "Google sign-in was cancelled or could not be completed.",
                                "error"
                            );
                            return;
                        }

                        try {
                            const response = await fetch(
                                "/api/auth/google",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        accessToken:
                                            tokenResponse.access_token
                                    })
                                }
                            );
                            const data = await response.json();

                            if (!response.ok || !data.success) {
                                showAuthMessage(
                                    "Google Sign-In Error",
                                    data.message ||
                                    "Unable to sign in with Google.",
                                    "error"
                                );
                                return;
                            }

                            saveAuthenticatedUser(data.user);
                            window.location.href =
                                "/Pages/home/home.html";
                        } catch (error) {
                            console.error(
                                "Google sign-in error:",
                                error
                            );
                            showAuthMessage(
                                "Connection Error",
                                "Unable to connect to the USA server.",
                                "error"
                            );
                        }
                    }
                });

            googleAuthError = "";
        } catch (error) {
            googleAuthError = error.message;
            console.error(
                "Google sign-in initialization error:",
                error
            );
        }
    }

    googleAuthButton.addEventListener(
        "click",
        function () {
            const termsCheckbox =
                document.querySelector(".terms input");

            if (termsCheckbox && !termsCheckbox.checked) {
                showAuthMessage(
                    "Terms Required",
                    "Please agree to the Terms & Conditions and Privacy Policy before creating an account.",
                    "error"
                );
                return;
            }

            if (!googleTokenClient) {
                showAuthMessage(
                    "Google Sign-In Unavailable",
                    googleAuthError,
                    "error"
                );
                return;
            }

            try {
                googleTokenClient.requestAccessToken();
            } catch (error) {
                console.error(
                    "Google sign-in popup error:",
                    error
                );
                showAuthMessage(
                    "Google Sign-In Error",
                    "Unable to open Google sign-in. Please try again.",
                    "error"
                );
            }
        }
    );

    initializeGoogleSignIn();
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

                        saveAuthenticatedUser(data.user);


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

                    saveAuthenticatedUser(data.user);


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