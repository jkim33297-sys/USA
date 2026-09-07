from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os
import secrets
import hashlib
import hmac
import re

try:
    from werkzeug.security import check_password_hash
except ImportError:
    check_password_hash = None


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
# PASSWORD SECURITY
# =========================================================

PBKDF2_ITERATIONS = 600_000
SALT_LENGTH = 32


def create_password_hash(password):

    salt = secrets.token_bytes(
        SALT_LENGTH
    )

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS
    ).hex()

    return password_hash, salt.hex()


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
# DATABASE CONNECTION
# =========================================================

def get_db_connection():

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row

    return connection


# =========================================================
# PRODUCTS
# =========================================================

PRODUCTS = [
    {
        "name": "Wireless Keyboard",
        "brand": "Logitech",
        "category": "Tech",
        "price": 29,
        "old_price": 45,
        "rating": 4.6,
        "value": 94,
        "icon": "⌨️",
        "best": True
    },
    {
        "name": "USB-C Hub",
        "brand": "Anker",
        "category": "Tech",
        "price": 24,
        "old_price": 39,
        "rating": 4.5,
        "value": 92,
        "icon": "🔌",
        "best": True
    },
    {
        "name": "Portable SSD",
        "brand": "Samsung",
        "category": "Tech",
        "price": 69,
        "old_price": 99,
        "rating": 4.7,
        "value": 95,
        "icon": "💾",
        "best": True
    },
    {
        "name": "Wireless Mouse",
        "brand": "Logitech",
        "category": "Tech",
        "price": 19,
        "old_price": 29,
        "rating": 4.5,
        "value": 93,
        "icon": "🖱️",
        "best": False
    },

    {
        "name": "Galaxy A Series",
        "brand": "Samsung",
        "category": "Smartphones",
        "price": 249,
        "old_price": 299,
        "rating": 4.5,
        "value": 91,
        "icon": "📱",
        "best": True
    },
    {
        "name": "Redmi Note Series",
        "brand": "Xiaomi",
        "category": "Smartphones",
        "price": 199,
        "old_price": 249,
        "rating": 4.4,
        "value": 94,
        "icon": "📱",
        "best": True
    },
    {
        "name": "Moto G Series",
        "brand": "Motorola",
        "category": "Smartphones",
        "price": 179,
        "old_price": 229,
        "rating": 4.3,
        "value": 90,
        "icon": "📱",
        "best": False
    },
    {
        "name": "Pixel A Series",
        "brand": "Google",
        "category": "Smartphones",
        "price": 399,
        "old_price": 449,
        "rating": 4.7,
        "value": 93,
        "icon": "📱",
        "best": True
    },

    {
        "name": "IdeaPad Slim",
        "brand": "Lenovo",
        "category": "Laptops",
        "price": 499,
        "old_price": 599,
        "rating": 4.5,
        "value": 94,
        "icon": "💻",
        "best": True
    },
    {
        "name": "Inspiron",
        "brand": "Dell",
        "category": "Laptops",
        "price": 549,
        "old_price": 699,
        "rating": 4.4,
        "value": 92,
        "icon": "💻",
        "best": True
    },
    {
        "name": "Pavilion",
        "brand": "HP",
        "category": "Laptops",
        "price": 599,
        "old_price": 749,
        "rating": 4.5,
        "value": 91,
        "icon": "💻",
        "best": False
    },
    {
        "name": "Aspire",
        "brand": "Acer",
        "category": "Laptops",
        "price": 429,
        "old_price": 549,
        "rating": 4.3,
        "value": 95,
        "icon": "💻",
        "best": True
    },

    {
        "name": "Smart Plug",
        "brand": "TP-Link",
        "category": "Gadgets",
        "price": 15,
        "old_price": 22,
        "rating": 4.5,
        "value": 94,
        "icon": "🔌",
        "best": True
    },
    {
        "name": "Smart Tracker",
        "brand": "Tile",
        "category": "Gadgets",
        "price": 24,
        "old_price": 34,
        "rating": 4.4,
        "value": 90,
        "icon": "📍",
        "best": False
    },
    {
        "name": "Mini Power Bank",
        "brand": "Anker",
        "category": "Gadgets",
        "price": 29,
        "old_price": 45,
        "rating": 4.6,
        "value": 95,
        "icon": "🔋",
        "best": True
    },
    {
        "name": "USB Desk Fan",
        "brand": "Baseus",
        "category": "Gadgets",
        "price": 18,
        "old_price": 27,
        "rating": 4.2,
        "value": 89,
        "icon": "🌀",
        "best": False
    },

    {
        "name": "Gaming Console",
        "brand": "Sony",
        "category": "Gaming",
        "price": 449,
        "old_price": 499,
        "rating": 4.8,
        "value": 91,
        "icon": "🎮",
        "best": True
    },
    {
        "name": "Gaming Console",
        "brand": "Microsoft",
        "category": "Gaming",
        "price": 399,
        "old_price": 449,
        "rating": 4.7,
        "value": 93,
        "icon": "🎮",
        "best": True
    },
    {
        "name": "Handheld Gaming Device",
        "brand": "Nintendo",
        "category": "Gaming",
        "price": 299,
        "old_price": 349,
        "rating": 4.7,
        "value": 92,
        "icon": "🎮",
        "best": False
    },
    {
        "name": "Budget Gaming Console",
        "brand": "Retro",
        "category": "Gaming",
        "price": 79,
        "old_price": 109,
        "rating": 4.3,
        "value": 96,
        "icon": "🎮",
        "best": True
    },

    {
        "name": "Mechanical Gaming Keyboard",
        "brand": "Redragon",
        "category": "Gaming Accessories",
        "price": 45,
        "old_price": 69,
        "rating": 4.6,
        "value": 95,
        "icon": "⌨️",
        "best": True
    },
    {
        "name": "Gaming Mouse",
        "brand": "Logitech",
        "category": "Gaming Accessories",
        "price": 39,
        "old_price": 59,
        "rating": 4.7,
        "value": 94,
        "icon": "🖱️",
        "best": True
    },
    {
        "name": "Gaming Headset",
        "brand": "HyperX",
        "category": "Gaming Accessories",
        "price": 49,
        "old_price": 79,
        "rating": 4.6,
        "value": 93,
        "icon": "🎧",
        "best": False
    },
    {
        "name": "Gaming Mouse Pad",
        "brand": "SteelSeries",
        "category": "Gaming Accessories",
        "price": 25,
        "old_price": 39,
        "rating": 4.5,
        "value": 91,
        "icon": "🖱️",
        "best": False
    },

    {
        "name": "Wireless Earbuds",
        "brand": "Soundcore",
        "category": "Headphones & Audio",
        "price": 39,
        "old_price": 59,
        "rating": 4.6,
        "value": 95,
        "icon": "🎧",
        "best": True
    },
    {
        "name": "Noise Cancelling Headphones",
        "brand": "Sony",
        "category": "Headphones & Audio",
        "price": 199,
        "old_price": 249,
        "rating": 4.8,
        "value": 93,
        "icon": "🎧",
        "best": True
    },
    {
        "name": "Bluetooth Speaker",
        "brand": "JBL",
        "category": "Headphones & Audio",
        "price": 59,
        "old_price": 79,
        "rating": 4.7,
        "value": 94,
        "icon": "🔊",
        "best": True
    },
    {
        "name": "Budget Earbuds",
        "brand": "JLab",
        "category": "Headphones & Audio",
        "price": 25,
        "old_price": 35,
        "rating": 4.3,
        "value": 96,
        "icon": "🎧",
        "best": True
    },

    {
        "name": "Hair Dryer",
        "brand": "Remington",
        "category": "Beauty",
        "price": 39,
        "old_price": 55,
        "rating": 4.5,
        "value": 92,
        "icon": "💇",
        "best": True
    },
    {
        "name": "Hair Straightener",
        "brand": "Revlon",
        "category": "Beauty",
        "price": 29,
        "old_price": 45,
        "rating": 4.4,
        "value": 94,
        "icon": "💇",
        "best": True
    },
    {
        "name": "Makeup Brush Set",
        "brand": "Real Techniques",
        "category": "Beauty",
        "price": 22,
        "old_price": 35,
        "rating": 4.6,
        "value": 95,
        "icon": "💄",
        "best": True
    },
    {
        "name": "LED Vanity Mirror",
        "brand": "Conair",
        "category": "Beauty",
        "price": 35,
        "old_price": 49,
        "rating": 4.4,
        "value": 90,
        "icon": "🪞",
        "best": False
    },

    {
        "name": "Daily Moisturizer",
        "brand": "CeraVe",
        "category": "Skincare",
        "price": 16,
        "old_price": 20,
        "rating": 4.8,
        "value": 96,
        "icon": "🧴",
        "best": True
    },
    {
        "name": "Gentle Cleanser",
        "brand": "CeraVe",
        "category": "Skincare",
        "price": 14,
        "old_price": 18,
        "rating": 4.7,
        "value": 95,
        "icon": "🧴",
        "best": True
    },
    {
        "name": "Hydrating Serum",
        "brand": "The Ordinary",
        "category": "Skincare",
        "price": 12,
        "old_price": 16,
        "rating": 4.6,
        "value": 97,
        "icon": "🧴",
        "best": True
    },
    {
        "name": "Sunscreen",
        "brand": "Neutrogena",
        "category": "Skincare",
        "price": 13,
        "old_price": 18,
        "rating": 4.5,
        "value": 94,
        "icon": "☀️",
        "best": True
    },

    {
        "name": "Air Fryer",
        "brand": "Cosori",
        "category": "Home Appliances",
        "price": 79,
        "old_price": 109,
        "rating": 4.7,
        "value": 95,
        "icon": "🍟",
        "best": True
    },
    {
        "name": "Robot Vacuum",
        "brand": "Eufy",
        "category": "Home Appliances",
        "price": 179,
        "old_price": 249,
        "rating": 4.5,
        "value": 92,
        "icon": "🤖",
        "best": True
    },
    {
        "name": "Electric Kettle",
        "brand": "Hamilton Beach",
        "category": "Home Appliances",
        "price": 29,
        "old_price": 39,
        "rating": 4.6,
        "value": 96,
        "icon": "🫖",
        "best": True
    },
    {
        "name": "Tower Fan",
        "brand": "Honeywell",
        "category": "Home Appliances",
        "price": 49,
        "old_price": 69,
        "rating": 4.4,
        "value": 91,
        "icon": "🌀",
        "best": False
    },

    {
        "name": "Non-Stick Pan",
        "brand": "T-fal",
        "category": "Kitchen",
        "price": 29,
        "old_price": 45,
        "rating": 4.6,
        "value": 95,
        "icon": "🍳",
        "best": True
    },
    {
        "name": "Blender",
        "brand": "Ninja",
        "category": "Kitchen",
        "price": 69,
        "old_price": 99,
        "rating": 4.7,
        "value": 94,
        "icon": "🥤",
        "best": True
    },
    {
        "name": "Coffee Maker",
        "brand": "Hamilton Beach",
        "category": "Kitchen",
        "price": 39,
        "old_price": 59,
        "rating": 4.5,
        "value": 93,
        "icon": "☕",
        "best": True
    },
    {
        "name": "Food Storage Set",
        "brand": "Rubbermaid",
        "category": "Kitchen",
        "price": 25,
        "old_price": 35,
        "rating": 4.6,
        "value": 94,
        "icon": "🥡",
        "best": False
    },

    {
        "name": "LED Desk Lamp",
        "brand": "Philips",
        "category": "Home & Living",
        "price": 25,
        "old_price": 39,
        "rating": 4.6,
        "value": 95,
        "icon": "💡",
        "best": True
    },
    {
        "name": "Memory Foam Pillow",
        "brand": "Amazon Basics",
        "category": "Home & Living",
        "price": 24,
        "old_price": 35,
        "rating": 4.5,
        "value": 94,
        "icon": "🛏️",
        "best": True
    },
    {
        "name": "Throw Blanket",
        "brand": "Bedsure",
        "category": "Home & Living",
        "price": 29,
        "old_price": 45,
        "rating": 4.7,
        "value": 96,
        "icon": "🛋️",
        "best": True
    },
    {
        "name": "Storage Organizer",
        "brand": "Sterilite",
        "category": "Home & Living",
        "price": 19,
        "old_price": 29,
        "rating": 4.4,
        "value": 92,
        "icon": "📦",
        "best": False
    },

    {
        "name": "Classic Hoodie",
        "brand": "Hanes",
        "category": "Fashion",
        "price": 25,
        "old_price": 40,
        "rating": 4.5,
        "value": 94,
        "icon": "👕",
        "best": True
    },
    {
        "name": "Everyday Sneakers",
        "brand": "New Balance",
        "category": "Fashion",
        "price": 69,
        "old_price": 89,
        "rating": 4.6,
        "value": 92,
        "icon": "👟",
        "best": True
    },
    {
        "name": "Basic T-Shirt",
        "brand": "Uniqlo",
        "category": "Fashion",
        "price": 15,
        "old_price": 20,
        "rating": 4.5,
        "value": 96,
        "icon": "👕",
        "best": True
    },
    {
        "name": "Casual Backpack",
        "brand": "Jansport",
        "category": "Fashion",
        "price": 39,
        "old_price": 55,
        "rating": 4.6,
        "value": 94,
        "icon": "🎒",
        "best": False
    },

    {
        "name": "Yoga Mat",
        "brand": "Gaiam",
        "category": "Fitness",
        "price": 25,
        "old_price": 35,
        "rating": 4.7,
        "value": 96,
        "icon": "🧘",
        "best": True
    },
    {
        "name": "Resistance Bands",
        "brand": "Fit Simplify",
        "category": "Fitness",
        "price": 18,
        "old_price": 27,
        "rating": 4.6,
        "value": 97,
        "icon": "🏋️",
        "best": True
    },
    {
        "name": "Adjustable Dumbbells",
        "brand": "Bowflex",
        "category": "Fitness",
        "price": 149,
        "old_price": 199,
        "rating": 4.7,
        "value": 91,
        "icon": "🏋️",
        "best": True
    },
    {
        "name": "Fitness Tracker",
        "brand": "Xiaomi",
        "category": "Fitness",
        "price": 39,
        "old_price": 59,
        "rating": 4.4,
        "value": 95,
        "icon": "⌚",
        "best": True
    },

    {
        "name": "Mirrorless Camera",
        "brand": "Sony",
        "category": "Cameras",
        "price": 649,
        "old_price": 749,
        "rating": 4.8,
        "value": 91,
        "icon": "📷",
        "best": True
    },
    {
        "name": "Action Camera",
        "brand": "GoPro",
        "category": "Cameras",
        "price": 299,
        "old_price": 349,
        "rating": 4.7,
        "value": 93,
        "icon": "📷",
        "best": True
    },
    {
        "name": "Compact Camera",
        "brand": "Canon",
        "category": "Cameras",
        "price": 299,
        "old_price": 349,
        "rating": 4.5,
        "value": 90,
        "icon": "📷",
        "best": False
    },
    {
        "name": "Instant Camera",
        "brand": "Fujifilm",
        "category": "Cameras",
        "price": 69,
        "old_price": 89,
        "rating": 4.6,
        "value": 94,
        "icon": "📸",
        "best": True
    },

    {
        "name": "Smart Watch",
        "brand": "Amazfit",
        "category": "Accessories",
        "price": 89,
        "old_price": 119,
        "rating": 4.5,
        "value": 94,
        "icon": "⌚",
        "best": True
    },
    {
        "name": "Laptop Sleeve",
        "brand": "Tomtoc",
        "category": "Accessories",
        "price": 25,
        "old_price": 35,
        "rating": 4.7,
        "value": 96,
        "icon": "💼",
        "best": True
    },
    {
        "name": "Phone Stand",
        "brand": "UGREEN",
        "category": "Accessories",
        "price": 15,
        "old_price": 25,
        "rating": 4.6,
        "value": 95,
        "icon": "📱",
        "best": True
    },
    {
        "name": "USB-C Cable",
        "brand": "Anker",
        "category": "Accessories",
        "price": 12,
        "old_price": 19,
        "rating": 4.7,
        "value": 98,
        "icon": "🔌",
        "best": True
    },

    {
        "name": "Adventure Game",
        "brand": "Digital Store",
        "category": "Online Games",
        "price": 29,
        "old_price": 59,
        "rating": 4.6,
        "value": 94,
        "icon": "🎮",
        "best": True
    },
    {
        "name": "Racing Game",
        "brand": "Digital Store",
        "category": "Online Games",
        "price": 24,
        "old_price": 49,
        "rating": 4.5,
        "value": 95,
        "icon": "🏎️",
        "best": True
    },
    {
        "name": "Strategy Game",
        "brand": "Digital Store",
        "category": "Online Games",
        "price": 19,
        "old_price": 39,
        "rating": 4.4,
        "value": 96,
        "icon": "♟️",
        "best": True
    },
    {
        "name": "Multiplayer Game",
        "brand": "Digital Store",
        "category": "Online Games",
        "price": 34,
        "old_price": 59,
        "rating": 4.7,
        "value": 93,
        "icon": "🎮",
        "best": False
    },

    {
        "name": "Study Desk Lamp",
        "brand": "IKEA",
        "category": "Office & Study",
        "price": 29,
        "old_price": 39,
        "rating": 4.6,
        "value": 94,
        "icon": "💡",
        "best": True
    },
    {
        "name": "Notebook Set",
        "brand": "Moleskine",
        "category": "Office & Study",
        "price": 18,
        "old_price": 25,
        "rating": 4.5,
        "value": 92,
        "icon": "📓",
        "best": False
    },
    {
        "name": "Wireless Printer",
        "brand": "HP",
        "category": "Office & Study",
        "price": 89,
        "old_price": 119,
        "rating": 4.4,
        "value": 91,
        "icon": "🖨️",
        "best": True
    },
    {
        "name": "Desk Organizer",
        "brand": "Amazon Basics",
        "category": "Office & Study",
        "price": 16,
        "old_price": 25,
        "rating": 4.5,
        "value": 95,
        "icon": "📚",
        "best": True
    }
]


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def init_database():

    connection = get_db_connection()

    cursor = connection.cursor()


    # -----------------------------------------------------
    # USERS TABLE
    # -----------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            first_name TEXT NOT NULL,

            last_name TEXT NOT NULL,

            email TEXT NOT NULL UNIQUE,

            password TEXT,

            password_hash TEXT,

            salt TEXT,

            created_at
                TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # -----------------------------------------------------
    # PRODUCTS TABLE
    # -----------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            brand TEXT NOT NULL,

            category TEXT NOT NULL,

            price REAL NOT NULL,

            old_price REAL,

            rating REAL,

            value INTEGER,

            icon TEXT,

            best INTEGER DEFAULT 0
        )
    """)


    # -----------------------------------------------------
    # CHECK OLD USERS TABLE
    # -----------------------------------------------------

    cursor.execute(
        "PRAGMA table_info(users)"
    )

    user_columns = {
        row["name"]
        for row in cursor.fetchall()
    }


    # Add missing password_hash column

    if "password_hash" not in user_columns:

        cursor.execute("""
            ALTER TABLE users
            ADD COLUMN password_hash TEXT
        """)


    # Add missing salt column

    if "salt" not in user_columns:

        cursor.execute("""
            ALTER TABLE users
            ADD COLUMN salt TEXT
        """)


    # Add missing old password column

    if "password" not in user_columns:

        cursor.execute("""
            ALTER TABLE users
            ADD COLUMN password TEXT
        """)


    # -----------------------------------------------------
    # CHECK PRODUCTS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM products
    """)

    product_count = cursor.fetchone()["total"]


    # -----------------------------------------------------
    # INSERT PRODUCTS ONLY IF TABLE IS EMPTY
    # -----------------------------------------------------

    if product_count == 0:

        for product in PRODUCTS:

            cursor.execute("""
                INSERT INTO products
                (
                    name,
                    brand,
                    category,
                    price,
                    old_price,
                    rating,
                    value,
                    icon,
                    best
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (

                product["name"],

                product["brand"],

                product["category"],

                product["price"],

                product["old_price"],

                product["rating"],

                product["value"],

                product["icon"],

                1 if product["best"] else 0

            ))


        print(
            f"Inserted {len(PRODUCTS)} products into database."
        )

    else:

        print(
            f"Products table already contains "
            f"{product_count} products."
        )


    connection.commit()

    connection.close()


    print(
        "Database initialized successfully."
    )


# =========================================================
# PRODUCT CONVERTER
# =========================================================

def product_to_dict(row):

    return {

        "id":
            row["id"],

        "name":
            row["name"],

        "brand":
            row["brand"],

        "category":
            row["category"],

        "price":
            row["price"],

        "oldPrice":
            row["old_price"],

        "rating":
            row["rating"],

        "value":
            row["value"],

        "icon":
            row["icon"],

        "best":
            bool(row["best"])

    }


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
def frontend_files(filename):

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


        first_name = data.get(
            "firstName",
            ""
        ).strip()


        last_name = data.get(
            "lastName",
            ""
        ).strip()


        email = data.get(
            "email",
            ""
        ).strip().lower()


        password = data.get(
            "password",
            ""
        )


        if not first_name:

            return jsonify({

                "success": False,

                "message":
                    "First name is required."

            }), 400


        if not last_name:

            return jsonify({

                "success": False,

                "message":
                    "Last name is required."

            }), 400


        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Email is required."

            }), 400


        if not password:

            return jsonify({

                "success": False,

                "message":
                    "Password is required."

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

            cursor.execute("""
                INSERT INTO users
                (
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    salt
                )
                VALUES (?, ?, ?, ?, ?)
            """, (

                first_name,

                last_name,

                email,

                password_hash,

                salt

            ))


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
                "Account created successfully!"

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


        email = data.get(
            "email",
            ""
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


        cursor.execute("""
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
        """, (email,))


        user = cursor.fetchone()


        if user is None:

            connection.close()

            return jsonify({

                "success": False,

                "message":
                    "Incorrect email or password."

            }), 401


        # -------------------------------------------------
        # NEW PASSWORD SYSTEM
        # -------------------------------------------------

        if (
            user["password_hash"]
            and
            user["salt"]
        ):

            password_correct = verify_password(

                password,

                user["password_hash"],

                user["salt"]

            )


        # -------------------------------------------------
        # OLD PASSWORD SYSTEM
        # -------------------------------------------------

        elif (
            user["password"]
            and
            check_password_hash
        ):

            try:

                password_correct = check_password_hash(

                    user["password"],

                    password

                )

            except Exception:

                password_correct = False


            # -------------------------------------------------
            # MIGRATE OLD PASSWORD TO NEW SYSTEM
            # -------------------------------------------------

            if password_correct:

                new_hash, new_salt = create_password_hash(
                    password
                )


                cursor.execute("""
                    UPDATE users

                    SET
                        password_hash = ?,
                        salt = ?

                    WHERE id = ?
                """, (

                    new_hash,

                    new_salt,

                    user["id"]

                ))


                connection.commit()


        else:

            password_correct = False


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

                "id":
                    user["id"],

                "firstName":
                    user["first_name"],

                "lastName":
                    user["last_name"],

                "email":
                    user["email"]

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
# GET ALL PRODUCTS
# =========================================================

@app.route(
    "/api/products",
    methods=["GET"]
)
def get_products():

    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        cursor.execute("""
            SELECT
                id,
                name,
                brand,
                category,
                price,
                old_price,
                rating,
                value,
                icon,
                best
            FROM products

            ORDER BY
                value DESC,
                rating DESC,
                price ASC
        """)


        rows = cursor.fetchall()

        connection.close()


        products = [

            product_to_dict(row)

            for row in rows

        ]


        return jsonify({

            "success": True,

            "products":
                products

        })


    except Exception as error:

        print(
            "PRODUCT API ERROR:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Could not load products."

        }), 500


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


        query = data.get(
            "query",
            ""
        ).strip()


        if not query:

            return jsonify({

                "success": False,

                "message":
                    "Search query is required."

            }), 400


        # -------------------------------------------------
        # ORIGINAL QUERY
        # -------------------------------------------------

        original_query = query


        # -------------------------------------------------
        # LOWERCASE QUERY
        # -------------------------------------------------

        search_query = query.lower()


        # -------------------------------------------------
        # CATEGORY ALIASES
        # -------------------------------------------------

        category_aliases = {

            "phone": "Smartphones",

            "phones": "Smartphones",

            "smartphone": "Smartphones",

            "smartphones": "Smartphones",

            "laptop": "Laptops",

            "laptops": "Laptops",

            "computer": "Laptops",

            "computers": "Laptops",

            "headphone": "Headphones & Audio",

            "headphones": "Headphones & Audio",

            "earbuds": "Headphones & Audio",

            "earbud": "Headphones & Audio",

            "camera": "Cameras",

            "cameras": "Cameras",

            "gaming": "Gaming",

            "beauty": "Beauty",

            "skincare": "Skincare",

            "kitchen": "Kitchen",

            "fitness": "Fitness",

            "fashion": "Fashion"

        }


        detected_category = None


        for keyword, category in category_aliases.items():

            if re.search(
                rf"\b{re.escape(keyword)}\b",
                search_query
            ):

                detected_category = category

                break


        # -------------------------------------------------
        # PRICE LIMIT
        # -------------------------------------------------

        price_limit = None


        price_patterns = [

            r"under\s*\$?\s*([\d,]+(?:\.\d+)?)",

            r"below\s*\$?\s*([\d,]+(?:\.\d+)?)",

            r"less than\s*\$?\s*([\d,]+(?:\.\d+)?)",

            r"up to\s*\$?\s*([\d,]+(?:\.\d+)?)",

            r"within\s*\$?\s*([\d,]+(?:\.\d+)?)"

        ]


        for pattern in price_patterns:

            match = re.search(
                pattern,
                search_query
            )

            if match:

                price_text = (
                    match.group(1)
                    .replace(",", "")
                )


                try:

                    price_limit = float(
                        price_text
                    )

                except ValueError:

                    price_limit = None


                break


        # -------------------------------------------------
        # DATABASE SEARCH
        # -------------------------------------------------

        connection = get_db_connection()

        cursor = connection.cursor()


        if detected_category and price_limit is not None:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    brand,
                    category,
                    price,
                    old_price,
                    rating,
                    value,
                    icon,
                    best
                FROM products

                WHERE
                    category = ?
                    AND price <= ?

                ORDER BY
                    value DESC,
                    rating DESC,
                    price ASC
            """, (

                detected_category,

                price_limit

            ))


        elif detected_category:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    brand,
                    category,
                    price,
                    old_price,
                    rating,
                    value,
                    icon,
                    best
                FROM products

                WHERE category = ?

                ORDER BY
                    value DESC,
                    rating DESC,
                    price ASC
            """, (

                detected_category,

            ))


        elif price_limit is not None:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    brand,
                    category,
                    price,
                    old_price,
                    rating,
                    value,
                    icon,
                    best
                FROM products

                WHERE price <= ?

                ORDER BY
                    value DESC,
                    rating DESC,
                    price ASC
            """, (

                price_limit,

            ))


        else:

            search_value = f"%{search_query}%"


            cursor.execute("""
                SELECT
                    id,
                    name,
                    brand,
                    category,
                    price,
                    old_price,
                    rating,
                    value,
                    icon,
                    best
                FROM products

                WHERE
                    LOWER(name) LIKE ?
                    OR LOWER(brand) LIKE ?
                    OR LOWER(category) LIKE ?

                ORDER BY
                    value DESC,
                    rating DESC,
                    price ASC
            """, (

                search_value,

                search_value,

                search_value

            ))


        rows = cursor.fetchall()

        connection.close()


        products = [

            product_to_dict(row)

            for row in rows

        ]


        return jsonify({

            "success": True,

            "query":
                original_query,

            "products":
                products

        })


    except Exception as error:

        print(
            "SEARCH ERROR:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Something went wrong with the search."

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


        # -------------------------------------------------
        # USER COUNT
        # -------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM users
        """)


        users_count = cursor.fetchone()["total"]


        # -------------------------------------------------
        # PRODUCT COUNT
        # -------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM products
        """)


        products_count = cursor.fetchone()["total"]


        # -------------------------------------------------
        # USER COLUMNS
        # -------------------------------------------------

        cursor.execute("""
            PRAGMA table_info(users)
        """)


        user_columns = [

            row["name"]

            for row in cursor.fetchall()

        ]


        # -------------------------------------------------
        # PRODUCT COLUMNS
        # -------------------------------------------------

        cursor.execute("""
            PRAGMA table_info(products)
        """)


        product_columns = [

            row["name"]

            for row in cursor.fetchall()

        ]


        connection.close()


        # -------------------------------------------------
        # RETURN DATABASE INFORMATION
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "database":
                "connected",

            "users":
                users_count,

            "products":
                products_count,

            "user_columns":
                user_columns,

            "product_columns":
                product_columns

        })


    except Exception as error:

        print(
            "DATABASE ERROR:",
            error
        )

        return jsonify({

            "success": False,

            "database":
                "error",

            "message":
                str(error)

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
        "API:",
        "http://127.0.0.1:5000/api/products"
    )

    print("")

    print("========================================")
    print("")


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )