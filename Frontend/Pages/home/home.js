// ======================================
// GET USER
// ======================================

let savedUser = null;

try {

    const usaUser =
        localStorage.getItem("usaUser");

    const buyBuddyUser =
        localStorage.getItem("buyBuddyUser");


    if (usaUser) {

        savedUser =
            JSON.parse(usaUser);

    }


    if (!savedUser && buyBuddyUser) {

        savedUser =
            JSON.parse(buyBuddyUser);

    }

}
catch (error) {

    console.error(
        "Unable to load saved user:",
        error
    );

}


// ======================================
// PERSONALIZE HOME PAGE
// ======================================

if (savedUser) {

    const firstName =
        savedUser.firstName ||
        savedUser.first_name ||
        "";


    const lastName =
        savedUser.lastName ||
        savedUser.last_name ||
        "";


    const email =
        savedUser.email ||
        "";


    const fullName =
        (
            firstName +
            " " +
            lastName
        ).trim();


    const initials =
        (
            firstName.charAt(0) +
            lastName.charAt(0)
        ).toUpperCase();


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


    if (welcomeName && firstName) {

        welcomeName.textContent =
            firstName;

    }


    if (profileName && fullName) {

        profileName.textContent =
            fullName;

    }


    if (profileEmail && email) {

        profileEmail.textContent =
            email;

    }


    if (accountName && fullName) {

        accountName.textContent =
            fullName;

    }


    if (accountEmail && email) {

        accountEmail.textContent =
            email;

    }


    if (profilePicture && initials) {

        profilePicture.textContent =
            initials;

    }

}
// ======================================
// SAVED PRODUCTS
// ======================================

function getSavedProductsKey() {

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("usaUser") ||
            localStorage.getItem("buyBuddyUser")
        );

    } catch (error) {

        user = null;

    }

    const email =
        user && user.email
            ? String(user.email).trim().toLowerCase()
            : "guest";

    return "usaSavedProducts_" +
        encodeURIComponent(email || "guest");

}


function getSavedProducts() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    getSavedProductsKey()
                )
            );

        return Array.isArray(saved)
            ? saved
            : [];

    } catch (error) {

        return [];

    }

}


function escapeSavedHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getSavedPrice(product) {

    if (product.priceDisplay) {

        return product.priceDisplay;

    }

    const price =
        Number(product.price);

    if (
        Number.isFinite(price) &&
        price > 0
    ) {

        const currency =
            String(
                product.currency || ""
            ).toUpperCase();

        if (currency === "PKR") {

            return "Rs. " +
                price.toLocaleString();

        }

        if (currency === "USD") {

            return "$" +
                price.toLocaleString();

        }

        if (currency === "GBP") {

            return "£" +
                price.toLocaleString();

        }

        if (currency === "EUR") {

            return "€" +
                price.toLocaleString();

        }

        return currency
            ? currency + " " + price.toLocaleString()
            : price.toLocaleString();

    }

    return "Price unavailable";

}


function getSavedProductKey(product) {

    return String(
        product.url ||
        (
            String(product.name || "") +
            "|" +
            String(product.source || "")
        )
    )
        .trim()
        .toLowerCase();

}


function removeSavedProduct(product) {

    const savedProducts =
        getSavedProducts();

    const key =
        getSavedProductKey(product);

    const updated =
        savedProducts.filter(
            savedProduct =>
                getSavedProductKey(savedProduct) !== key
        );


    localStorage.setItem(
        getSavedProductsKey(),
        JSON.stringify(updated)
    );


    showSavedProducts();

}


function showSavedProducts() {

    const existing =
        document.getElementById(
            "savedProductsOverlay"
        );


    if (existing) {

        existing.remove();

        document.body.style.overflow = "";

        return;

    }


    const savedProducts =
        getSavedProducts();


    const overlay =
        document.createElement("div");

    overlay.id =
        "savedProductsOverlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9999;
        background:rgba(0,0,0,0.45);
        backdrop-filter:blur(6px);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:24px;
    `;


    const panel =
        document.createElement("div");


    panel.style.cssText = `
        width:min(1000px, 100%);
        max-height:90vh;
        overflow:auto;
        background:#ffffff;
        border-radius:24px;
        padding:28px;
        box-shadow:0 20px 60px rgba(0,0,0,0.2);
    `;


    let productsHTML = "";


    if (savedProducts.length === 0) {

        productsHTML = `
            <div style="
                text-align:center;
                padding:70px 20px;
            ">
                <div style="
                    font-size:52px;
                    margin-bottom:15px;
                ">
                    ♡
                </div>

                <h3 style="
                    margin:0 0 10px;
                    font-size:24px;
                ">
                    No saved products yet
                </h3>

                <p style="
                    margin:0;
                    color:#777;
                    font-size:15px;
                ">
                    Save products from your search results
                    and they will appear here.
                </p>
            </div>
        `;

    } else {

        productsHTML =
            `<div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(260px, 1fr));
                gap:20px;
            ">` +

            savedProducts
                .map(
                    product => {

                        const image =
                            product.image
                                ? `
                                    <img
                                        src="${escapeSavedHtml(product.image)}"
                                        alt="${escapeSavedHtml(product.name)}"
                                        style="
                                            width:100%;
                                            height:190px;
                                            object-fit:contain;
                                            border-radius:16px;
                                            background:#f7f7f7;
                                        "
                                    >
                                  `
                                : `
                                    <div style="
                                        width:100%;
                                        height:190px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        background:#f7f7f7;
                                        border-radius:16px;
                                        font-size:48px;
                                    ">
                                        🛍️
                                    </div>
                                  `;


                        return `
                            <div
                                style="
                                    border:1px solid #eeeeee;
                                    border-radius:18px;
                                    padding:14px;
                                    background:#fff;
                                "
                            >

                                ${image}

                                <div style="
                                    padding:14px 4px 4px;
                                ">

                                    <div style="
                                        font-size:12px;
                                        color:#888;
                                        margin-bottom:5px;
                                    ">
                                        ${escapeSavedHtml(product.brand || product.source || "")}
                                    </div>

                                    <h3 style="
                                        margin:0 0 10px;
                                        font-size:17px;
                                        line-height:1.35;
                                    ">
                                        ${escapeSavedHtml(product.name)}
                                    </h3>

                                    <div style="
                                        font-size:18px;
                                        font-weight:700;
                                        margin-bottom:12px;
                                    ">
                                        ${escapeSavedHtml(getSavedPrice(product))}
                                    </div>

                                    <div style="
                                        display:flex;
                                        gap:8px;
                                        flex-wrap:wrap;
                                    ">

                                        ${
                                            product.url
                                                ? `
                                                    <a
                                                        href="${escapeSavedHtml(product.url)}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style="
                                                            text-decoration:none;
                                                            padding:9px 13px;
                                                            border-radius:10px;
                                                            background:#111;
                                                            color:#fff;
                                                            font-size:13px;
                                                        "
                                                    >
                                                        View Product
                                                    </a>
                                                  `
                                                : ""
                                        }

                                        <button
                                            type="button"
                                            class="remove-saved-product"
                                            data-save-key="${escapeSavedHtml(getSavedProductKey(product))}"
                                            style="
                                                padding:9px 13px;
                                                border-radius:10px;
                                                border:1px solid #ddd;
                                                background:#fff;
                                                cursor:pointer;
                                                font-size:13px;
                                            "
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("") +

            `</div>`;

    }


    panel.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:20px;
            margin-bottom:24px;
        ">

            <div>

                <h2 style="
                    margin:0 0 5px;
                    font-size:28px;
                ">
                    Saved Products
                </h2>

                <p style="
                    margin:0;
                    color:#777;
                ">
                    ${savedProducts.length}
                    saved product${savedProducts.length === 1 ? "" : "s"}
                </p>

            </div>

            <button
                type="button"
                id="closeSavedProducts"
                style="
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:#f3f3f3;
                    cursor:pointer;
                    font-size:22px;
                "
            >
                ×
            </button>

        </div>

        ${productsHTML}
    `;


    overlay.appendChild(panel);

    document.body.appendChild(overlay);

    document.body.style.overflow =
        "hidden";


    const closeButton =
        document.getElementById(
            "closeSavedProducts"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                overlay.remove();

                document.body.style.overflow = "";

            }
        );

    }


    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {

                overlay.remove();

                document.body.style.overflow = "";

            }

        }
    );


    panel
        .querySelectorAll(
            ".remove-saved-product"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const saveKey =
                        button.dataset.saveKey;

                    const product =
                        savedProducts.find(
                            item =>
                                getSavedProductKey(item) === saveKey
                        );

                    if (product) {

                        removeSavedProduct(product);

                    }

                }
            );

        });

}


const savedButton =
    document.querySelector(
        ".saved-button"
    );


if (savedButton) {

    savedButton.addEventListener(
        "click",
        function() {

            showSavedProducts();

        }
    );

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