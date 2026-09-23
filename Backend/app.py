from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os
import secrets
import hashlib
import hmac
import re
import json
import html as htmlmod
import time
import requests
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv

try:
    from werkzeug.security import check_password_hash
except ImportError:
    check_password_hash = None


# =========================================================
# TINYFISH CONFIGURATION
# =========================================================

load_dotenv()

TINYFISH_API_KEY = os.getenv("TINYFISH_API_KEY")

if not TINYFISH_API_KEY:
    raise RuntimeError(
        "TINYFISH_API_KEY was not found in backend/.env"
    )

TINYFISH_SEARCH_URL = "https://api.search.tinyfish.ai"
TINYFISH_FETCH_URL = "https://api.fetch.tinyfish.ai"


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "Frontend"
)

DATABASE_DIR = os.path.join(
    BASE_DIR,
    "Database"
)

DATABASE_PATH = os.path.join(
    DATABASE_DIR,
    "usa.db"
)

os.makedirs(
    DATABASE_DIR,
    exist_ok=True
)


# =========================================================
# FLASK
# =========================================================

app = Flask(__name__)


# =========================================================
# TINYFISH SEARCH
# =========================================================

def tinyfish_search(
    query,
    location="PK",
    language="en",
    page=0
):
    """Search the live web using TinyFish."""

    for attempt in range(3):
        try:
            response = requests.get(
                TINYFISH_SEARCH_URL,
                params={
                    "query": query,
                    "location": location,
                    "language": language,
                    "page": page
                },
                headers={
                    "X-API-Key": TINYFISH_API_KEY
                },
                timeout=30
            )

            if response.status_code == 429:
                retry_after = response.headers.get(
                    "Retry-After"
                )

                try:
                    wait_seconds = int(
                        retry_after
                    )
                except (TypeError, ValueError):
                    wait_seconds = 5 * (attempt + 1)

                wait_seconds = max(
                    1,
                    min(wait_seconds, 20)
                )

                print(
                    "TINYFISH SEARCH RATE LIMITED. "
                    f"Waiting {wait_seconds} seconds..."
                )

                time.sleep(wait_seconds)
                continue

            response.raise_for_status()

            result = response.json()

            if isinstance(result, dict):
                return result

            return {
                "results": []
            }

        except requests.RequestException as error:
            print(
                "TINYFISH SEARCH ERROR:",
                error
            )

            if attempt == 2:
                return None

            time.sleep(2)

        except ValueError as error:
            print(
                "TINYFISH SEARCH JSON ERROR:",
                error
            )
            return None

    return None


# =========================================================
# TINYFISH FETCH
# =========================================================

def tinyfish_fetch(
    urls,
    image_links=True
):
    """Fetch live product pages from TinyFish."""

    if not isinstance(urls, list):
        urls = [urls]

    cleaned_urls = []

    for url in urls:
        if not isinstance(url, str):
            continue

        url = url.strip()

        if not url:
            continue

        if url not in cleaned_urls:
            cleaned_urls.append(url)

    # TinyFish fetch limit
    cleaned_urls = cleaned_urls[:10]

    if not cleaned_urls:
        return {
            "results": [],
            "errors": []
        }

    try:
        response = requests.post(
            TINYFISH_FETCH_URL,
            json={
                "urls": cleaned_urls,
                "format": "html",
                "links": True,
                "image_links": image_links
            },
            headers={
                "X-API-Key": TINYFISH_API_KEY,
                "Content-Type": "application/json"
            },
            timeout=150
        )

        response.raise_for_status()

        result = response.json()

        if isinstance(result, dict):
            return result

        return {
            "results": []
        }

    except requests.RequestException as error:
        print(
            "TINYFISH FETCH ERROR:",
            error
        )
        return None

    except ValueError as error:
        print(
            "TINYFISH FETCH JSON ERROR:",
            error
        )
        return None


# =========================================================
# IMAGE HELPERS
# =========================================================

def _normalize_image_url(
    image_url,
    page_url=""
):
    if not isinstance(
        image_url,
        str
    ):
        return ""

    image_url = htmlmod.unescape(
        image_url
    ).strip().strip('"').strip("'")

    if not image_url:
        return ""

    if image_url.startswith("//"):
        image_url = "https:" + image_url

    elif page_url:
        image_url = urljoin(
            page_url,
            image_url
        )

    if not image_url.startswith(
        ("http://", "https://")
    ):
        return ""

    return image_url


def _image_is_blocked(image_url):
    if not isinstance(
        image_url,
        str
    ):
        return True

    lowered = image_url.lower()

    blocked_words = (
        "logo",
        "favicon",
        "sprite",
        "avatar",
        "placeholder",
        "tracking",
        "pixel",
        "payment",
        "facebook",
        "instagram",
        "twitter",
        "youtube",
        "tiktok",
        "linkedin"
    )

    return any(
        word in lowered
        for word in blocked_words
    )


def _extract_jsonld_product(
    html_content
):
    """
    Extract Product objects from JSON-LD.
    """

    if not isinstance(
        html_content,
        str
    ):
        return []

    if not html_content.strip():
        return []

    scripts = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>'
        r'(.*?)'
        r'</script>',
        html_content,
        flags=re.IGNORECASE | re.DOTALL
    )

    products = []

    def walk(node):
        if isinstance(node, list):
            for item in node:
                walk(item)
            return

        if not isinstance(node, dict):
            return

        node_type = node.get(
            "@type",
            ""
        )

        if isinstance(
            node_type,
            list
        ):
            types = {
                str(value).lower()
                for value in node_type
            }
        else:
            types = {
                str(node_type).lower()
            }

        if "product" in types:
            products.append(node)

        for value in node.values():
            if isinstance(
                value,
                (dict, list)
            ):
                walk(value)

    for raw_script in scripts:
        raw_script = raw_script.strip()

        if not raw_script:
            continue

        try:
            parsed = json.loads(
                raw_script
            )
            walk(parsed)

        except (
            json.JSONDecodeError,
            TypeError,
            ValueError
        ):
            continue

    return products


def _extract_jsonld_product_name(
    html_content
):
    products = _extract_jsonld_product(
        html_content
    )

    for product in products:
        name = product.get(
            "name"
        )

        if isinstance(
            name,
            str
        ):
            name = name.strip()

            if name:
                return name

    return ""


def _extract_jsonld_product_images(
    html_content,
    page_url=""
):
    products = _extract_jsonld_product(
        html_content
    )

    images = []

    for product in products:
        product_image = product.get(
            "image"
        )

        values = []

        if isinstance(
            product_image,
            str
        ):
            values.append(
                product_image
            )

        elif isinstance(
            product_image,
            list
        ):
            for value in product_image:
                if isinstance(
                    value,
                    str
                ):
                    values.append(value)

                elif isinstance(
                    value,
                    dict
                ):
                    image_url = (
                        value.get("url")
                        or value.get("contentUrl")
                    )

                    if isinstance(
                        image_url,
                        str
                    ):
                        values.append(
                            image_url
                        )

        elif isinstance(
            product_image,
            dict
        ):
            image_url = (
                product_image.get("url")
                or product_image.get("contentUrl")
            )

            if isinstance(
                image_url,
                str
            ):
                values.append(
                    image_url
                )

        for value in values:
            normalized = _normalize_image_url(
                value,
                page_url
            )

            if not normalized:
                continue

            if _image_is_blocked(
                normalized
            ):
                continue

            if normalized not in images:
                images.append(
                    normalized
                )

    return images


def choose_product_image(
    image_links,
    product_title="",
    page_html="",
    page_url=""
):
    """
    Prefer Product.image from JSON-LD.
    Fall back to TinyFish image links.
    """

    structured_images = (
        _extract_jsonld_product_images(
            page_html,
            page_url
        )
    )

    if structured_images:
        return structured_images[0]

    if not isinstance(
        image_links,
        list
    ):
        return ""

    title_words = {
        word.lower()
        for word in re.findall(
            r"[a-zA-Z0-9]+",
            product_title
        )
        if len(word) >= 3
    }

    candidates = []

    for image_url in image_links:
        normalized = _normalize_image_url(
            image_url,
            page_url
        )

        if not normalized:
            continue

        if _image_is_blocked(
            normalized
        ):
            continue

        lowered = normalized.lower()

        score = 0

        for word in title_words:
            if word in lowered:
                score += 5

        if any(
            extension in lowered
            for extension in (
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
                ".avif"
            )
        ):
            score += 3

        if any(
            word in lowered
            for word in (
                "product",
                "item",
                "catalog",
                "sku"
            )
        ):
            score += 3

        candidates.append(
            (
                score,
                normalized
            )
        )

    if not candidates:
        return ""

    candidates.sort(
        key=lambda item: item[0],
        reverse=True
    )

    return candidates[0][1]


# =========================================================
# PRICE HELPERS
# =========================================================

def _money_to_float(value):
    if value is None:
        return None

    cleaned = str(
        value
    ).strip()

    cleaned = cleaned.replace(
        ",",
        ""
    )

    cleaned = re.sub(
        r"[^\d.]",
        "",
        cleaned
    )

    if not cleaned:
        return None

    try:
        amount = float(
            cleaned
        )

    except ValueError:
        return None

    if amount <= 0:
        return None

    if amount > 10000000:
        return None

    return amount


def extract_product_price(
    text,
    page_html=""
):
    """
    Extract the current product price.

    Priority:
    1. JSON-LD Product / Offer
    2. Currency values
    3. Price labels
    """

    # -----------------------------------------------------
    # JSON-LD PRICE
    # -----------------------------------------------------

    products = _extract_jsonld_product(
        page_html
    )

    structured_prices = []

    def extract_offer_price(
        offer
    ):
        if not isinstance(
            offer,
            dict
        ):
            return

        price = offer.get(
            "price"
        )

        amount = _money_to_float(
            price
        )

        if amount is not None:
            structured_prices.append(
                amount
            )

        specification = offer.get(
            "priceSpecification"
        )

        if isinstance(
            specification,
            dict
        ):
            amount = _money_to_float(
                specification.get("price")
            )

            if amount is not None:
                structured_prices.append(
                    amount
                )

    for product in products:
        offers = product.get(
            "offers"
        )

        if isinstance(
            offers,
            dict
        ):
            extract_offer_price(
                offers
            )

        elif isinstance(
            offers,
            list
        ):
            for offer in offers:
                extract_offer_price(
                    offer
                )

    if structured_prices:
        return structured_prices[0]

    # -----------------------------------------------------
    # NORMALIZE TEXT
    # -----------------------------------------------------

    if not isinstance(
        text,
        str
    ):
        text = ""

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    if not text:
        return None

    # -----------------------------------------------------
    # CURRENCY PATTERNS
    # -----------------------------------------------------

    patterns = [
        # PKR
        r"\bPKR\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",
        r"\bRs\.?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*PKR",
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*Rs\.?",

        # USD
        r"\$\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",
        r"\bUSD\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # INR
        r"₹\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # AED
        r"\bAED\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # SAR
        r"\bSAR\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # EUR
        r"€\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # GBP
        r"£\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        # THB
        r"฿\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)"
    ]

    candidates = []

    for pattern in patterns:
        for match in re.finditer(
            pattern,
            text,
            re.IGNORECASE
        ):
            amount = _money_to_float(
                match.group(1)
            )

            if amount is None:
                continue

            start = max(
                0,
                match.start() - 100
            )

            end = min(
                len(text),
                match.end() + 100
            )

            context = text[
                start:end
            ].lower()

            score = 0

            positive_words = (
                "price",
                "sale",
                "selling",
                "current",
                "now",
                "buy",
                "cart",
                "in stock",
                "available"
            )

            negative_words = (
                "save",
                "you save",
                "discount",
                "shipping",
                "delivery",
                "per month",
                "monthly",
                "reviews",
                "rating",
                "sku",
                "model",
                "off"
            )

            for word in positive_words:
                if word in context:
                    score += 4

            for word in negative_words:
                if word in context:
                    score -= 5

            if amount >= 10:
                score += 2

            if amount >= 50:
                score += 1

            candidates.append(
                (
                    score,
                    amount,
                    match.start()
                )
            )

    if candidates:
        candidates.sort(
            key=lambda item: (
                item[0],
                -item[2]
            ),
            reverse=True
        )

        return candidates[0][1]

    # -----------------------------------------------------
    # PRICE LABELS
    # -----------------------------------------------------

    price_patterns = [
        r"(?:current\s+)?price\s*[:\-]?\s*"
        r"(?:PKR|Rs\.?|USD|AED|SAR|₹|\$|€|£)?\s*"
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        r"(?:sale|selling|our)\s+price\s*[:\-]?\s*"
        r"(?:PKR|Rs\.?|USD|AED|SAR|₹|\$|€|£)?\s*"
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)"
    ]

    for pattern in price_patterns:
        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if not match:
            continue

        amount = _money_to_float(
            match.group(1)
        )

        if amount is not None:
            return amount

    return None


def extract_old_price(
    text,
    current_price=None
):
    if not isinstance(
        text,
        str
    ):
        return None

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    patterns = [
        r"(?:was|original price|regular price|list price)"
        r"\s*[:\-]?\s*(?:PKR|Rs\.?|USD|AED|SAR|₹|\$|€|£)?\s*"
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)",

        r"(?:MSRP|RRP)"
        r"\s*[:\-]?\s*(?:PKR|Rs\.?|USD|AED|SAR|₹|\$|€|£)?\s*"
        r"([0-9][0-9,]*(?:\.[0-9]{1,2})?)"
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if not match:
            continue

        amount = _money_to_float(
            match.group(1)
        )

        if amount is None:
            continue

        if (
            current_price is None
            or amount > current_price
        ):
            return amount

    return None


def extract_product_rating(
    text
):
    if not isinstance(
        text,
        str
    ):
        return None

    patterns = [
        r"([0-5](?:\.[0-9])?)\s*(?:out of|/)\s*5",
        r"(?:rating|rated)\s*[:\-]?\s*"
        r"([0-5](?:\.[0-9])?)"
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if not match:
            continue

        try:
            rating = float(
                match.group(1)
            )
        except ValueError:
            continue

        if 0 <= rating <= 5:
            return rating

    return None


# =========================================================
# PRODUCT PAGE VALIDATION
# =========================================================

def _page_is_valid_product_page(
    page
):
    """
    Strictly reject inaccessible/non-product pages.
    """

    if not isinstance(
        page,
        dict
    ):
        return False

    title = page.get(
        "title",
        ""
    )

    text = page.get(
        "text",
        ""
    )

    html_content = page.get(
        "html",
        ""
    )

    combined = " ".join(
        value
        for value in (
            title,
            text,
            html_content
        )
        if isinstance(
            value,
            str
        )
    ).lower()

    if not combined.strip():
        return False

    blocked_signals = (
        "access denied",
        "403 forbidden",
        "forbidden",
        "request blocked",
        "access blocked",
        "captcha",
        "verify you are human",
        "robot check",
        "temporarily unavailable",
        "page not found",
        "404 not found",
        "something went wrong"
    )

    if any(
        signal in combined
        for signal in blocked_signals
    ):
        return False

    # JSON-LD Product is strong evidence.
    if _extract_jsonld_product(
        html_content
    ):
        return True

    product_signals = (
        "add to cart",
        "add to bag",
        "buy now",
        "in stock",
        "availability",
        "sku",
        "product details",
        "product description",
        "quantity",
        "select size",
        "select color"
    )

    signal_count = sum(
        1
        for signal in product_signals
        if signal in combined
    )

    return signal_count >= 2


# =========================================================
# FETCHED PAGE DATA
# =========================================================

def get_fetched_page_data(
    fetch_result
):
    pages = {}

    if not isinstance(
        fetch_result,
        dict
    ):
        return pages

    results = fetch_result.get(
        "results",
        []
    )

    if not isinstance(
        results,
        list
    ):
        return pages

    for page in results:
        if not isinstance(
            page,
            dict
        ):
            continue

        page_url = page.get(
            "url",
            ""
        )

        final_url = page.get(
            "final_url",
            ""
        )

        page_html = page.get(
            "html",
            ""
        )

        page_text = page.get(
            "text",
            ""
        )

        if not isinstance(
            page_html,
            str
        ):
            page_html = ""

        if not isinstance(
            page_text,
            str
        ):
            page_text = ""

        if not page_text:
            page_text = page.get(
                "markdown",
                ""
            )

        if not isinstance(
            page_text,
            str
        ):
            page_text = ""

        if not page_text:
            page_text = page_html

        valid = _page_is_valid_product_page(
            page
        )

        if not valid:
            continue

        page_title = page.get(
            "title",
            ""
        )

        if not isinstance(
            page_title,
            str
        ):
            page_title = ""

        page_title = page_title.strip()

        structured_name = (
            _extract_jsonld_product_name(
                page_html
            )
        )

        product_name = (
            structured_name
            or page_title
        )

        image = choose_product_image(
            page.get(
                "image_links",
                []
            ),
            product_name,
            page_html=page_html,
            page_url=final_url or page_url
        )

        # Exact product image is required.
        if not image:
            continue

        data = {
            "image": image,
            "text": page_text,
            "html": page_html,
            "title": page_title,
            "product_name": product_name,
            "url": page_url,
            "final_url": final_url
        }

        if page_url:
            pages[page_url] = data

        if final_url:
            pages[final_url] = data

    return pages


# =========================================================
# PASSWORD SECURITY
# =========================================================

PBKDF2_ITERATIONS = 600000
SALT_LENGTH = 32


def create_password_hash(
    password
):
    salt = secrets.token_bytes(
        SALT_LENGTH
    )

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS
    ).hex()

    return (
        password_hash,
        salt.hex()
    )


def verify_password(
    password,
    stored_hash,
    stored_salt
):
    try:
        salt = bytes.fromhex(
            stored_salt
        )

        calculated_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            PBKDF2_ITERATIONS
        ).hex()

        return hmac.compare_digest(
            calculated_hash,
            stored_hash
        )

    except Exception:
        return False


# =========================================================
# DATABASE
# =========================================================

def get_db_connection():
    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row

    return connection


def init_database():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT,
            password_hash TEXT,
            salt TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # Products remain LIVE ONLY.
    cursor.execute(
        "DROP TABLE IF EXISTS products"
    )

    cursor.execute(
        "PRAGMA table_info(users)"
    )

    user_columns = {
        row["name"]
        for row in cursor.fetchall()
    }

    if "password_hash" not in user_columns:
        cursor.execute(
            """
            ALTER TABLE users
            ADD COLUMN password_hash TEXT
            """
        )

    if "salt" not in user_columns:
        cursor.execute(
            """
            ALTER TABLE users
            ADD COLUMN salt TEXT
            """
        )

    if "password" not in user_columns:
        cursor.execute(
            """
            ALTER TABLE users
            ADD COLUMN password TEXT
            """
        )

    connection.commit()
    connection.close()

    print(
        "Database initialized successfully. "
        "Users are stored; products are live-only."
    )


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def index():
    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# =========================================================
# FRONTEND FILES
# =========================================================

@app.route("/<path:filename>")
def frontend_files(
    filename
):
    return send_from_directory(
        FRONTEND_DIR,
        filename
    )


# =========================================================
# SIGN UP
# =========================================================

@app.route(
    "/api/signup",
    methods=["POST"]
)
def signup():

    try:

        data = request.get_json(
            silent=True
        ) or {}


        first_name = str(
            data.get(
                "firstName",
                ""
            )
        ).strip()


        last_name = str(
            data.get(
                "lastName",
                ""
            )
        ).strip()


        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()


        password = data.get(
            "password",
            ""
        )


        if not first_name:

            return jsonify({
                "success": False,
                "message": "First name is required."
            }), 400


        if not last_name:

            return jsonify({
                "success": False,
                "message": "Last name is required."
            }), 400


        if not email:

            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400


        if not password:

            return jsonify({
                "success": False,
                "message": "Password is required."
            }), 400


        if len(password) < 8:

            return jsonify({
                "success": False,
                "message":
                    "Password must be at least 8 characters."
            }), 400


        password_hash, salt = create_password_hash(
            password
        )


        connection = get_db_connection()
        cursor = connection.cursor()


        try:

            cursor.execute(
                """
                INSERT INTO users
                (
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    salt
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    salt
                )
            )

            connection.commit()


        except sqlite3.IntegrityError:

            connection.rollback()

            return jsonify({
                "success": False,
                "message":
                    "An account with this email already exists."
            }), 409


        finally:

            connection.close()


        return jsonify({
            "success": True,
            "message":
                "Account created successfully!",
            "user": {
                "firstName": first_name,
                "lastName": last_name,
                "email": email
            }
        }), 201


    except Exception as error:

        print(
            "SIGNUP ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Something went wrong while creating your account."
        }), 500

# =========================================================
# LOGIN
# =========================================================

@app.route(
    "/api/login",
    methods=["POST"]
)
def login():
    try:
        data = request.get_json(
            silent=True
        ) or {}

        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        if not email or not password:
            return jsonify({
                "success": False,
                "message":
                    "Email and password are required."
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                first_name,
                last_name,
                email,
                password,
                password_hash,
                salt
            FROM users
            WHERE email = ?
            """,
            (email,)
        )

        user = cursor.fetchone()

        if user is None:
            connection.close()

            return jsonify({
                "success": False,
                "message":
                    "Incorrect email or password."
            }), 401

        password_correct = False

        # New password system.
        if (
            user["password_hash"]
            and user["salt"]
        ):
            password_correct = verify_password(
                password,
                user["password_hash"],
                user["salt"]
            )

        # Old password system.
        elif (
            user["password"]
            and check_password_hash
        ):
            try:
                password_correct = check_password_hash(
                    user["password"],
                    password
                )
            except Exception:
                password_correct = False

            # Migrate old password.
            if password_correct:
                new_hash, new_salt = (
                    create_password_hash(
                        password
                    )
                )

                cursor.execute(
                    """
                    UPDATE users
                    SET
                        password_hash = ?,
                        salt = ?
                    WHERE id = ?
                    """,
                    (
                        new_hash,
                        new_salt,
                        user["id"]
                    )
                )

                connection.commit()

        if not password_correct:
            connection.close()

            return jsonify({
                "success": False,
                "message":
                    "Incorrect email or password."
            }), 401

        connection.close()

        return jsonify({
            "success": True,
            "message":
                "Login successful!",
            "user": {
                "id": user["id"],
                "firstName": user["first_name"],
                "lastName": user["last_name"],
                "email": user["email"]
            }
        }), 200

    except Exception as error:
        print(
            "LOGIN ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Something went wrong while logging in."
        }), 500


# =========================================================
# PRODUCTS API COMPATIBILITY
# =========================================================

@app.route(
    "/api/products",
    methods=["GET"]
)
def get_products():
    return jsonify({
        "success": True,
        "products": [],
        "source": "live-only"
    })


# =========================================================
# SEARCH API
# =========================================================

@app.route(
    "/api/search",
    methods=["POST"]
)
def search():
    try:
        data = request.get_json(
            silent=True
        ) or {}

        query = str(
            data.get(
                "query",
                ""
            )
        ).strip()

        if not query:
            return jsonify({
                "success": False,
                "message":
                    "Search query is required."
            }), 400

        # =================================================
        # STEP 1 — LIVE SHOPPING SEARCH
        # =================================================

        # Pakistan + International shopping search.
        pakistan_query = (
            f"{query} buy online Pakistan "
            f"price product"
        )

        international_query = (
            f"{query} buy online "
            f"price product"
        )

        pakistan_result = tinyfish_search(
            query=pakistan_query,
            location="PK",
            language="en",
            page=0
        )

        international_result = tinyfish_search(
            query=international_query,
            location="US",
            language="en",
            page=0
        )

        if (
            pakistan_result is None
            and international_result is None
        ):
            return jsonify({
                "success": False,
                "message":
                    "Live web search is currently unavailable."
            }), 502

        pakistan_results = []

        if isinstance(
            pakistan_result,
            dict
        ):
            pakistan_results = pakistan_result.get(
                "results",
                []
            )

        if not isinstance(
            pakistan_results,
            list
        ):
            pakistan_results = []

        international_results = []

        if isinstance(
            international_result,
            dict
        ):
            international_results = international_result.get(
                "results",
                []
            )

        if not isinstance(
            international_results,
            list
        ):
            international_results = []

        # Combine both markets while keeping
        # each market represented.
        web_results = []

        for item in pakistan_results:
            web_results.append(item)

        for item in international_results:
            web_results.append(item)

        # =================================================
        # STEP 2 — FILTER SHOPPING PAGES
        # =================================================

        blocked_domains = (
            "wikipedia.org",
            "youtube.com",
            "facebook.com",
            "instagram.com",
            "tiktok.com",
            "reddit.com",
            "quora.com",
            "pinterest.com",
            "twitter.com",
            "x.com",
            "linkedin.com",
            "medium.com"
        )

        blocked_paths = (
            "/wiki/",
            "/blog/",
            "/article/",
            "/articles/",
            "/news/",
            "/review/",
            "/reviews/",
            "/guide/",
            "/guides/",
            "/forum/",
            "/forums/",
            "/community/",
            "/discussion/",
            "/video/",
            "/videos/",
            "/podcast/",
            "/author/",
            "/category/",
            "/tag/"
        )

        shopping_results = []
        seen_urls = set()

        for item in web_results:
            if not isinstance(
                item,
                dict
            ):
                continue

            url = item.get(
                "url",
                ""
            )

            if not isinstance(
                url,
                str
            ):
                continue

            url = url.strip()

            if not url:
                continue

            parsed = urlparse(
                url
            )

            domain = (
                parsed.netloc
                or ""
            ).lower()

            path = (
                parsed.path
                or ""
            ).lower()

            if not domain:
                continue

            if any(
                blocked in domain
                for blocked in blocked_domains
            ):
                continue

            if any(
                blocked in path
                for blocked in blocked_paths
            ):
                continue

            if url in seen_urls:
                continue

            seen_urls.add(url)

            shopping_results.append(
                item
            )

        # Keep up to 10 candidates from each market.
        pakistan_candidates = []
        international_candidates = []

        pakistan_domains = set()

        for item in pakistan_results:
            if not isinstance(
                item,
                dict
            ):
                continue

            url = item.get(
                "url",
                ""
            )

            if not isinstance(
                url,
                str
            ):
                continue

            url = url.strip()

            if not url:
                continue

            if url not in seen_urls:
                continue

            pakistan_candidates.append(item)

            if len(pakistan_candidates) >= 10:
                break

        for item in international_results:
            if not isinstance(
                item,
                dict
            ):
                continue

            url = item.get(
                "url",
                ""
            )

            if not isinstance(
                url,
                str
            ):
                continue

            url = url.strip()

            if not url:
                continue

            if url not in seen_urls:
                continue

            international_candidates.append(item)

            if len(international_candidates) >= 10:
                break

        # Use the filtered candidates from both markets.
        shopping_results = (
            pakistan_candidates
            + international_candidates
        )

        result_urls = []

        for item in shopping_results:
            url = item.get(
                "url",
                ""
            )

            if isinstance(
                url,
                str
            ):
                url = url.strip()

                if url:
                    result_urls.append(
                        url
                    )

        # =================================================
        # STEP 3 — FETCH LIVE PAGES
        # =================================================

        # TinyFish accepts up to 10 URLs per fetch.
        # Fetch Pakistan and international candidates
        # separately so both markets can reach verification.
        fetch_batches = []

        for start in range(
            0,
            len(result_urls),
            10
        ):
            fetch_batches.append(
                result_urls[
                    start:start + 10
                ]
            )

        fetched_pages = {}

        for batch in fetch_batches:
            batch_result = tinyfish_fetch(
                batch,
                image_links=True
            )

            if batch_result is None:
                continue

            batch_pages = get_fetched_page_data(
                batch_result
            )

            fetched_pages.update(
                batch_pages
            )

        print(
            "TINYFISH:",
            len(shopping_results),
            "search candidates ->",
            len(fetched_pages),
            "verified product pages"
        )

        # =================================================
        # STEP 4 — BUILD VERIFIED PRODUCTS
        # =================================================

        products = []

        for item in shopping_results:
            if not isinstance(
                item,
                dict
            ):
                continue

            original_url = item.get(
                "url",
                ""
            )

            if not isinstance(
                original_url,
                str
            ):
                continue

            original_url = original_url.strip()

            if not original_url:
                continue

            page_data = fetched_pages.get(
                original_url
            )

            if not page_data:
                continue

            page_text = page_data.get(
                "text",
                ""
            )

            page_html = page_data.get(
                "html",
                ""
            )

            if not isinstance(
                page_text,
                str
            ):
                page_text = ""

            if not isinstance(
                page_html,
                str
            ):
                page_html = ""

            # -------------------------------------------------
            # PRODUCT NAME
            # -------------------------------------------------

            product_name = page_data.get(
                "product_name",
                ""
            )

            if not isinstance(
                product_name,
                str
            ):
                product_name = ""

            product_name = product_name.strip()

            if not product_name:
                product_name = item.get(
                    "title",
                    ""
                )

            if not isinstance(
                product_name,
                str
            ):
                continue

            product_name = product_name.strip()

            if not product_name:
                continue

            # -------------------------------------------------
            # PRICE
            # -------------------------------------------------

            combined_text = (
                f"{product_name}\n"
                f"{page_text}"
            )

            price = extract_product_price(
                page_text,
                page_html
            )

            # Do NOT discard a valid product because the
            # page parser missed a price.
            #
            # However, we also do not invent a price.
            if price is not None and price <= 0:
                price = None

            # -------------------------------------------------
            # IMAGE
            # -------------------------------------------------

            image = page_data.get(
                "image",
                ""
            )

            if not isinstance(
                image,
                str
            ):
                image = ""

            image = image.strip()

            # Exact product image is required.
            if not image:
                continue

            # -------------------------------------------------
            # OLD PRICE
            # -------------------------------------------------

            old_price = extract_old_price(
                combined_text,
                current_price=price
            )

            # -------------------------------------------------
            # RATING
            # -------------------------------------------------

            rating = extract_product_rating(
                combined_text
            )

            # -------------------------------------------------
            # STORE / BRAND
            # -------------------------------------------------

            final_url = page_data.get(
                "final_url",
                ""
            )

            if not isinstance(
                final_url,
                str
            ):
                final_url = ""

            source_url = (
                final_url
                or original_url
            )

            parsed_source = urlparse(
                source_url
            )

            source = (
                parsed_source.netloc
                .replace("www.", "")
                if parsed_source.netloc
                else ""
            )

            source = source.strip()

            # -------------------------------------------------
            # DESCRIPTION
            # -------------------------------------------------

            snippet = item.get(
                "snippet",
                ""
            )

            if not isinstance(
                snippet,
                str
            ):
                snippet = ""

            snippet = snippet.strip()

            if not snippet:
                snippet = page_text[:300].strip()

            # -------------------------------------------------
            # FINAL PRODUCT
            # -------------------------------------------------

            products.append({
                "name": product_name,
                "brand": source,
                "category": "Web Result",
                "price": price,
                "oldPrice": old_price,
                "rating": rating,
                "value": None,
                "icon": "🛍️",
                "best": False,
                "description": snippet,
                "url": source_url,
                "source": source,
                "image": image
            })

        # =================================================
        # REMOVE DUPLICATE PRODUCTS
        # =================================================

        unique_products = []
        seen_product_urls = set()

        for product in products:
            product_url = product.get(
                "url",
                ""
            )

            if product_url in seen_product_urls:
                continue

            seen_product_urls.add(
                product_url
            )

            unique_products.append(
                product
            )

        products = unique_products

        print(
            "VERIFIED PRODUCTS:",
            len(products)
        )

        # =================================================
        # RETURN
        # =================================================

        return jsonify({
            "success": True,
            "query": query,
            "source": "tinyfish",
            "total_results": len(products),
            "products": products,
            "results": products
        })

    except Exception as error:
        print(
            "SEARCH ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Something went wrong with the live search."
        }), 500


# =========================================================
# DATABASE TEST
# =========================================================

@app.route(
    "/api/database",
    methods=["GET"]
)
def database_test():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM users
            """
        )

        users_count = cursor.fetchone()[
            "total"
        ]

        cursor.execute(
            """
            PRAGMA table_info(users)
            """
        )

        user_columns = [
            row["name"]
            for row in cursor.fetchall()
        ]

        connection.close()

        return jsonify({
            "success": True,
            "database": "connected",
            "users": users_count,
            "products": "live-only",
            "user_columns": user_columns
        })

    except Exception as error:
        print(
            "DATABASE ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "database": "error",
            "message": str(error)
        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":
    init_database()

    print("")
    print("========================================")
    print("       USA SHOPPING ASSISTANT")
    print("========================================")
    print("")
    print(
        "Database:",
        DATABASE_PATH
    )
    print("")
    print(
        "Website:",
        "http://127.0.0.1:5000"
    )
    print("")
    print(
        "Live Search API:",
        "http://127.0.0.1:5000/api/search"
    )
    print("")
    print("========================================")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )