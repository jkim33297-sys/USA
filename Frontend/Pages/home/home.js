// ======================================
// GET USER
// ======================================

const savedUser =
    JSON.parse(
        localStorage.getItem("buyBuddyUser")
    );


// ======================================
// PERSONALIZE HOME PAGE
// ======================================

if (savedUser) {

    const fullName =
        savedUser.firstName +
        " " +
        savedUser.lastName;


    const initials =
        savedUser.firstName.charAt(0) +
        savedUser.lastName.charAt(0);


    const welcomeName =
        document.getElementById("welcomeName");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const profilePicture =
        document.getElementById("profilePicture");


    if (welcomeName) {

        welcomeName.textContent =
            savedUser.firstName;

    }


    if (profileName) {

        profileName.textContent =
            fullName;

    }


    if (profileEmail) {

        profileEmail.textContent =
            savedUser.email;

    }


    if (accountName) {

        accountName.textContent =
            fullName;

    }


    if (accountEmail) {

        accountEmail.textContent =
            savedUser.email;

    }


    if (profilePicture) {

        profilePicture.textContent =
            initials.toUpperCase();

    }

}



// ======================================
// ACCOUNT DROPDOWN
// ======================================

const accountButton =
    document.getElementById("accountButton");

const accountDropdown =
    document.getElementById("accountDropdown");

const logoutButton =
    document.getElementById("logoutButton");


if (accountButton && accountDropdown) {

    accountButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            accountDropdown.classList.toggle("show");

        }
    );

}


// Close account menu when clicking outside

document.addEventListener(
    "click",
    function(event) {

        if (
            accountDropdown &&
            accountButton &&
            !accountDropdown.contains(event.target) &&
            !accountButton.contains(event.target)
        ) {

            accountDropdown.classList.remove("show");

        }

    }
);



// ======================================
// LOGOUT
// ======================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            const confirmLogout =
                confirm(
                    "Are you sure you want to log out?"
                );


            if (confirmLogout) {

                localStorage.removeItem(
                    "buyBuddyLoggedIn"
                );


                window.location.href =
                    "../../index.html";

            }

        }
    );

}



// ======================================
// PRODUCT SEARCH
// ======================================

const homeSearch =
    document.getElementById("homeSearch");

const homeSearchButton =
    document.getElementById("homeSearchButton");


function performHomeSearch(query) {

    query = query.trim();


    if (query === "") {

        alert(
            "Tell USA what you're looking for first!"
        );

        homeSearch.focus();

        return;

    }


    // Save search

    localStorage.setItem(
        "usaSearchQuery",
        query
    );


    // Go to search page

    window.location.href =
        "../search/search.html";

}



// Search button

if (homeSearchButton) {

    homeSearchButton.addEventListener(
        "click",
        function() {

            performHomeSearch(
                homeSearch.value
            );

        }
    );

}



// Press Enter to search

if (homeSearch) {

    homeSearch.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                performHomeSearch(
                    homeSearch.value
                );

            }

        }
    );

}



// ======================================
// CATEGORY SEARCH
// ======================================

const categoryButtons =
    document.querySelectorAll(
        ".category-card"
    );


categoryButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const query =
                    button.dataset.search;


                performHomeSearch(query);

            }
        );

    }
);



// ======================================
// START SHOPPING BUTTON
// ======================================

const startShopping =
    document.getElementById("startShopping");


if (startShopping) {

    startShopping.addEventListener(
        "click",
        function() {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            setTimeout(
                function() {

                    if (homeSearch) {

                        homeSearch.focus();

                    }

                },
                500
            );

        }
    );

}