// =========================================================
// USA EXPLORE PAGE
// PRODUCTS COME FROM DATABASE
// =========================================================


// =========================================================
// CATEGORIES
// =========================================================

const categories = [

    {
        name: "Tech",
        icon: "💻"
    },

    {
        name: "Smartphones",
        icon: "📱"
    },

    {
        name: "Laptops",
        icon: "💻"
    },

    {
        name: "Gadgets",
        icon: "🔌"
    },

    {
        name: "Gaming",
        icon: "🎮"
    },

    {
        name: "Gaming Accessories",
        icon: "🕹️"
    },

    {
        name: "Headphones & Audio",
        icon: "🎧"
    },

    {
        name: "Beauty",
        icon: "💄"
    },

    {
        name: "Skincare",
        icon: "🧴"
    },

    {
        name: "Home Appliances",
        icon: "🏠"
    },

    {
        name: "Kitchen",
        icon: "🍳"
    },

    {
        name: "Home & Living",
        icon: "🛋️"
    },

    {
        name: "Fashion",
        icon: "👕"
    },

    {
        name: "Sports",
        icon: "⚽"
    },

    {
        name: "Fitness",
        icon: "🏋️"
    },

    {
        name: "Books",
        icon: "📚"
    },

    {
        name: "Toys",
        icon: "🧸"
    },

    {
        name: "Baby",
        icon: "👶"
    },

    {
        name: "Automotive",
        icon: "🚗"
    },

    {
        name: "Tools",
        icon: "🔧"
    },

    {
        name: "Travel",
        icon: "✈️"
    },

    {
        name: "Office & Study",
        icon: "📓"
    }

];

// =========================================================
// PRODUCTS
// DUMMY EXPLORE PRODUCTS
// =========================================================

let products = [

    {
        name: "Acer Aspire 5 Laptop",
        brand: "Acer",
        category: "Laptops",
        price: 699,
        oldPrice: 799,
        rating: 4.5,
        value: 91,
        best: true,
        icon: "💻"
    },

    {
        name: "Samsung Galaxy S24",
        brand: "Samsung",
        category: "Smartphones",
        price: 749,
        oldPrice: 899,
        rating: 4.7,
        value: 94,
        best: true,
        icon: "📱"
    },

    {
        name: "Sony WH-1000XM5",
        brand: "Sony",
        category: "Headphones & Audio",
        price: 349,
        oldPrice: 399,
        rating: 4.8,
        value: 96,
        best: true,
        icon: "🎧"
    },

    {
        name: "Logitech MX Master 3S",
        brand: "Logitech",
        category: "Gadgets",
        price: 89,
        oldPrice: 109,
        rating: 4.7,
        value: 92,
        best: false,
        icon: "🖱️"
    },

    {
        name: "PlayStation 5 Slim",
        brand: "Sony",
        category: "Gaming",
        price: 499,
        oldPrice: 549,
        rating: 4.8,
        value: 95,
        best: true,
        icon: "🎮"
    },

    {
        name: "Razer BlackShark V2",
        brand: "Razer",
        category: "Gaming Accessories",
        price: 99,
        oldPrice: 129,
        rating: 4.6,
        value: 90,
        best: false,
        icon: "🕹️"
    },

    {
        name: "The Ordinary Niacinamide Serum",
        brand: "The Ordinary",
        category: "Skincare",
        price: 12,
        oldPrice: 15,
        rating: 4.6,
        value: 93,
        best: true,
        icon: "🧴"
    },

    {
        name: "Dyson V15 Detect",
        brand: "Dyson",
        category: "Home Appliances",
        price: 649,
        oldPrice: 749,
        rating: 4.7,
        value: 94,
        best: true,
        icon: "🏠"
    },

    {
        name: "Ninja Air Fryer",
        brand: "Ninja",
        category: "Kitchen",
        price: 129,
        oldPrice: 159,
        rating: 4.7,
        value: 93,
        best: true,
        icon: "🍳"
    },

    {
        name: "IKEA LED Floor Lamp",
        brand: "IKEA",
        category: "Home & Living",
        price: 59,
        oldPrice: 79,
        rating: 4.5,
        value: 89,
        best: false,
        icon: "🛋️"
    },

    {
        name: "Nike Air Max 270",
        brand: "Nike",
        category: "Fashion",
        price: 119,
        oldPrice: 150,
        rating: 4.6,
        value: 92,
        best: true,
        icon: "👕"
    },

    {
        name: "Adidas Training Shoes",
        brand: "Adidas",
        category: "Fitness",
        price: 79,
        oldPrice: 99,
        rating: 4.5,
        value: 90,
        best: false,
        icon: "🏋️"
    },

    {
        name: "Wilson Tennis Racket",
        brand: "Wilson",
        category: "Sports",
        price: 109,
        oldPrice: 139,
        rating: 4.6,
        value: 91,
        best: false,
        icon: "⚽"
    },

    {
        name: "Kindle Paperwhite",
        brand: "Amazon",
        category: "Books",
        price: 139,
        oldPrice: 159,
        rating: 4.8,
        value: 95,
        best: true,
        icon: "📚"
    },

    {
        name: "LEGO Technic Car",
        brand: "LEGO",
        category: "Toys",
        price: 49,
        oldPrice: 59,
        rating: 4.8,
        value: 94,
        best: true,
        icon: "🧸"
    },

    {
        name: "Baby Stroller",
        brand: "Graco",
        category: "Baby",
        price: 149,
        oldPrice: 189,
        rating: 4.6,
        value: 90,
        best: false,
        icon: "👶"
    },

    {
        name: "Car Emergency Kit",
        brand: "AstroAI",
        category: "Automotive",
        price: 39,
        oldPrice: 49,
        rating: 4.5,
        value: 91,
        best: false,
        icon: "🚗"
    },

    {
        name: "DEWALT Cordless Drill",
        brand: "DEWALT",
        category: "Tools",
        price: 129,
        oldPrice: 159,
        rating: 4.8,
        value: 95,
        best: true,
        icon: "🔧"
    },

    {
        name: "Samsonite Carry-On",
        brand: "Samsonite",
        category: "Travel",
        price: 99,
        oldPrice: 129,
        rating: 4.6,
        value: 91,
        best: false,
        icon: "✈️"
    },

    {
        name: "HP Wireless Keyboard",
        brand: "HP",
        category: "Office & Study",
        price: 39,
        oldPrice: 49,
        rating: 4.5,
        value: 89,
        best: false,
        icon: "📓"
    },

    {
        name: "Maybelline Makeup Set",
        brand: "Maybelline",
        category: "Beauty",
        price: 29,
        oldPrice: 39,
        rating: 4.5,
        value: 90,
        best: false,
        icon: "💄"
    }

];

// =========================================================
// ELEMENTS
// =========================================================

const categoryGrid =
    document.getElementById(
        "categoryGrid"
    );


const productGrid =
    document.getElementById(
        "productGrid"
    );


const exploreSearch =
    document.getElementById(
        "exploreSearch"
    );


const exploreSearchButton =
    document.getElementById(
        "exploreSearchButton"
    );


const sortProducts =
    document.getElementById(
        "sortProducts"
    );


// =========================================================
// LOAD PRODUCTS
// =========================================================

function loadProducts() {

    displayProducts(
        products
    );

}

// =========================================================
// DISPLAY CATEGORIES
// =========================================================

function displayCategories() {

    if (!categoryGrid) {
        return;
    }


    categoryGrid.innerHTML = "";


    categories.forEach(
        category => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "category-card";


            card.innerHTML = `

                <div class="category-icon">
                    ${category.icon}
                </div>

                <h3>
                    ${category.name}
                </h3>

                <p>
                    Explore products
                </p>

            `;


            card.addEventListener(
                "click",
                function() {

                    const techCategories = [
    "Smartphones",
    "Laptops",
    "Gadgets",
    "Gaming",
    "Gaming Accessories",
    "Headphones & Audio"
];


const matchingProducts =
    category.name === "Tech"

        ? products.filter(
            product =>
                techCategories.includes(
                    product.category
                )
          )

        : products.filter(
            product =>
                product.category ===
                category.name
          );


                    displayProducts(
                        matchingProducts
                    );


                    const productsSection =
                        document.querySelector(
                            ".products-section"
                        );


                    if (productsSection) {

                        productsSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );


            categoryGrid.appendChild(
                card
            );

        }
    );

}

// =========================================================
// SAVED PRODUCTS
// =========================================================

function getExploreSavedProductsKey() {

    let user = null;

    try {

        user =
            JSON.parse(
                localStorage.getItem("usaUser") ||
                localStorage.getItem("buyBuddyUser")
            );

    } catch (error) {

        user = null;

    }


    const email =
        user && user.email
            ? String(user.email)
                .trim()
                .toLowerCase()
            : "guest";


    return "usaSavedProducts_" +
        encodeURIComponent(
            email || "guest"
        );

}


function getExploreSavedProducts() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    getExploreSavedProductsKey()
                )
            );


        return Array.isArray(saved)
            ? saved
            : [];

    } catch (error) {

        return [];

    }

}


function getExploreSavedProductKey(
    product
) {

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


function isExploreProductSaved(
    product
) {

    const key =
        getExploreSavedProductKey(
            product
        );


    return getExploreSavedProducts()
        .some(
            savedProduct =>
                getExploreSavedProductKey(
                    savedProduct
                ) === key
        );

}


function toggleExploreSavedProduct(
    product
) {

    const savedProducts =
        getExploreSavedProducts();


    const key =
        getExploreSavedProductKey(
            product
        );


    const existingIndex =
        savedProducts.findIndex(
            savedProduct =>
                getExploreSavedProductKey(
                    savedProduct
                ) === key
        );


    if (existingIndex >= 0) {

        savedProducts.splice(
            existingIndex,
            1
        );

    } else {

        savedProducts.unshift(
            product
        );

    }


    localStorage.setItem(
        getExploreSavedProductsKey(),
        JSON.stringify(
            savedProducts
        )
    );


    displayExploreSliders(
        window.currentExploreProducts ||
        products
    );

}

// =========================================================
// EXPLORE PRODUCT CARD
// =========================================================

function createExploreProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    const oldPrice =
        product.oldPrice
            ? `$${product.oldPrice}`
            : "";


    const isSaved =
        isExploreProductSaved(
            product
        );


    card.innerHTML = `

        ${
            product.best
                ? `
                    <div class="best-badge">
                        ⭐ BEST VALUE
                    </div>
                  `
                : ""
        }


        <div class="product-image">

            <button
                class="explore-save-button"
                type="button"
                title="${
                    isSaved
                        ? "Remove from saved"
                        : "Save product"
                }"
            >
                ${
                    isSaved
                        ? "♥"
                        : "♡"
                }
            </button>


            <span class="explore-product-icon">
                ${product.icon}
            </span>

        </div>


        <div class="product-info">

            <div class="product-category">
                ${product.category}
            </div>


            <h3 class="product-name">
                ${product.name}
            </h3>


            <p class="product-brand">
                ${product.brand}
            </p>


            <div class="product-rating">
                ★ ${product.rating}
            </div>


            <div class="product-price">

                <span class="price">
                    $${product.price}
                </span>

                ${
                    oldPrice
                        ? `
                            <span class="old-price">
                                ${oldPrice}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="value-score">
                USA Value Score:
                ${product.value}/100
            </div>


            <button
                class="product-button"
                type="button"
            >
                View Product
            </button>

        </div>

    `;


    const saveButton =
        card.querySelector(
            ".explore-save-button"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                toggleExploreSavedProduct(
                    product
                );

            }
        );

    }


    const viewButton =
        card.querySelector(
            ".product-button"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            function() {

                viewProduct(
                    product.name
                );

            }
        );

    }


    return card;

}
// =========================================================
// DISPLAY ONE SLIDER
// =========================================================

function displayExploreSlider(
    sliderId,
    productList
) {

    const slider =
        document.getElementById(
            sliderId
        );


    if (!slider) {
        return;
    }


    slider.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        slider.innerHTML = `

            <p style="
                width:100%;
                text-align:center;
                padding:30px;
            ">
                No products found.
            </p>

        `;

        return;

    }


    productList
        .slice(0, 8)
        .forEach(
            product => {

                slider.appendChild(
                    createExploreProductCard(
                        product
                    )
                );

            }
        );

}


// =========================================================
// DISPLAY ALL FOUR SLIDERS
// =========================================================

function displayExploreSliders(
    productList
) {
        window.currentExploreProducts =
        Array.isArray(productList)
            ? productList
            : [];

    const sourceProducts =
        Array.isArray(productList)
            ? [...productList]
            : [];


    const bestValue =
        [...sourceProducts].sort(
            (a, b) =>
                b.value - a.value
        );


    const lowestPrice =
        [...sourceProducts].sort(
            (a, b) =>
                a.price - b.price
        );


    const topRated =
        [...sourceProducts].sort(
            (a, b) =>
                b.rating - a.rating
        );


    const trending =
        [...sourceProducts].filter(
            product =>
                product.rating >= 4.6
        );


    displayExploreSlider(
        "bestValue",
        bestValue
    );


    displayExploreSlider(
        "lowestPrice",
        lowestPrice
    );


    displayExploreSlider(
        "topRated",
        topRated
    );


    displayExploreSlider(
        "trending",
        trending
    );

}
// =========================================================
// DISPLAY PRODUCTS
// =========================================================
function displayProducts(
    productList
) {

    displayExploreSliders(
        productList
    );

}

// =========================================================
// SEARCH
// =========================================================

function performExploreSearch() {

    if (!exploreSearch) {
        return;
    }


    const query =
        exploreSearch.value
            .trim()
            .toLowerCase();


    if (!query) {

        displayProducts(
            products
        );

        return;

    }


    const results =
        products.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.brand
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

        );


    displayProducts(
        results
    );


    const productsSection =
        document.querySelector(
            ".products-section"
        );


    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// =========================================================
// SEARCH BUTTON
// =========================================================

if (exploreSearchButton) {

    exploreSearchButton.addEventListener(
        "click",
        performExploreSearch
    );

}


// =========================================================
// SEARCH ENTER KEY
// =========================================================

if (exploreSearch) {

    exploreSearch.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performExploreSearch();

            }

        }
    );

}


// =========================================================
// FILTERS
// =========================================================

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                const filter =
                    this.dataset.filter;


                let filteredProducts =
                    [...products];


                if (
                    filter ===
                    "under50"
                ) {

                    filteredProducts =
                        products.filter(
                            product =>
                                product.price < 50
                        );

                }


                if (
                    filter ===
                    "under100"
                ) {

                    filteredProducts =
                        products.filter(
                            product =>
                                product.price < 100
                        );

                }


                if (
                    filter ===
                    "best"
                ) {

                    filteredProducts =
                        products.filter(
                            product =>
                                product.best === true
                        );

                }


                displayProducts(
                    filteredProducts
                );

            }
        );

    }
);


// =========================================================
// SORT
// =========================================================

if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        function() {

            let sorted =
                [...products];


            if (
                this.value ===
                "low"
            ) {

                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }


            if (
                this.value ===
                "high"
            ) {

                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }


            if (
                this.value ===
                "rating"
            ) {

                sorted.sort(
                    (a, b) =>
                        b.rating - a.rating
                );

            }


            if (
                this.value ===
                "recommended"
            ) {

                sorted.sort(
                    (a, b) =>
                        b.value - a.value
                );

            }


            displayProducts(
                sorted
            );

        }
    );

}


// =========================================================
// PRODUCT BUTTON
// =========================================================

function viewProduct(
    productName
) {

    alert(

        "USA Product Details\n\n" +

        productName +

        "\n\n" +

        "Product detail page " +

        "will be connected later."

    );

}


// =========================================================
// FIND PRODUCT BUTTON
// =========================================================

const findProductButton =
    document.getElementById(
        "findProductButton"
    );


if (findProductButton) {

    findProductButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "../search/search.html";

        }
    );

}


// =========================================================
// ACCOUNT
// =========================================================

const accountButton =
    document.getElementById(
        "accountButton"
    );


if (accountButton) {

    let accountDropdown =
        document.getElementById(
            "exploreAccountDropdown"
        );


    if (!accountDropdown) {

        accountDropdown =
            document.createElement(
                "div"
            );

        accountDropdown.id =
            "exploreAccountDropdown";

        accountDropdown.style.cssText = `
            position: fixed;
            top: 75px;
            right: 25px;
            width: 300px;
            background: #ffffff;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
            border: 1px solid #eeeeee;
            display: none;
            z-index: 9999;
        `;


        accountDropdown.innerHTML = `

            <div style="
                display:flex;
                align-items:center;
                gap:14px;
                margin-bottom:18px;
            ">

                <div
                    id="exploreProfilePicture"
                    style="
                        width:50px;
                        height:50px;
                        border-radius:50%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#111;
                        color:#fff;
                        font-weight:700;
                        font-size:18px;
                    "
                >
                    U
                </div>


                <div>

                    <h3
                        id="exploreProfileName"
                        style="
                            margin:0;
                            font-size:17px;
                        "
                    >
                        User
                    </h3>


                    <p
                        id="exploreProfileEmail"
                        style="
                            margin:4px 0 0;
                            color:#777;
                            font-size:13px;
                        "
                    >
                        user@gmail.com
                    </p>

                </div>

            </div>


            <div style="
                border-top:1px solid #eeeeee;
                margin:15px 0;
            "></div>


            <div style="
                font-size:14px;
                line-height:1.9;
            ">

                <div>
                    👤
                    <strong>Name:</strong>
                    <span id="exploreAccountName">
                        User
                    </span>
                </div>


                <div>
                    📧
                    <strong>Email:</strong>
                    <span id="exploreAccountEmail">
                        user@gmail.com
                    </span>
                </div>

            </div>


            <button
                id="exploreLogoutButton"
                type="button"
                style="
                    width:100%;
                    margin-top:18px;
                    padding:11px;
                    border:none;
                    border-radius:10px;
                    background:#111;
                    color:#fff;
                    cursor:pointer;
                    font-size:14px;
                "
            >
                Log Out
            </button>

        `;


        document.body.appendChild(
            accountDropdown
        );

    }


    function updateExploreAccount() {

        let user = null;


        try {

            user =
                JSON.parse(
                    localStorage.getItem(
                        "usaUser"
                    ) ||
                    localStorage.getItem(
                        "buyBuddyUser"
                    )
                );

        } catch (error) {

            user = null;

        }


        if (!user) {

            alert(
                "Please login to view your account."
            );

            return;

        }


        const fullName =
            (
                user.firstName +
                " " +
                user.lastName
            ).trim();


        const initials =
            (
                user.firstName.charAt(0) +
                user.lastName.charAt(0)
            ).toUpperCase();


        document.getElementById(
            "exploreProfileName"
        ).textContent =
            fullName;


        document.getElementById(
            "exploreProfileEmail"
        ).textContent =
            user.email;


        document.getElementById(
            "exploreAccountName"
        ).textContent =
            fullName;


        document.getElementById(
            "exploreAccountEmail"
        ).textContent =
            user.email;


        document.getElementById(
            "exploreProfilePicture"
        ).textContent =
            initials;


        accountDropdown.style.display =
            accountDropdown.style.display === "none"
                ? "block"
                : "none";

    }


    accountButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            updateExploreAccount();

        }
    );


    document.addEventListener(
        "click",
        function(event) {

            if (
                !accountDropdown.contains(
                    event.target
                ) &&
                !accountButton.contains(
                    event.target
                )
            ) {

                accountDropdown.style.display =
                    "none";

            }

        }
    );


    const exploreLogoutButton =
        document.getElementById(
            "exploreLogoutButton"
        );


    if (exploreLogoutButton) {

        exploreLogoutButton.addEventListener(
            "click",
            function() {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to log out?"
                    );


                if (confirmLogout) {

                    localStorage.removeItem(
                        "usaLoggedIn"
                    );


                    localStorage.removeItem(
                        "buyBuddyLoggedIn"
                    );


                    window.location.href =
                        "../../index.html";

                }

            }
        );

    }

}

// =========================================================
// WISHLIST
// =========================================================

const wishlistButton =
    document.getElementById(
        "wishlistButton"
    );


function getExploreSavedProductsKey() {

    let user = null;

    try {

        user =
            JSON.parse(
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
        encodeURIComponent(
            email || "guest"
        );

}


function getExploreSavedProducts() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    getExploreSavedProductsKey()
                )
            );


        return Array.isArray(saved)
            ? saved
            : [];

    } catch (error) {

        return [];

    }

}


function getExploreProductKey(product) {

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


function showExploreWishlist() {

    const existing =
        document.getElementById(
            "exploreWishlistOverlay"
        );


    if (existing) {

        existing.remove();

        document.body.style.overflow = "";

        return;

    }


    const savedProducts =
        getExploreSavedProducts();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "exploreWishlistOverlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99999;
        background:rgba(0,0,0,0.45);
        backdrop-filter:blur(6px);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:24px;
    `;


    const panel =
        document.createElement(
            "div"
        );


    panel.style.cssText = `
        width:min(1000px,100%);
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
                    Save products from your search
                    results and they will appear here.
                </p>

            </div>

        `;

    } else {

        productsHTML = `

            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(260px,1fr));
                gap:20px;
            ">

                ${
                    savedProducts
                        .map(
                            product => {

                                const image =
                                    product.image
                                        ? `
                                            <img
                                                src="${String(product.image).replace(/"/g, "&quot;")}"
                                                alt="${String(product.name || "").replace(/"/g, "&quot;")}"
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


                                const price =
                                    product.priceDisplay ||
                                    (
                                        Number(product.price) > 0
                                            ? (
                                                String(
                                                    product.currency || ""
                                                ).toUpperCase() === "PKR"
                                                    ? "Rs. " + Number(product.price).toLocaleString()
                                                    : String(
                                                        product.currency || ""
                                                    ).toUpperCase() === "USD"
                                                        ? "$" + Number(product.price).toLocaleString()
                                                        : (
                                                            String(
                                                                product.currency || ""
                                                            ).toUpperCase()
                                                            + " " +
                                                            Number(product.price).toLocaleString()
                                                        )
                                              )
                                            : "Price unavailable"
                                    );


                                return `

                                    <div style="
                                        border:1px solid #eeeeee;
                                        border-radius:18px;
                                        padding:14px;
                                        background:#fff;
                                    ">

                                        ${image}


                                        <div style="
                                            padding:14px 4px 4px;
                                        ">

                                            <div style="
                                                font-size:12px;
                                                color:#888;
                                                margin-bottom:5px;
                                            ">
                                                ${product.brand || product.source || ""}
                                            </div>


                                            <h3 style="
                                                margin:0 0 10px;
                                                font-size:17px;
                                                line-height:1.35;
                                            ">
                                                ${product.name || "Saved Product"}
                                            </h3>


                                            <div style="
                                                font-size:18px;
                                                font-weight:700;
                                                margin-bottom:12px;
                                            ">
                                                ${price}
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
                                                                href="${product.url}"
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
                                                    class="explore-remove-saved"
                                                    data-key="${getExploreProductKey(product).replace(/"/g, "&quot;")}"
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
                        .join("")
                }

            </div>

        `;

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
                id="closeExploreWishlist"
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


    overlay.appendChild(
        panel
    );


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";


    const closeButton =
        document.getElementById(
            "closeExploreWishlist"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                overlay.remove();

                document.body.style.overflow = "";

            }
        );

    }


    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target === overlay
            ) {

                overlay.remove();

                document.body.style.overflow = "";

            }

        }
    );


    panel
        .querySelectorAll(
            ".explore-remove-saved"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const key =
                            button.dataset.key;


                        const updated =
                            savedProducts.filter(
                                product =>
                                    getExploreProductKey(product) !== key
                            );


                        localStorage.setItem(
                            getExploreSavedProductsKey(),
                            JSON.stringify(updated)
                        );


                        showExploreWishlist();

                    }
                );

            }
        );

}


if (wishlistButton) {

    wishlistButton.addEventListener(
        "click",
        function() {

            showExploreWishlist();

        }
    );

}

// =========================================================
// START
// =========================================================

displayCategories();

loadProducts();