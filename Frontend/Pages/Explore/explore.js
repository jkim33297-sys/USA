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
// =========================================================

let products = [];


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
// LOAD PRODUCTS FROM SQLITE DATABASE
// =========================================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Could not load products."
            );

        }


        products =
            data.products;


        console.log(
            "Products loaded from database:",
            products
        );


        displayProducts(
            products
        );


    } catch (error) {

        console.error(
            "Database product loading error:",
            error
        );


        if (productGrid) {

            productGrid.innerHTML = `

                <p style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px;
                ">

                    Could not load products
                    from the database.

                    <br><br>

                    Make sure Flask is running.

                </p>

            `;

        }

    }

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

                    const matchingProducts =
                        products.filter(
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
// DISPLAY PRODUCTS
// =========================================================

function displayProducts(
    productList
) {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        productGrid.innerHTML = `

            <p style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">

                No products found.

            </p>

        `;

        return;

    }


    productList.forEach(
        product => {

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


            card.innerHTML = `

                ${
                    product.best
                    ?
                    `
                    <div class="best-badge">
                        ⭐ BEST VALUE
                    </div>
                    `
                    :
                    ""
                }


                <div class="product-image">

                    ${product.icon}

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
                            ?
                            `
                            <span class="old-price">

                                ${oldPrice}

                            </span>
                            `
                            :
                            ""
                        }

                    </div>


                    <div class="value-score">

                        USA Value Score:
                        ${product.value}/100

                    </div>


                    <button
                        class="product-button"
                        onclick="viewProduct('${product.name.replace(/'/g, "\\'")}')"
                    >

                        View Product

                    </button>


                </div>

            `;


            productGrid.appendChild(
                card
            );

        }
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

    accountButton.addEventListener(
        "click",
        function() {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "buyBuddyUser"
                    )
                );


            if (user) {

                alert(

                    "Account\n\n" +

                    user.firstName +
                    " " +
                    user.lastName +

                    "\n" +

                    user.email

                );

            } else {

                alert(
                    "Please login to view your account."
                );

            }

        }
    );

}


// =========================================================
// WISHLIST
// =========================================================

const wishlistButton =
    document.getElementById(
        "wishlistButton"
    );


if (wishlistButton) {

    wishlistButton.addEventListener(
        "click",
        function() {

            alert(
                "Your wishlist will appear here."
            );

        }
    );

}


// =========================================================
// START
// =========================================================

displayCategories();

loadProducts();