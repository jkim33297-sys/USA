from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os

from werkzeug.security import generate_password_hash


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "Frontend"
)

DATABASE_PATH = os.path.join(
    BASE_DIR,
    "Database",
    "usa.db"
)


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# INDEX PAGE
# ==========================================

@app.route("/")
def index():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ==========================================
# SIGN UP API
# ==========================================

@app.route("/api/signup", methods=["POST"])
def signup():

    data = request.get_json()

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


    # ======================================
    # VALIDATION
    # ======================================

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
            "message": "Password must be at least 8 characters."
        }), 400


    # ======================================
    # HASH PASSWORD
    # ======================================

    password_hash = generate_password_hash(
        password
    )


    # ======================================
    # SAVE USER
    # ======================================

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    cursor = connection.cursor()


    try:

        cursor.execute(
            """
            INSERT INTO users
            (
                first_name,
                last_name,
                email,
                password
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                first_name,
                last_name,
                email,
                password_hash
            )
        )


        connection.commit()


        return jsonify({

            "success": True,

            "message":
                "Account created successfully!"

        })


    except sqlite3.IntegrityError:

        return jsonify({

            "success": False,

            "message":
                "An account with this email already exists."

        }), 409


    finally:

        connection.close()


# ==========================================
# SEARCH API
# ==========================================

@app.route("/api/search", methods=["POST"])
def search():

    data = request.get_json()

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


    return jsonify({

        "success": True,

        "query": query,

        "message":
            "USA received your search.",

        "products": []

    })


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )