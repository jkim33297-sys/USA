/* =====================================================
   USA — SEARCH PAGE
   LIVE WEB SEARCH VERSION

   Clean replacement for search.js
===================================================== */

/* =========================
   STATE
========================= */

let selectedCategory = "All";

let currentProducts = [];

let selectedProducts = [];

let isLoading = false;


/* =========================
   ELEMENTS
========================= */

const productGrid =
    document.getElementById("productGrid");

const searchQuery =
    document.getElementById("searchQuery");

const resultCount =
    document.getElementById("resultCount");

const productsFound =
    document.getElementById("productsFound");

const topSearch =
    document.getElementById("topSearch");

const topSearchButton =
    document.getElementById("topSearchButton");

const sortSelect =
    document.getElementById("sortSelect");

const emptyState =
    document.getElementById("emptyState");


/* =========================
   SEARCH QUERY
========================= */

function getSearchQuery() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlQuery =
        params.get("query");

    const savedQuery =
        localStorage.getItem(
            "usaSearchQuery"
        );

    return (
        urlQuery ||
        savedQuery ||
        ""
    ).trim();
}


function displayInitialQuery() {

    const query =
        getSearchQuery();

    if (topSearch) {

        topSearch.value =
            query;

    }

    if (searchQuery) {

        searchQuery.textContent =
            query
                ? `Best options for "${query}"`
                : "Find the best products for you";

    }

}


/* =========================
   HTML ESCAPING
========================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   DOMAIN
========================= */

function getDomain(url) {

    if (!url) return "Web";

    try {

        return new URL(url)
            .hostname
            .replace(/^www\./, "");

    } catch {

        return "Web";

    }

}


/* =========================
   PRODUCT HELPERS
========================= */

function getProductIcon(category, name) {

    const text =
        `${category || ""} ${name || ""}`
            .toLowerCase();

    if (
        text.includes("laptop") ||
        text.includes("computer")
    ) {
        return "💻";
    }

    if (
        text.includes("phone") ||
        text.includes("iphone") ||
        text.includes("galaxy")
    ) {
        return "📱";
    }

    if (
        text.includes("headphone") ||
        text.includes("earbud") ||
        text.includes("airpod")
    ) {
        return "🎧";
    }

    if (text.includes("camera")) {
        return "📷";
    }

    if (text.includes("watch")) {
        return "⌚";
    }

    if (
        text.includes("shoe") ||
        text.includes("sneaker")
    ) {
        return "👟";
    }

    if (text.includes("keyboard")) {
        return "⌨️";
    }

    if (
        text.includes("gaming") ||
        text.includes("game")
    ) {
        return "🎮";
    }

    if (text.includes("tablet")) {
        return "📲";
    }

    return "🛍️";
}


function extractPrice(text) {

    if (!text) return null;

    const matches =
        String(text).match(
            /(?:(?:USD)\s*)?\$?\s*[\d,]+(?:\.\d{1,2})?/gi
        );

    if (!matches) return null;

    for (const match of matches) {

        const cleaned =
            match
                .replace(/USD/gi, "")
                .replace(/\$/g, "")
                .replace(/,/g, "")
                .trim();

        const value =
            Number(cleaned);

        if (
            Number.isFinite(value) &&
            value > 0 &&
            value < 1000000
        ) {
            return value;
        }

    }

    return null;
}


function extractRating(text) {

    if (!text) return null;

    const match =
        String(text).match(
            /([0-5](?:\.\d)?)\s*(?:\/\s*5|stars?|out of 5)/i
        );

    if (!match) return null;

    const value =
        Number(match[1]);

    return Number.isFinite(value)
        ? value
        : null;
}


function extractBrand(name) {

    if (!name) return "Unknown";

    const words =
        String(name)
            .trim()
            .split(/\s+/);

    return (
        words[0] ||
        "Unknown"
    );
}


function extractFeatures(text) {

    if (!text) return [];

    const patterns = [

        "wireless",

        "bluetooth",

        "noise cancelling",

        "16GB RAM",

        "8GB RAM",

        "512GB SSD",

        "1TB SSD",

        "4K",

        "5G",

        "OLED",

        "AMOLED",

        "water resistant",

        "fast charging",

        "long battery"

    ];

    const lower =
        String(text)
            .toLowerCase();

    return patterns
        .filter(
            feature =>
                lower.includes(
                    feature.toLowerCase()
                )
        )
        .slice(0, 5);
}


function normalizeProduct(item, index) {

    item = item || {};

    const name =
        item.name ||
        item.title ||
        "Product result";

    const url =
        item.url ||
        item.link ||
        item.product_url ||
        "";

    const source =
        item.source ||
        item.site_name ||
        item.domain ||
        getDomain(url);

    const snippet =
        item.snippet ||
        item.description ||
        item.text ||
        "";


    // -----------------------------------------
    // PRICE
    // -----------------------------------------

    let price =
        item.price;

    const numericPrice =
        Number(price);

    if (
        Number.isFinite(numericPrice) &&
        numericPrice > 0
    ) {

        price =
            numericPrice;

    } else {

        price = null;

    }


    // -----------------------------------------
    // RATING
    // -----------------------------------------

    let rating =
        item.rating;

    if (
        rating === null ||
        rating === undefined ||
        rating === ""
    ) {

        rating =
            extractRating(snippet);

    }

    rating =
        Number.isFinite(
            Number(rating)
        )
            ? Number(rating)
            : null;


    // -----------------------------------------
    // CATEGORY
    // -----------------------------------------

    const category =
        item.category ||
        selectedCategory ||
        "Product";


    // -----------------------------------------
    // FEATURES
    // -----------------------------------------

    const features =
        Array.isArray(item.features)
            ? item.features
                .filter(Boolean)
                .slice(0, 5)
            : extractFeatures(snippet);


    // -----------------------------------------
    // OLD PRICE
    // -----------------------------------------

    const oldPriceValue =
        Number(
            item.oldPrice ??
            item.old_price
        );

    const oldPrice =
        Number.isFinite(oldPriceValue) &&
        oldPriceValue > 0
            ? oldPriceValue
            : null;


    // -----------------------------------------
    // RETURN NORMALIZED PRODUCT
    // -----------------------------------------

    return {

        id:
            item.id ||
            `live-${index}-${Date.now()}`,

        name,

        brand:
            item.brand ||
            extractBrand(name),

        category,

        price,

        // IMPORTANT:
        // Keep backend currency information.

        currency:
            item.currency ||
            "",

        // IMPORTANT:
        // Keep backend-formatted price.

        priceDisplay:
            item.priceDisplay ||
            item.price_display ||
            "",

        oldPrice,

        rating,

        quality:
            Number.isFinite(
                Number(item.quality)
            )
                ? Number(item.quality)
                : null,

        reviews:
            item.reviews ||
            item.review_count ||
            null,

        icon:
            item.icon ||
            getProductIcon(
                category,
                name
            ),

        image:
            item.image ||
            item.image_url ||
            item.imageUrl ||
            "",

        features,

        reason:
            item.reason ||
            item.description ||
            snippet ||
            "Found through a live web search.",

        snippet,

        url,

        source,

        country:
            item.country ||
            ""

    };

}


/* =========================
   LIVE TINYFISH SEARCH
========================= */

async function searchLiveProducts(query) {

    query =
        String(query || "")
            .trim();

    if (
        !query ||
        isLoading
    ) {
        return [];
    }

    isLoading = true;


    if (productGrid) {

        productGrid.innerHTML = `
            <div class="loading-message">

                <div class="loading-spinner"></div>

                <h3>
                    USA is searching the web...
                </h3>

                <p>
                    Finding the best options for
                    "${escapeHtml(query)}"
                </p>

            </div>
        `;

    }


    if (resultCount) {

        resultCount.textContent =
            "Searching live websites...";

    }


    if (productsFound) {

        productsFound.textContent =
            "Searching...";

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    try {

        /*
           Flask /api/search is POST-only.
           Keep this request direct and simple so the browser
           always sends the same request that works in CMD.
        */

        const response =
            await fetch(
                "/api/search",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body: JSON.stringify({

                        query

                    })

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                `Server returned ${response.status} with an invalid JSON response.`
            );

        }


        console.log(
            "USA live search response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Server returned ${response.status}.`
            );

        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Search failed."
            );

        }


        const results =
            Array.isArray(data.products)

                ? data.products

                : Array.isArray(data.results)

                    ? data.results

                    : Array.isArray(data.web_results)

                        ? data.web_results

                        : [];


        currentProducts =
            results
                .map(normalizeProduct)
                .filter(
                    product =>
                        product.name
                );


        applySorting();


        if (
            currentProducts.length === 0
        ) {

            if (resultCount) {

                resultCount.textContent =
                    "No live products were found.";

            }

            if (productsFound) {

                productsFound.textContent =
                    "0 products found";

            }

        } else {

            if (resultCount) {

                resultCount.textContent =
                    `USA found ${currentProducts.length} live web result${currentProducts.length === 1 ? "" : "s"} for your search.`;

            }

        }


        return currentProducts;

    } catch (error) {

        console.error(
            "USA SEARCH ERROR:",
            error
        );


        currentProducts = [];


        if (productsFound) {

            productsFound.textContent =
                "Search failed";

        }


        if (resultCount) {

            resultCount.textContent =
                "Unable to load live results.";

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        if (productGrid) {

            productGrid.innerHTML = `

                <div class="search-error">

                    <h3>
                        We couldn't load live results.
                    </h3>

                    <p>
                        USA could not connect to
                        the shopping search service.
                    </p>

                    <p>
                        Please make sure Flask is running
                        and try again.
                    </p>

                    <button
                        class="retry-search"
                        id="retrySearchButton"
                        type="button"
                    >
                        Try Again
                    </button>

                </div>

            `;


            const retryButton =
                document.getElementById(
                    "retrySearchButton"
                );


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    () =>
                        searchLiveProducts(query)
                );

            }

        }


        return [];

    } finally {

        isLoading = false;

    }

}


/* =========================
   SORTING
========================= */

function getValueScore(product) {

    const rating =
        Number(product.rating) || 0;

    const quality =
        Number(product.quality) || 70;

    const price =
        Number(product.price);

    const pricePenalty =
        Number.isFinite(price)
            ? price / 20
            : 0;

    return (
        rating * 20 +
        quality -
        pricePenalty
    );
}


function applySorting() {

    const sortType =
        sortSelect
            ? sortSelect.value
            : "value";


    if (sortType === "price") {

        currentProducts.sort(
            (a, b) =>
                (a.price ?? Infinity) -
                (b.price ?? Infinity)
        );

    } else if (
        sortType === "rating"
    ) {

        currentProducts.sort(
            (a, b) =>
                (b.rating ?? 0) -
                (a.rating ?? 0)
        );

    } else if (
        sortType === "quality"
    ) {

        currentProducts.sort(
            (a, b) =>
                (b.quality ?? 0) -
                (a.quality ?? 0)
        );

    } else {

        currentProducts.sort(
            (a, b) =>
                getValueScore(b) -
                getValueScore(a)
        );

    }

    renderProducts();

}


/* =========================
   SAVED PRODUCTS
========================= */

function getSavedProductsKey() {

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


    const email =
        user && user.email

            ? String(user.email)
                .trim()
                .toLowerCase()

            : "guest";


    return (
        "usaSavedProducts_" +
        encodeURIComponent(
            email || "guest"
        )
    );

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


function getProductSaveKey(product) {

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


function isProductSaved(product) {

    const key =
        getProductSaveKey(product);

    return getSavedProducts().some(
        savedProduct =>
            getProductSaveKey(
                savedProduct
            ) === key
    );

}


function toggleSavedProduct(product) {

    const savedProducts =
        getSavedProducts();

    const key =
        getProductSaveKey(product);

    const existingIndex =
        savedProducts.findIndex(
            savedProduct =>
                getProductSaveKey(
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

        getSavedProductsKey(),

        JSON.stringify(
            savedProducts
        )

    );


    renderProducts();

}


/* =========================
   PRODUCT BADGE
========================= */

function getProductBadge(product) {

    if (
        product.quality &&
        product.quality >= 94
    ) {

        return "TOP QUALITY";

    }


    if (
        product.price !== null &&
        product.price !== undefined &&
        product.price < 100
    ) {

        return "LOW PRICE";

    }


    if (
        product.rating &&
        product.rating >= 4.7
    ) {

        return "HIGHLY RATED";

    }


    return "LIVE RESULT";

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

    if (!productGrid) return;


    productGrid.innerHTML = "";


    if (productsFound) {

        productsFound.textContent =
            `${currentProducts.length} product${currentProducts.length === 1 ? "" : "s"} found`;

    }


    if (
        resultCount &&
        !isLoading
    ) {

        resultCount.textContent =
            currentProducts.length > 0

                ? `We found ${currentProducts.length} live option${currentProducts.length === 1 ? "" : "s"} matching your search.`

                : "No live products were found.";

    }


    if (
        currentProducts.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }


        productGrid.innerHTML = `

            <div class="empty-search-message">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another product or search
                    with more details.
                </p>

            </div>

        `;


        updateRecommendationCards();

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    currentProducts.forEach(
        product => {

            productGrid.appendChild(
                createProductCard(product)
            );

        }
    );


    updateRecommendationCards();

}


function formatCurrency(
    value,
    currency
) {

    const amount =
        Number(value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return "";

    }


    const code =
        String(
            currency || ""
        ).toUpperCase();


    const formatted =
        amount.toLocaleString();


    switch (code) {

        case "PKR":
            return `Rs. ${formatted}`;

        case "USD":
            return `$${formatted}`;

        case "GBP":
            return `£${formatted}`;

        case "EUR":
            return `€${formatted}`;

        case "INR":
            return `₹${formatted}`;

        case "AED":
            return `AED ${formatted}`;

        case "SAR":
            return `SAR ${formatted}`;

        default:

            return code
                ? `${code} ${formatted}`
                : formatted;

    }

}


/* =========================
   PRODUCT CARD
========================= */

function createProductCard(product) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    const isSelected =
        selectedProducts.includes(
            product.id
        );


    const isSaved =
        isProductSaved(product);


    const priceHTML =

        product.priceDisplay

            ? `

                <span class="price-current">

                    ${escapeHtml(
                        product.priceDisplay
                    )}

                </span>

              `

            : product.price !== null &&

              Number.isFinite(
                  Number(product.price)
              ) &&

              Number(product.price) > 0

                ? `

                    <span class="price-current">

                        ${escapeHtml(
                            formatCurrency(
                                product.price,
                                product.currency
                            )
                        )}

                    </span>

                  `

                : `

                    <span class="price-unavailable">

                        Price unavailable

                    </span>

                  `;


    const oldPriceHTML =

        product.oldPrice !== null &&

        Number.isFinite(
            Number(product.oldPrice)
        ) &&

        Number(product.oldPrice) > 0

            ? `

                <span class="price-old">

                    ${escapeHtml(
                        formatCurrency(
                            product.oldPrice,
                            product.currency
                        )
                    )}

                </span>

              `

            : "";


    const ratingHTML =

        product.rating !== null &&

        Number.isFinite(
            Number(product.rating)
        )

            ? `

                <span class="rating-star">
                    ★
                </span>

                <span class="rating-number">

                    ${Number(
                        product.rating
                    ).toFixed(1)}

                </span>

              `

            : `

                <span class="rating-unavailable">

                    Rating unavailable

                </span>

              `;


    const features =

        Array.isArray(
            product.features
        )

            ? product.features
                .filter(Boolean)
                .slice(0, 4)

            : [];


    const featureHTML =

        features.length

            ? features
                .map(
                    feature =>
                        `<span class="feature-tag">${escapeHtml(feature)}</span>`
                )
                .join("")

            : `

                <span class="feature-tag">

                    Live web result

                </span>

              `;


    const safeImage =
        product.image
            ? escapeHtml(
                product.image
            )
            : "";


    const safeName =
        escapeHtml(
            product.name
        );


    const imageHTML =

        safeImage

            ? `

                <img
                    src="${safeImage}"
                    alt="${safeName}"
                    class="product-real-image"
                    loading="lazy"
                    decoding="async"
                    referrerpolicy="no-referrer"
                >

                <span
                    class="product-image-fallback"
                    style="display:none;"
                >
                    Image unavailable
                </span>

              `

            : `

                <span
                    class="product-image-fallback"
                >
                    Image unavailable
                </span>

              `;


    card.innerHTML = `

        <div class="product-image">

            <span class="product-badge">

                ${getProductBadge(
                    product
                )}

            </span>


            <button
                class="compare-check"
                data-id="${escapeHtml(product.id)}"
                title="Add to comparison"
                type="button"
            >

                ${isSelected
                    ? "✓"
                    : "+"}

            </button>


            <button
                class="save-product-button"
                title="${isSaved
                    ? "Remove from saved"
                    : "Save product"}"
                type="button"
                style="
                    position:absolute;
                    top:12px;
                    right:12px;
                    z-index:5;
                    width:38px;
                    height:38px;
                    border:none;
                    border-radius:50%;
                    background:#ffffff;
                    box-shadow:0 4px 12px rgba(0,0,0,0.12);
                    font-size:22px;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                "
            >

                ${isSaved
                    ? "♥"
                    : "♡"}

            </button>


            <div class="product-image-inner">

                ${imageHTML}

            </div>

        </div>


        <div class="product-info">

            <div class="product-category">

                ${escapeHtml(
                    product.category
                )}

            </div>


            <h3 class="product-name">

                ${safeName}

            </h3>


            <div class="product-brand">

                ${escapeHtml(
                    product.brand
                )}

            </div>


            <div class="product-source">

                <span class="source-label">

                    Found on

                </span>


                <span class="source-name">

                    ${escapeHtml(
                        product.source
                    )}

                </span>

            </div>


            <div class="product-rating">

                ${ratingHTML}

                ${
                    product.reviews
                        ? `
                            <span class="review-count">

                                (${escapeHtml(
                                    product.reviews
                                )})

                            </span>
                          `
                        : ""
                }

            </div>


            <div class="product-price-row">

                <div class="product-price">

                    ${priceHTML}

                    ${oldPriceHTML}

                </div>


                ${
                    product.quality

                        ? `

                            <div class="quality-score">

                                Q
                                ${escapeHtml(
                                    product.quality
                                )}

                            </div>

                          `

                        : ""
                }

            </div>


            <div class="product-features">

                ${featureHTML}

            </div>


            <p class="product-reason">

                ${escapeHtml(

                    product.reason ||

                    product.snippet ||

                    "Found through a live web search."

                )}

            </p>


            <div class="product-actions">

                ${

                    product.url

                        ? `

                            <a
                                href="${escapeHtml(
                                    product.url
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="view-product-btn"
                            >

                                View Product

                                <span>
                                    →
                                </span>

                            </a>

                          `

                        : ""

                }


                <button
                    class="why-btn"
                    data-id="${escapeHtml(product.id)}"
                    type="button"
                >

                    Why is it better?

                </button>

            </div>

        </div>

    `;


    const realImage =
        card.querySelector(
            ".product-real-image"
        );


    const imageFallback =
        card.querySelector(
            ".product-image-fallback"
        );


    if (
        realImage &&
        imageFallback
    ) {

        realImage.addEventListener(
            "error",
            () => {

                realImage.style.display =
                    "none";

                imageFallback.style.display =
                    "flex";

            }
        );

    }


    const compareButton =
        card.querySelector(
            ".compare-check"
        );


    if (compareButton) {

        compareButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleCompare(
                    product.id
                );

            }
        );

    }


    const saveButton =
        card.querySelector(
            ".save-product-button"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleSavedProduct(
                    product
                );

            }
        );

    }


    const whyButton =
        card.querySelector(
            ".why-btn"
        );


    if (whyButton) {

        whyButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openWhyModal(
                    product.id
                );

            }
        );

    }


    return card;

}


/* =========================
   RECOMMENDATIONS
========================= */

function updateRecommendationCards() {

    if (
        currentProducts.length === 0
    ) {

        setText(
            "bestValueName",
            "-"
        );

        setText(
            "lowestPriceName",
            "-"
        );

        setText(
            "bestQualityName",
            "-"
        );

        return;

    }


    const bestValue =
        [...currentProducts]
            .sort(
                (a, b) =>
                    getValueScore(b) -
                    getValueScore(a)
            )[0];


    const pricedProducts =
        currentProducts.filter(
            product =>
                product.price !== null &&
                product.price !== undefined &&
                Number.isFinite(
                    Number(product.price)
                )
        );


    const lowestPrice =
        pricedProducts.length

            ? [...pricedProducts]
                .sort(
                    (a, b) =>
                        a.price - b.price
                )[0]

            : null;


    const qualityProducts =
        currentProducts.filter(
            product =>
                product.quality !== null
        );


    const bestQuality =
        qualityProducts.length

            ? [...qualityProducts]
                .sort(
                    (a, b) =>
                        b.quality -
                        a.quality
                )[0]

            : null;


    setText(
        "bestValueName",
        bestValue?.name || "-"
    );


    setText(
        "lowestPriceName",
        lowestPrice?.name || "-"
    );


    setText(
        "bestQualityName",
        bestQuality?.name || "-"
    );

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =========================
   CATEGORY BUTTONS
========================= */

document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedCategory =
                        button.dataset.category ||
                        "All";


                    if (searchQuery) {

                        searchQuery.textContent =

                            selectedCategory === "All"

                                ? `Best options for "${topSearch ? topSearch.value : getSearchQuery()}"`

                                : `Best ${selectedCategory} options`;

                    }


                    applySorting();

                }
            );

        }
    );


/* =========================
   SEARCH
========================= */

async function performSearch() {

    const query =
        topSearch
            ? topSearch.value.trim()
            : "";


    if (!query) {

        alert(
            "Tell USA what you are looking for first!"
        );


        if (topSearch) {

            topSearch.focus();

        }


        return;

    }


    localStorage.setItem(
        "usaSearchQuery",
        query
    );


    const newURL =
        `${window.location.pathname}?query=${encodeURIComponent(query)}`;


    window.history.replaceState(
        {},
        "",
        newURL
    );


    if (searchQuery) {

        searchQuery.textContent =
            `Best options for "${query}"`;

    }


    selectedCategory =
        "All";


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(

                    "active",

                    (
                        button.dataset.category ||
                        "All"
                    ) === "All"

                );

            }
        );


    await searchLiveProducts(
        query
    );

}


if (topSearchButton) {

    topSearchButton.addEventListener(
        "click",
        performSearch
    );

}


if (topSearch) {

    topSearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =========================
   SORT
========================= */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            applySorting();

        }
    );

}


/* =========================
   CATEGORY SLIDER
========================= */

const categorySlider =
    document.getElementById(
        "categorySlider"
    );


const categoryNext =
    document.getElementById(
        "categoryNext"
    );


const categoryPrev =
    document.getElementById(
        "categoryPrev"
    );


if (
    categoryNext &&
    categorySlider
) {

    categoryNext.addEventListener(
        "click",
        () => {

            categorySlider.scrollBy({

                left: 500,

                behavior: "smooth"

            });

        }
    );

}


if (
    categoryPrev &&
    categorySlider
) {

    categoryPrev.addEventListener(
        "click",
        () => {

            categorySlider.scrollBy({

                left: -500,

                behavior: "smooth"

            });

        }
    );

}


/* =========================
   COMPARE SYSTEM
========================= */

function toggleCompare(productId) {

    if (
        selectedProducts.includes(
            productId
        )
    ) {

        selectedProducts =
            selectedProducts.filter(
                id =>
                    id !== productId
            );

    } else {

        if (
            selectedProducts.length >= 3
        ) {

            alert(
                "You can compare up to 3 products."
            );

            return;

        }

        selectedProducts.push(
            productId
        );

    }


    updateCompareBar();

    renderProducts();

}


function updateCompareBar() {

    const compareBar =
        document.getElementById(
            "compareBar"
        );


    const compareCount =
        document.getElementById(
            "compareCount"
        );


    if (compareCount) {

        compareCount.textContent =
            selectedProducts.length;

    }


    if (!compareBar) return;


    compareBar.classList.toggle(
        "active",
        selectedProducts.length > 0
    );

}


const compareButton =
    document.getElementById(
        "compareButton"
    );


if (compareButton) {

    compareButton.addEventListener(
        "click",
        () => {

            if (
                selectedProducts.length < 2
            ) {

                alert(
                    "Please select at least 2 products to compare."
                );

                return;

            }


            const selected =
                selectedProducts

                    .map(
                        id =>
                            currentProducts.find(
                                product =>
                                    product.id === id
                            )
                    )

                    .filter(Boolean);


            const names =
                selected.map(
                    product =>
                        product.name
                );


            alert(
                "Comparison selected:\n\n" +
                names.join("\n") +
                "\n\nFull AI comparison will be connected in the next stage."
            );

        }
    );

}


/* =========================
   WHY IT'S BETTER MODAL
========================= */

const whyModal =
    document.getElementById(
        "whyModal"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


function openWhyModal(productId) {

    const product =
        currentProducts.find(
            p =>
                p.id === productId
        );


    if (!product) return;


    setText(
        "modalProductName",
        product.name
    );


    setText(
        "modalProductCategory",
        `${product.brand} · ${product.category}`
    );


    setText(
        "modalProductPrice",
        product.price !== null &&
        product.price !== undefined
            ? product.price
            : "Unavailable"
    );


    setText(
        "modalProductRating",
        product.rating !== null &&
        product.rating !== undefined
            ? product.rating
            : "Unavailable"
    );


    setText(
        "modalProductQuality",
        product.quality ||
        "Not available yet"
    );


    setText(
        "modalReason",
        product.reason ||
        product.snippet ||
        "This product was found through a live web search."
    );


    const modalFeatures =
        document.getElementById(
            "modalFeatures"
        );


    if (modalFeatures) {

        modalFeatures.innerHTML =
            (
                product.features ||
                []
            )
                .map(
                    feature =>
                        `<span class="modal-feature">${escapeHtml(feature)}</span>`
                )
                .join("");

    }


    const modalVerdict =
        document.getElementById(
            "modalVerdict"
        );


    if (modalVerdict) {

        if (
            product.quality &&
            product.quality >= 94
        ) {

            modalVerdict.textContent =
                "Excellent choice if quality is your top priority.";

        } else if (
            product.rating &&
            product.rating >= 4.7
        ) {

            modalVerdict.textContent =
                "This is a highly rated live-web option.";

        } else if (
            product.price !== null &&
            product.price !== undefined &&
            product.price < 100
        ) {

            modalVerdict.textContent =
                "This option appears attractive from a price perspective.";

        } else {

            modalVerdict.textContent =
                "This is a live result worth considering.";

        }

    }


    if (whyModal) {

        whyModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeWhyModal() {

    if (!whyModal) return;

    whyModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeWhyModal
    );

}


if (whyModal) {

    whyModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                whyModal
            ) {

                closeWhyModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeWhyModal();

        }

    }
);


/* =========================
   SEARCH PAGE ACCOUNT
========================= */

const searchAccountButton =
    document.getElementById(
        "accountButton"
    );


if (searchAccountButton) {

    let searchAccountDropdown =
        document.getElementById(
            "searchAccountDropdown"
        );


    if (!searchAccountDropdown) {

        searchAccountDropdown =
            document.createElement(
                "div"
            );


        searchAccountDropdown.id =
            "searchAccountDropdown";


        searchAccountDropdown.style.cssText = `

            position: fixed;

            top: 72px;

            right: 24px;

            width: 300px;

            background: #ffffff;

            border: 1px solid #eeeeee;

            border-radius: 18px;

            padding: 20px;

            box-shadow: 0 18px 45px rgba(0,0,0,0.16);

            display: none;

            z-index: 10000;

        `;


        searchAccountDropdown.innerHTML = `

            <div style="
                display:flex;
                align-items:center;
                gap:14px;
                margin-bottom:18px;
            ">

                <div
                    id="searchProfilePicture"
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
                        id="searchProfileName"
                        style="
                            margin:0;
                            font-size:17px;
                        "
                    >
                        User
                    </h3>


                    <p
                        id="searchProfileEmail"
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

                    <strong>
                        Name:
                    </strong>

                    <span id="searchAccountName">
                        User
                    </span>

                </div>


                <div>

                    📧

                    <strong>
                        Email:
                    </strong>

                    <span id="searchAccountEmail">
                        user@gmail.com
                    </span>

                </div>

            </div>


            <button
                id="searchLogoutButton"
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
            searchAccountDropdown
        );

    }


    function updateSearchAccount() {

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


        const fullName = (

            user.firstName +

            " " +

            user.lastName

        ).trim();


        const initials = (

            user.firstName.charAt(0) +

            user.lastName.charAt(0)

        ).toUpperCase();


        document.getElementById(
            "searchProfileName"
        ).textContent =
            fullName;


        document.getElementById(
            "searchProfileEmail"
        ).textContent =
            user.email;


        document.getElementById(
            "searchAccountName"
        ).textContent =
            fullName;


        document.getElementById(
            "searchAccountEmail"
        ).textContent =
            user.email;


        document.getElementById(
            "searchProfilePicture"
        ).textContent =
            initials;


        searchAccountDropdown.style.display =
            searchAccountDropdown.style.display === "none"

                ? "block"

                : "none";

    }


    searchAccountButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            updateSearchAccount();

        }
    );


    document.addEventListener(
        "click",
        function(event) {

            if (

                searchAccountDropdown &&

                !searchAccountDropdown.contains(
                    event.target
                ) &&

                !searchAccountButton.contains(
                    event.target
                )

            ) {

                searchAccountDropdown.style.display =
                    "none";

            }

        }
    );


    const searchLogoutButton =
        document.getElementById(
            "searchLogoutButton"
        );


    if (searchLogoutButton) {

        searchLogoutButton.addEventListener(
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


/* =========================
   SEARCH PAGE SAVED PRODUCTS
========================= */

const searchWishlistButton =
    document.getElementById(
        "wishlistButton"
    );


function searchSavedProductKey(
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


function searchSavedPrice(
    product
) {

    if (product.priceDisplay) {

        return product.priceDisplay;

    }


    const amount =
        Number(product.price);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return "Price unavailable";

    }


    const currency =
        String(
            product.currency || ""
        ).toUpperCase();


    if (currency === "PKR") {

        return (
            "Rs. " +
            amount.toLocaleString()
        );

    }


    if (currency === "USD") {

        return (
            "$" +
            amount.toLocaleString()
        );

    }


    if (currency === "GBP") {

        return (
            "£" +
            amount.toLocaleString()
        );

    }


    if (currency === "EUR") {

        return (
            "€" +
            amount.toLocaleString()
        );

    }


    return currency

        ? currency +
          " " +
          amount.toLocaleString()

        : amount.toLocaleString();

}


function showSearchSavedProducts() {

    const existing =
        document.getElementById(
            "searchSavedOverlay"
        );


    if (existing) {

        existing.remove();

        document.body.style.overflow =
            "";

        return;

    }


    const savedProducts =
        getSavedProducts();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "searchSavedOverlay";


    overlay.style.cssText = `

        position: fixed;

        inset: 0;

        z-index: 10001;

        background: rgba(0,0,0,0.45);

        backdrop-filter: blur(6px);

        display: flex;

        align-items: center;

        justify-content: center;

        padding: 24px;

    `;


    const panel =
        document.createElement(
            "div"
        );


    panel.style.cssText = `

        width: min(1000px, 100%);

        max-height: 90vh;

        overflow: auto;

        background: #ffffff;

        border-radius: 24px;

        padding: 28px;

        box-shadow: 0 20px 60px rgba(0,0,0,0.2);

    `;


    let contentHTML = "";


    if (
        savedProducts.length === 0
    ) {

        contentHTML = `

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

        contentHTML = `

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

                                const safeName =
                                    escapeHtml(
                                        product.name ||
                                        "Saved Product"
                                    );


                                const safeBrand =
                                    escapeHtml(
                                        product.brand ||
                                        product.source ||
                                        ""
                                    );


                                const safePrice =
                                    escapeHtml(
                                        searchSavedPrice(
                                            product
                                        )
                                    );


                                const safeImage =
                                    product.image

                                        ? escapeHtml(
                                            product.image
                                        )

                                        : "";


                                const imageHTML =

                                    safeImage

                                        ? `

                                            <img
                                                src="${safeImage}"
                                                alt="${safeName}"
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

                                    <div style="
                                        border:1px solid #eeeeee;
                                        border-radius:18px;
                                        padding:14px;
                                        background:#fff;
                                    ">

                                        ${imageHTML}


                                        <div style="
                                            padding:14px 4px 4px;
                                        ">

                                            <div style="
                                                font-size:12px;
                                                color:#888;
                                                margin-bottom:5px;
                                            ">
                                                ${safeBrand}
                                            </div>


                                            <h3 style="
                                                margin:0 0 10px;
                                                font-size:17px;
                                                line-height:1.35;
                                            ">
                                                ${safeName}
                                            </h3>


                                            <div style="
                                                font-size:18px;
                                                font-weight:700;
                                                margin-bottom:12px;
                                            ">
                                                ${safePrice}
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
                                                                href="${escapeHtml(product.url)}"
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
                                                    class="search-remove-saved"
                                                    data-save-key="${escapeHtml(searchSavedProductKey(product))}"
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

                    saved product${

                        savedProducts.length === 1
                            ? ""
                            : "s"

                    }

                </p>

            </div>


            <button
                type="button"
                id="closeSearchSaved"
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


        ${contentHTML}

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
            "closeSearchSaved"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                overlay.remove();

                document.body.style.overflow =
                    "";

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

                document.body.style.overflow =
                    "";

            }

        }
    );


    panel
        .querySelectorAll(
            ".search-remove-saved"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const key =
                            button.dataset.saveKey;


                        const updated =
                            savedProducts.filter(
                                product =>

                                    searchSavedProductKey(
                                        product
                                    ) !== key
                            );


                        localStorage.setItem(
                            getSavedProductsKey(),
                            JSON.stringify(
                                updated
                            )
                        );


                        overlay.remove();

                        document.body.style.overflow =
                            "";


                        showSearchSavedProducts();

                    }
                );

            }
        );

}


if (searchWishlistButton) {

    searchWishlistButton.addEventListener(
        "click",
        function() {

            showSearchSavedProducts();

        }
    );

}


/* =========================
   INITIALIZE
========================= */

async function initializeSearchPage() {

    displayInitialQuery();

    updateCompareBar();


    const query =
        getSearchQuery();


    if (query) {

        await searchLiveProducts(
            query
        );

    } else {

        currentProducts = [];

        renderProducts();

    }

}


initializeSearchPage();