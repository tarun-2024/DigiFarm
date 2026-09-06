from flask import Flask, jsonify
from flask_cors import CORS
from database import db
from dotenv import load_dotenv
from routes import farmer_bp, routes
import os

load_dotenv()

app = Flask(__name__)


# =========================================================
# CORS
# =========================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ]
        }
    }
)


# =========================================================
# PostgreSQL
# =========================================================

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# =========================================================
# Register APIs
# =========================================================

app.register_blueprint(farmer_bp)
app.register_blueprint(routes)


# =========================================================
# Create Database Tables
# =========================================================

with app.app_context():

    from models import Farmer, Crop, Lot, Buyer,Demand

    db.create_all()

    print("Database tables created successfully!")


# =========================================================
# Home
# =========================================================

@app.route("/")
def home():

    return jsonify({
        "message": "Flask + PostgreSQL connected!"
    })


# =========================================================
# Run Flask
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000,
        use_reloader=False
    )