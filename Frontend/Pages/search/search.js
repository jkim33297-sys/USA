/* =====================================================
   USA SEARCH PAGE
   Dynamic filters for all categories
===================================================== */


/* =====================================================
   GLOBAL STATE
===================================================== */

let allProducts = [];

let displayedProducts = [];

let currentCategory = "All";

let currentSearch = "";

let activeFilters = {
    price: null,
    rating: null,
    brands: [],
    features: []
};


/* =====================================================
   ELEMENTS
===================================================== */

const productGrid =
    document.getElementById("productGrid");

const dynamicFilters =
    document.getElementById("dynamicFilters");

const searchQuery =
    document.getElementById("searchQuery");

const resultCount =
    document.getElementById("resultCount");

const productsFound =
    document.getElementById("productsFound");

const emptyState =
    document.getElementById("emptyState");

const sortSelect =
    document.getElementById("sortSelect");

const clearFiltersButton =
    document.getElementById("clearFilters");

const topSearch =
    document.getElementById("topSearch");

const topSearchButton =
    document.getElementById("topSearchButton");


/* =====================================================
   CATEGORY BUTTONS
===================================================== */

const categoryButtons =
    document.querySelectorAll(".category-btn");


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        currentSearch =
            params.get("query") ||
            params.get("q") ||
            "";

        if (currentSearch) {
            topSearch.value = currentSearch;
        }

        let url = "/api/products";

        if (currentSearch) {

            url =
                "/api/search?q=" +
                encodeURIComponent(currentSearch);

        }

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Could not load products."
            );

        }

        const data =
            await response.json();

        if (Array.isArray(data)) {

            allProducts = data;

        } else if (Array.isArray(data.products)) {

            allProducts = data.products;

        } else if (Array.isArray(data.results)) {

            allProducts = data.results;

        } else {

            allProducts = [];

        }

        allProducts =
            allProducts.map(normalizeProduct);

        if (currentSearch) {

            searchQuery.textContent =
                currentSearch;

        } else {

            searchQuery.textContent =
                "Find the best products for you";

        }

        applyFilters();

    } catch (error) {

        console.error(
            "USA search error:",
            error
        );

        allProducts = [];

        renderFilters([]);

        renderProducts([]);

        resultCount.textContent =
            "Unable to load products. Make sure the USA backend is running.";

    }

}


/* =====================================================
   NORMALIZE PRODUCT
===================================================== */

function normalizeProduct(product) {

    return {

        id:
            product.id ??
            product.product_id ??
            Math.random(),

        name:
            product.name ??
            product.title ??
            "Unknown Product",

        brand:
            product.brand ??
            product.manufacturer ??
            "Unknown Brand",

        category:
            product.category ??
            "Other",

        price:
            Number(
                product.price ?? 0
            ),

        oldPrice:
            Number(
                product.oldPrice ??
                product.old_price ??
                0
            ),

        rating:
            Number(
                product.rating ?? 0
            ),

        quality:
            Number(
                product.quality ??
                product.value ??
                0
            ),

        value:
            Number(
                product.value ??
                product.quality ??
                0
            ),

        reviews:
            Number(
                product.reviews ?? 0
            ),

        image:
            product.image ??
            "",

        icon:
            product.icon ??
            getCategoryIcon(
                product.category
            ),

        url:
            product.url ??
            product.link ??
            "#",

        source:
            product.source ??
            product.store ??
            "USA",

        availability:
            product.availability ??
            "Available",

        specifications:
            product.specifications ??
            product.specs ??
            {},

        features:
            product.features ??
            []

    };

}


/* =====================================================
   APPLY FILTERS
===================================================== */

function applyFilters() {

    let products =
        [...allProducts];


    if (currentCategory !== "All") {

        products =
            products.filter(
                product =>
                    product.category ===
                    currentCategory
            );

    }


    if (currentSearch) {

        const query =
            currentSearch.toLowerCase();

        products =
            products.filter(product => {

                const searchableText =
                    [
                        product.name,
                        product.brand,
                        product.category,
                        product.description,
                        JSON.stringify(
                            product.specifications
                        ),
                        JSON.stringify(
                            product.features
                        )
                    ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(query)
                    || productMatchesSearchIntent(
                        product,
                        query
                    );

            });

    }


    if (activeFilters.price !== null) {

        products =
            products.filter(
                product =>
                    product.price <=
                    activeFilters.price
            );

    }


    if (activeFilters.rating !== null) {

        products =
            products.filter(
                product =>
                    product.rating >=
                    activeFilters.rating
            );

    }


    if (activeFilters.brands.length > 0) {

        products =
            products.filter(
                product =>
                    activeFilters.brands.includes(
                        product.brand
                    )
            );

    }


    if (activeFilters.features.length > 0) {

        products =
            products.filter(product => {

                return activeFilters.features.every(
                    feature =>
                        productHasFeature(
                            product,
                            feature
                        )
                );

            });

    }


    products =
        sortProducts(
            products,
            sortSelect.value
        );


    displayedProducts =
        products;


    renderFilters(
        getCategoryProducts()
    );


    renderProducts(
        displayedProducts
    );


    updateRecommendations(
        displayedProducts
    );

}


/* =====================================================
   GET CATEGORY PRODUCTS
===================================================== */

function getCategoryProducts() {

    let products =
        [...allProducts];


    if (currentCategory !== "All") {

        products =
            products.filter(
                product =>
                    product.category ===
                    currentCategory
            );

    }


    if (currentSearch) {

        const query =
            currentSearch.toLowerCase();

        const searchResults =
            products.filter(product => {

                const text =
                    [
                        product.name,
                        product.brand,
                        product.category,
                        JSON.stringify(
                            product.specifications
                        ),
                        JSON.stringify(
                            product.features
                        )
                    ]
                    .join(" ")
                    .toLowerCase();

                return text.includes(query)
                    || productMatchesSearchIntent(
                        product,
                        query
                    );

            });


        if (searchResults.length > 0) {

            products =
                searchResults;

        }

    }


    return products;

}


/* =====================================================
   DYNAMIC FILTER GENERATOR
===================================================== */

function renderFilters(products) {

    dynamicFilters.innerHTML = "";


    if (!products.length) {

        dynamicFilters.innerHTML = `
            <div class="filter-empty">
                No filters are available for
                this category yet.
            </div>
        `;

        return;

    }


    renderPriceFilter(
        products
    );


    renderRatingFilter(
        products
    );


    renderBrandFilter(
        products
    );


    renderFeatureFilter(
        products
    );

}


/* =====================================================
   PRICE FILTER
===================================================== */

function renderPriceFilter(products) {

    const prices =
        products
            .map(product => Number(product.price))
            .filter(price => price > 0);


    if (!prices.length) {

        return;

    }


    const maxPrice =
        Math.max(...prices);


    let values = [];


    if (maxPrice <= 50) {

        values = [
            10,
            20,
            30,
            50
        ];

    } else if (maxPrice <= 100) {

        values = [
            25,
            50,
            75,
            100
        ];

    } else if (maxPrice <= 250) {

        values = [
            50,
            100,
            150,
            250
        ];

    } else if (maxPrice <= 500) {

        values = [
            100,
            200,
            300,
            500
        ];

    } else if (maxPrice <= 1000) {

        values = [
            250,
            500,
            750,
            1000
        ];

    } else {

        values = [
            250,
            500,
            1000,
            Math.ceil(maxPrice)
        ];

    }


    values =
        values.filter(
            price =>
                prices.some(
                    productPrice =>
                        productPrice <= price
                )
        );


    values =
        [...new Set(values)]
            .sort(
                (a, b) => a - b
            );


    if (!values.length) {

        return;

    }


    const section =
        createFilterSection(
            "Price"
        );


    values.forEach(
        price => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "filter-label";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "radio";

            input.name =
                "dynamic-price";

            input.value =
                price;


            if (
                Number(
                    activeFilters.price
                ) === price
            ) {

                input.checked =
                    true;

            }


            input.addEventListener(
                "change",
                () => {

                    activeFilters.price =
                        Number(
                            input.value
                        );

                    applyFilters();

                }
            );


            label.appendChild(
                input
            );


            label.appendChild(
                document.createTextNode(
                    ` Under $${price}`
                )
            );


            const count =
                prices.filter(
                    productPrice =>
                        productPrice <= price
                ).length;


            const countSpan =
                document.createElement(
                    "span"
                );

            countSpan.className =
                "filter-count";

            countSpan.textContent =
                count;


            label.appendChild(
                countSpan
            );


            section.appendChild(
                label
            );

        }
    );


    dynamicFilters.appendChild(
        section
    );

}


/* =====================================================
   RATING FILTER
===================================================== */

function renderRatingFilter(products) {

    const ratings =
        products
            .map(product => product.rating)
            .filter(rating => rating > 0);


    if (!ratings.length) {

        return;

    }


    const section =
        createFilterSection(
            "Rating"
        );


    const ratingOptions = [
        4.5,
        4,
        3.5,
        3
    ];


    const availableRatings =
        ratingOptions.filter(
            rating =>
                ratings.some(
                    productRating =>
                        productRating >=
                        rating
                )
        );


    availableRatings.forEach(
        rating => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "filter-label";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "radio";

            input.name =
                "dynamic-rating";

            input.value =
                rating;


            if (
                Number(
                    activeFilters.rating
                ) === rating
            ) {

                input.checked =
                    true;

            }


            input.addEventListener(
                "change",
                () => {

                    activeFilters.rating =
                        Number(
                            input.value
                        );

                    applyFilters();

                }
            );


            label.appendChild(
                input
            );


            label.appendChild(
                document.createTextNode(
                    ` ★ ${rating} & above`
                )
            );


            section.appendChild(
                label
            );

        }
    );


    dynamicFilters.appendChild(
        section
    );

}


/* =====================================================
   BRAND FILTER
===================================================== */

function renderBrandFilter(products) {

    const brands =
        [
            ...new Set(
                products
                    .map(product =>
                        product.brand
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    if (!brands.length) {

        return;

    }


    const section =
        createFilterSection(
            "Brand"
        );


    brands.forEach(
        brand => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "filter-label";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "checkbox";

            input.className =
                "brand-filter";

            input.value =
                brand;


            if (
                activeFilters.brands.includes(
                    brand
                )
            ) {

                input.checked =
                    true;

            }


            input.addEventListener(
                "change",
                () => {

                    if (input.checked) {

                        activeFilters.brands.push(
                            brand
                        );

                    } else {

                        activeFilters.brands =
                            activeFilters.brands.filter(
                                item =>
                                    item !== brand
                            );

                    }

                    applyFilters();

                }
            );


            label.appendChild(
                input
            );


            label.appendChild(
                document.createTextNode(
                    ` ${brand}`
                )
            );


            const count =
                products.filter(
                    product =>
                        product.brand ===
                        brand
                ).length;


            const countSpan =
                document.createElement(
                    "span"
                );

            countSpan.className =
                "filter-count";

            countSpan.textContent =
                count;


            label.appendChild(
                countSpan
            );


            section.appendChild(
                label
            );

        }
    );


    dynamicFilters.appendChild(
        section
    );

}


/* =====================================================
   FEATURE FILTER
===================================================== */

function renderFeatureFilter(products) {

    const features =
        extractFeatures(
            products
        );


    if (!features.length) {

        return;

    }


    const section =
        createFilterSection(
            "Features"
        );


    features.forEach(
        feature => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "filter-label";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "checkbox";

            input.className =
                "feature-filter";

            input.value =
                feature;


            if (
                activeFilters.features.includes(
                    feature
                )
            ) {

                input.checked =
                    true;

            }


            input.addEventListener(
                "change",
                () => {

                    if (input.checked) {

                        activeFilters.features.push(
                            feature
                        );

                    } else {

                        activeFilters.features =
                            activeFilters.features.filter(
                                item =>
                                    item !== feature
                            );

                    }

                    applyFilters();

                }
            );


            label.appendChild(
                input
            );


            label.appendChild(
                document.createTextNode(
                    ` ${feature}`
                )
            );


            section.appendChild(
                label
            );

        }
    );


    dynamicFilters.appendChild(
        section
    );

}


/* =====================================================
   CREATE FILTER SECTION
===================================================== */

function createFilterSection(title) {

    const section =
        document.createElement(
            "div"
        );

    section.className =
        "filter-section";


    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        title;


    section.appendChild(
        heading
    );


    return section;

}


/* =====================================================
   EXTRACT FEATURES
===================================================== */

function extractFeatures(products) {

    const featureSet =
        new Set();


    products.forEach(
        product => {

            if (
                Array.isArray(
                    product.features
                )
            ) {

                product.features.forEach(
                    feature => {

                        if (feature) {

                            featureSet.add(
                                String(
                                    feature
                                )
                            );

                        }

                    }
                );

            }


            if (
                product.specifications &&
                typeof product.specifications ===
                "object"
            ) {

                Object.entries(
                    product.specifications
                ).forEach(
                    ([key, value]) => {

                        if (
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                        ) {

                            featureSet.add(
                                `${key}: ${value}`
                            );

                        }

                    }
                );

            }


            const name =
                product.name.toLowerCase();


            const commonFeatures = [

                "wireless",
                "bluetooth",
                "gaming",
                "portable",
                "smart",
                "noise cancelling",
                "5g",
                "ssd",
                "usb-c",
                "led",
                "adjustable",
                "compact"

            ];


            commonFeatures.forEach(
                feature => {

                    if (
                        name.includes(
                            feature
                        )
                    ) {

                        featureSet.add(
                            capitalizeWords(
                                feature
                            )
                        );

                    }

                }
            );

        }
    );


    return [
        ...featureSet
    ].sort();

}


/* =====================================================
   PRODUCT HAS FEATURE
===================================================== */

function productHasFeature(
    product,
    requestedFeature
) {

    const featureText =
        [

            product.name,

            product.brand,

            JSON.stringify(
                product.features
            ),

            JSON.stringify(
                product.specifications
            )

        ]
        .join(" ")
        .toLowerCase();


    return featureText.includes(
        requestedFeature.toLowerCase()
    );

}


/* =====================================================
   SEARCH INTENT
===================================================== */

function productMatchesSearchIntent(
    product,
    query
) {

    const category =
        String(
            product.category
        ).toLowerCase();


    const name =
        String(
            product.name
        ).toLowerCase();


    const aliases = {

        phone: [
            "phones",
            "smartphone",
            "smartphones"
        ],

        laptop: [
            "laptops"
        ],

        headphone: [
            "headphones",
            "audio"
        ],

        shoe: [
            "shoes"
        ],

        watch: [
            "watches"
        ],

        camera: [
            "cameras"
        ],

        game: [
            "gaming"
        ],

        beauty: [
            "beauty"
        ]

    };


    for (
        const [keyword, values]
        of Object.entries(aliases)
    ) {

        if (
            query.includes(keyword)
        ) {

            if (
                values.includes(
                    category
                )
                ||
                name.includes(keyword)
            ) {

                return true;

            }

        }

    }


    return false;

}


/* =====================================================
   SORT PRODUCTS
===================================================== */

function sortProducts(
    products,
    type
) {

    const sorted =
        [...products];


    if (type === "price") {

        sorted.sort(
            (a, b) =>
                a.price -
                b.price
        );

    } else if (type === "rating") {

        sorted.sort(
            (a, b) =>
                b.rating -
                a.rating
        );

    } else if (type === "quality") {

        sorted.sort(
            (a, b) =>
                b.quality -
                a.quality
        );

    } else {

        sorted.sort(
            (a, b) =>
                b.value -
                a.value
        );

    }


    return sorted;

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    products
) {

    productGrid.innerHTML = "";


    productsFound.textContent =
        `${products.length} product${products.length === 1 ? "" : "s"} found`;


    resultCount.textContent =
        products.length
            ? `${products.length} products match your current selection.`
            : "No products match your current filters.";


    emptyState.hidden =
        products.length !== 0;


    if (!products.length) {

        return;

    }


    products.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            productGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    const image =
        product.image
            ? `
                <img
                    src="${escapeHtml(product.image)}"
                    alt="${escapeHtml(product.name)}"
                >
              `
            : `
                <span>
                    ${product.icon}
                </span>
              `;


    const oldPrice =
        product.oldPrice > product.price
            ? `
                <span class="old-price">
                    $${product.oldPrice.toFixed(2)}
                </span>
              `
            : "";


    card.innerHTML = `

        <div class="product-image">
            ${image}
        </div>

        <div class="product-info">

            <div class="product-brand">
                ${escapeHtml(product.brand)}
            </div>

            <div class="product-name">
                ${escapeHtml(product.name)}
            </div>

            <div class="product-rating">
                ⭐
                <span>
                    ${product.rating.toFixed(1)}
                </span>

                ${
                    product.reviews
                        ? `(${product.reviews} reviews)`
                        : ""
                }
            </div>

            <div class="product-price-row">

                <span class="product-price">
                    $${product.price.toFixed(2)}
                </span>

                ${oldPrice}

            </div>

            <div class="product-value">

                Quality / Value:

                <strong>
                    ${product.quality}/100
                </strong>

            </div>

            <div class="product-actions">

                <button
                    class="why-button"
                    data-id="${product.id}"
                >
                    Why Better?
                </button>

                <button
                    class="view-button"
                    data-url="${escapeHtml(product.url)}"
                >
                    View →
                </button>

            </div>

            <div class="product-source">

                Source:
                ${escapeHtml(product.source)}

            </div>

        </div>

    `;


    const whyButton =
        card.querySelector(
            ".why-button"
        );


    whyButton.addEventListener(
        "click",
        () => {

            openWhyModal(
                product
            );

        }
    );


    const viewButton =
        card.querySelector(
            ".view-button"
        );


    viewButton.addEventListener(
        "click",
        () => {

            if (
                product.url &&
                product.url !== "#"
            ) {

                window.open(
                    product.url,
                    "_blank"
                );

            } else {

                alert(
                    "Product link is not available yet."
                );

            }

        }
    );


    return card;

}


/* =====================================================
   RECOMMENDATIONS
===================================================== */

function updateRecommendations(
    products
) {

    if (!products.length) {

        document.getElementById(
            "bestValueName"
        ).textContent = "-";

        document.getElementById(
            "lowestPriceName"
        ).textContent = "-";

        document.getElementById(
            "bestQualityName"
        ).textContent = "-";

        return;

    }


    const bestValue =
        [...products].sort(
            (a, b) =>
                b.value -
                a.value
        )[0];


    const lowestPrice =
        [...products].sort(
            (a, b) =>
                a.price -
                b.price
        )[0];


    const bestQuality =
        [...products].sort(
            (a, b) =>
                b.quality -
                a.quality
        )[0];


    document.getElementById(
        "bestValueName"
    ).textContent =
        bestValue.name;


    document.getElementById(
        "lowestPriceName"
    ).textContent =
        lowestPrice.name;


    document.getElementById(
        "bestQualityName"
    ).textContent =
        bestQuality.name;

}


/* =====================================================
   WHY BETTER MODAL
===================================================== */

function openWhyModal(
    product
) {

    const modal =
        document.getElementById(
            "whyModal"
        );


    document.getElementById(
        "modalProductName"
    ).textContent =
        product.name;


    document.getElementById(
        "modalProductCategory"
    ).textContent =
        product.category;


    document.getElementById(
        "modalProductPrice"
    ).textContent =
        product.price.toFixed(2);


    document.getElementById(
        "modalProductRating"
    ).textContent =
        product.rating.toFixed(1);


    document.getElementById(
        "modalProductQuality"
    ).textContent =
        product.quality;


    const sameCategory =
        allProducts.filter(
            item =>
                item.category ===
                    product.category &&
                item.id !== product.id
        );


    const cheaperCount =
        sameCategory.filter(
            item =>
                item.price >
                product.price
        ).length;


    const betterRatingCount =
        sameCategory.filter(
            item =>
                item.rating <
                product.rating
        ).length;


    const betterQualityCount =
        sameCategory.filter(
            item =>
                item.quality <
                product.quality
        ).length;


    document.getElementById(
        "priceComparison"
    ).textContent =
        cheaperCount > 0
            ? `Lower price than ${cheaperCount} other product${cheaperCount === 1 ? "" : "s"} in this category.`
            : "This is not the cheapest option in this category.";


    document.getElementById(
        "ratingComparison"
    ).textContent =
        betterRatingCount > 0
            ? `Higher rating than ${betterRatingCount} other product${betterRatingCount === 1 ? "" : "s"} in this category.`
            : "This product does not have the highest rating in this category.";


    document.getElementById(
        "qualityComparison"
    ).textContent =
        betterQualityCount > 0
            ? `Higher quality/value score than ${betterQualityCount} other product${betterQualityCount === 1 ? "" : "s"} in this category.`
            : "This product does not have the highest quality score in this category.";


    const reasons = [];


    if (
        cheaperCount > 0
    ) {

        reasons.push(
            "It offers a competitive price."
        );

    }


    if (
        betterRatingCount > 0
    ) {

        reasons.push(
            "It has a stronger customer rating than several alternatives."
        );

    }


    if (
        betterQualityCount > 0
    ) {

        reasons.push(
            "Its quality/value score is stronger than several alternatives."
        );

    }


    if (!reasons.length) {

        reasons.push(
            "It is a strong option based on the product data currently available to USA."
        );

    }


    document.getElementById(
        "modalReason"
    ).textContent =
        reasons.join(" ");


    const featureContainer =
        document.getElementById(
            "modalFeatures"
        );


    featureContainer.innerHTML = "";


    const features =
        extractProductFeatures(
            product
        );


    if (features.length) {

        const tags =
            document.createElement(
                "div"
            );


        tags.className =
            "feature-tags";


        features.forEach(
            feature => {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "feature-tag";


                tag.textContent =
                    feature;


                tags.appendChild(
                    tag
                );

            }
        );


        featureContainer.appendChild(
            tags
        );

    } else {

        featureContainer.textContent =
            "No detailed features available yet.";

    }


    let verdict =
        "Good choice";


    if (
        product.quality >= 95 &&
        product.rating >= 4.5
    ) {

        verdict =
            "Excellent value and quality";

    } else if (
        product.quality >= 90
    ) {

        verdict =
            "Strong quality choice";

    } else if (
        product.rating >= 4.5
    ) {

        verdict =
            "Highly rated choice";

    }


    document.getElementById(
        "modalVerdict"
    ).textContent =
        verdict;


    modal.classList.add(
        "active"
    );

}


/* =====================================================
   EXTRACT PRODUCT FEATURES
===================================================== */

function extractProductFeatures(
    product
) {

    const features = [];


    if (
        Array.isArray(
            product.features
        )
    ) {

        features.push(
            ...product.features
        );

    }


    if (
        product.specifications &&
        typeof product.specifications ===
        "object"
    ) {

        Object.entries(
            product.specifications
        ).forEach(
            ([key, value]) => {

                if (
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                ) {

                    features.push(
                        `${key}: ${value}`
                    );

                }

            }
        );

    }


    return [
        ...new Set(
            features.map(
                String
            )
        )
    ];

}


/* =====================================================
   CATEGORY CLICK
===================================================== */

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category;


                resetActiveFilters();


                if (
                    currentCategory ===
                    "All"
                ) {

                    searchQuery.textContent =
                        currentSearch ||
                        "Find the best products for you";

                } else {

                    searchQuery.textContent =
                        currentCategory;

                }


                applyFilters();

            }
        );

    }
);


/* =====================================================
   CLEAR FILTERS
===================================================== */

clearFiltersButton.addEventListener(
    "click",
    () => {

        resetActiveFilters();

        applyFilters();

    }
);


/* =====================================================
   RESET FILTERS
===================================================== */

function resetActiveFilters() {

    activeFilters = {

        price: null,

        rating: null,

        brands: [],

        features: []

    };

}


/* =====================================================
   SORT
===================================================== */

sortSelect.addEventListener(
    "change",
    () => {

        applyFilters();

    }
);


/* =====================================================
   TOP SEARCH
===================================================== */

function performTopSearch() {

    const query =
        topSearch.value.trim();


    if (!query) {

        return;

    }


    window.location.href =
        "search.html?query=" +
        encodeURIComponent(
            query
        );

}


topSearchButton.addEventListener(
    "click",
    performTopSearch
);


topSearch.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            performTopSearch();

        }

    }
);


/* =====================================================
   CATEGORY SLIDER
===================================================== */

const categorySlider =
    document.getElementById(
        "categorySlider"
    );


document.getElementById(
    "categoryPrev"
).addEventListener(
    "click",
    () => {

        categorySlider.scrollBy({

            left: -500,

            behavior: "smooth"

        });

    }
);


document.getElementById(
    "categoryNext"
).addEventListener(
    "click",
    () => {

        categorySlider.scrollBy({

            left: 500,

            behavior: "smooth"

        });

    }
);


/* =====================================================
   MODAL CLOSE
===================================================== */

const modal =
    document.getElementById(
        "whyModal"
    );


document.getElementById(
    "modalClose"
).addEventListener(
    "click",
    () => {

        modal.classList.remove(
            "active"
        );

    }
);


modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "active"
            );

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            modal.classList.remove(
                "active"
            );

        }

    }
);


/* =====================================================
   HELPERS
===================================================== */

function getCategoryIcon(
    category
) {

    const icons = {

        Tech: "💻",

        Phones: "📱",

        Laptops: "💻",

        Tablets: "📲",

        Headphones: "🎧",

        Cameras: "📷",

        Gaming: "🎮",

        Fashion: "👕",

        Shoes: "👟",

        Watches: "⌚",

        Jewelry: "💎",

        Beauty: "💄",

        Skincare: "🧴",

        Makeup: "💋",

        Home: "🏠",

        Furniture: "🛋️",

        Kitchen: "🍳",

        Appliances: "🔌",

        Sports: "⚽",

        Fitness: "🏋️",

        Books: "📚",

        Toys: "🧸",

        Baby: "👶",

        Automotive: "🚗",

        Tools: "🔧",

        Pet: "🐾",

        Office: "💼",

        Travel: "✈️",

        Food: "🍔",

        Grocery: "🛒"

    };


    return icons[category] ||
        "🛍️";

}


function capitalizeWords(
    text
) {

    return text.replace(
        /\b\w/g,
        char =>
            char.toUpperCase()
    );

}


function escapeHtml(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   START
===================================================== */

loadProducts();