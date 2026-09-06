from flask import Blueprint, request, jsonify
from database import db
from models import Farmer, Crop, Lot,Buyer,Demand
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


farmer_bp = Blueprint(
    "farmer",
    __name__,
    url_prefix="/api"
)
routes = Blueprint("routes", __name__)

# =========================================================
# CREATE FARMER / REGISTER
# =========================================================

@farmer_bp.route("/farmers", methods=["POST"])
def create_farmer():

    data = request.get_json()

    try:

        # -------------------------------------------------
        # Validate request
        # -------------------------------------------------

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400


        # -------------------------------------------------
        # Get and validate mobile number
        # -------------------------------------------------

        mobile = str(
            data.get("mobile", "")
        ).strip()


        if not mobile:
            return jsonify({
                "success": False,
                "error": "Mobile number is required"
            }), 400


        if not mobile.isdigit() or len(mobile) != 10:
            return jsonify({
                "success": False,
                "error": "Please enter a valid 10-digit mobile number"
            }), 400


        # -------------------------------------------------
        # Get and validate password
        # -------------------------------------------------

        password = str(
            data.get("password", "")
        ).strip()


        if not password:
            return jsonify({
                "success": False,
                "error": "Password is required"
            }), 400


        if len(password) < 6:
            return jsonify({
                "success": False,
                "error": "Password must be at least 6 characters long"
            }), 400


        # -------------------------------------------------
        # Check if farmer already exists
        # -------------------------------------------------

        existing_farmer = Farmer.query.filter_by(
            mobile=mobile
        ).first()


        if existing_farmer:

            return jsonify({
                "success": False,
                "error": "A farmer with this mobile number already exists.",
                "farmer_id": existing_farmer.id
            }), 409


        # -------------------------------------------------
        # Convert Yes / No to Boolean
        # -------------------------------------------------

        fpo_member = (
            str(
                data.get("fpoMember", "")
            )
            .strip()
            .lower()
            == "yes"
        )


        storage_available = (
            str(
                data.get("storageAvailable", "")
            )
            .strip()
            .lower()
            == "yes"
        )


        # -------------------------------------------------
        # Hash password
        # -------------------------------------------------

        password_hash = generate_password_hash(
            password
        )


        # -------------------------------------------------
        # Create Farmer
        # -------------------------------------------------

        farmer = Farmer(

            name=data["name"],

            mobile=mobile,

            password_hash=password_hash,

            state=data["state"],

            district=data["district"],

            village=data["village"],

            language=data["language"],

            farm_size=float(
                data["farmSize"]
            ),

            irrigation=data["irrigation"],

            fpo_member=fpo_member,

            fpo_name=data.get("fpoName"),

            payment_need=data["paymentNeed"],

            storage_available=storage_available,

            storage_duration=data.get(
                "storageDuration"
            ),

            minimum_price=float(
                data["minimumPrice"]
            )
        )


        # -------------------------------------------------
        # Add Farmer to database
        # -------------------------------------------------

        db.session.add(farmer)

        # Generate farmer ID
        db.session.flush()


        # -------------------------------------------------
        # Add Crops
        # -------------------------------------------------

        for crop_data in data.get("crops", []):

            crop = Crop(

                farmer_id=farmer.id,

                crop=crop_data["crop"],

                variety=crop_data.get(
                    "variety"
                ),

                quantity=float(
                    crop_data["quantity"]
                ),

                harvest_date=datetime.strptime(
                    crop_data["harvestDate"],
                    "%Y-%m-%d"
                ).date(),

                expected_selling_date=datetime.strptime(
                    crop_data["expectedSellingDate"],
                    "%Y-%m-%d"
                ).date()
            )

            db.session.add(crop)


        # -------------------------------------------------
        # Commit transaction
        # -------------------------------------------------

        db.session.commit()


        # -------------------------------------------------
        # Success response
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "Farmer onboarding completed successfully",

            "farmer_id":
                farmer.id

        }), 201


    # =====================================================
    # Missing / invalid data
    # =====================================================

    except KeyError as e:

        db.session.rollback()

        return jsonify({

            "success": False,

            "error":
                f"Missing required field: {e.args[0]}"

        }), 400


    # =====================================================
    # Invalid number / date
    # =====================================================

    except ValueError:

        db.session.rollback()

        return jsonify({

            "success": False,

            "error":
                "Please enter valid numeric and date values."

        }), 400


    # =====================================================
    # Any other database/server error
    # =====================================================

    except Exception as e:

        db.session.rollback()

        print(
            "ERROR CREATING FARMER:",
            str(e)
        )

        return jsonify({

            "success": False,

            "error":
                "Something went wrong while creating the farmer profile."

        }), 500


# =========================================================
# FARMER LOGIN
# =========================================================

@farmer_bp.route("/login", methods=["POST"])
def farmer_login():

    data = request.get_json()

    try:

        # -------------------------------------------------
        # Validate request
        # -------------------------------------------------

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400


        # -------------------------------------------------
        # Get mobile
        # -------------------------------------------------

        mobile = str(
            data.get("mobile", "")
        ).strip()


        # -------------------------------------------------
        # Get password
        # -------------------------------------------------

        password = str(
            data.get("password", "")
        ).strip()


        if not mobile:
            return jsonify({
                "success": False,
                "error": "Mobile number is required"
            }), 400


        if not password:
            return jsonify({
                "success": False,
                "error": "Password is required"
            }), 400


        # -------------------------------------------------
        # Find farmer
        # -------------------------------------------------

        farmer = Farmer.query.filter_by(
            mobile=mobile
        ).first()


        if not farmer:

            return jsonify({
                "success": False,
                "error": "Invalid mobile number or password"
            }), 401


        # -------------------------------------------------
        # Check password
        # -------------------------------------------------

        if not check_password_hash(
            farmer.password_hash,
            password
        ):

            return jsonify({
                "success": False,
                "error": "Invalid mobile number or password"
            }), 401


        # -------------------------------------------------
        # Successful login
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message": "Login successful",

            "farmer": {

                "id": farmer.id,

                "name": farmer.name,

                "mobile": farmer.mobile,

                "state": farmer.state,

                "district": farmer.district,

                "village": farmer.village,

                "language": farmer.language

            }

        }), 200


    except Exception as e:

        print(
            "ERROR FARMER LOGIN:",
            str(e)
        )

        return jsonify({

            "success": False,

            "error":
                "Unable to login. Please try again."

        }), 500


# =========================================================
# GET FARMER
# =========================================================

@farmer_bp.route(
    "/farmers/<int:farmer_id>",
    methods=["GET"]
)
def get_farmer(farmer_id):

    try:

        farmer = Farmer.query.get(
            farmer_id
        )


        # -------------------------------------------------
        # Farmer not found
        # -------------------------------------------------

        if not farmer:

            return jsonify({

                "success": False,

                "error":
                    "Farmer not found"

            }), 404


        # -------------------------------------------------
        # Return farmer data
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "farmer": {

                "id": farmer.id,

                "name": farmer.name,

                "mobile": farmer.mobile,

                "state": farmer.state,

                "district": farmer.district,

                "village": farmer.village,

                "language": farmer.language,

                "farmSize":
                    farmer.farm_size,

                "irrigation":
                    farmer.irrigation,

                "fpoMember":
                    farmer.fpo_member,

                "fpoName":
                    farmer.fpo_name,

                "paymentNeed":
                    farmer.payment_need,

                "storageAvailable":
                    farmer.storage_available,

                "storageDuration":
                    farmer.storage_duration,

                "minimumPrice":
                    farmer.minimum_price,

                # IMPORTANT:
                # password_hash is NOT returned

                "crops": [

                    {
                        "id":
                            crop.id,

                        "crop":
                            crop.crop,

                        "variety":
                            crop.variety,

                        "quantity":
                            crop.quantity,

                        "harvestDate":
                            crop.harvest_date.isoformat(),

                        "expectedSellingDate":
                            crop.expected_selling_date.isoformat()
                    }

                    for crop in farmer.crops
                ]
            }

        }), 200


    except Exception as e:

        print(
            "ERROR GETTING FARMER:",
            str(e)
        )

        return jsonify({

            "success": False,

            "error":
                "Unable to fetch farmer information."

        }), 500

# =========================================================
# GET ALL LOTS OF A FARMER
# =========================================================

@routes.route("/api/farmers/<int:farmer_id>/lots", methods=["GET"])
def get_farmer_lots(farmer_id):

    farmer = Farmer.query.get(farmer_id)

    if not farmer:
        return jsonify({
            "success": False,
            "message": "Farmer not found"
        }), 404

    lots = Lot.query.filter_by(
        farmer_id=farmer_id
    ).order_by(
        Lot.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "lots": [lot.to_dict() for lot in lots]
    }), 200


# =========================================================
# GET SINGLE LOT
# =========================================================

@routes.route(
    "/api/farmers/<int:farmer_id>/lots/<int:lot_id>",
    methods=["GET"]
)
def get_lot(farmer_id, lot_id):

    lot = Lot.query.filter_by(
        id=lot_id,
        farmer_id=farmer_id
    ).first()

    if not lot:
        return jsonify({
            "success": False,
            "message": "Lot not found"
        }), 404

    return jsonify({
        "success": True,
        "lot": lot.to_dict()
    }), 200


# =========================================================
# CREATE LOT
# =========================================================

@routes.route(
    "/api/farmers/<int:farmer_id>/lots",
    methods=["POST"]
)
def create_lot(farmer_id):

    farmer = Farmer.query.get(farmer_id)

    if not farmer:
        return jsonify({
            "success": False,
            "message": "Farmer not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    crop = data.get("crop")
    quantity = data.get("quantity")
    unit = data.get("unit")
    quality_grade = data.get("quality_grade")

    if not crop:
        return jsonify({
            "success": False,
            "message": "Crop is required"
        }), 400

    if quantity is None:
        return jsonify({
            "success": False,
            "message": "Quantity is required"
        }), 400

    if not unit:
        return jsonify({
            "success": False,
            "message": "Unit is required"
        }), 400

    if not quality_grade:
        return jsonify({
            "success": False,
            "message": "Quality grade is required"
        }), 400

    try:

        available_from = None
        expected_sale_date = None

        if data.get("available_from"):
            available_from = datetime.strptime(
                data["available_from"],
                "%Y-%m-%d"
            ).date()

        if data.get("expected_sale_date"):
            expected_sale_date = datetime.strptime(
                data["expected_sale_date"],
                "%Y-%m-%d"
            ).date()

        lot = Lot(
            farmer_id=farmer_id,

            crop=crop,
            variety=data.get("variety"),

            quantity=float(quantity),
            unit=unit,

            quality_grade=quality_grade,

            expected_price=(
                float(data["expected_price"])
                if data.get("expected_price") not in [None, ""]
                else None
            ),

            minimum_price=(
                float(data["minimum_price"])
                if data.get("minimum_price") not in [None, ""]
                else None
            ),

            available_from=available_from,
            expected_sale_date=expected_sale_date,

            pickup_location=data.get("pickup_location"),

            state=data.get("state"),
            district=data.get("district"),
            village=data.get("village"),

            description=data.get("description"),
            packaging_type=data.get("packaging_type"),

            status="Available"
        )

        db.session.add(lot)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Lot created successfully",
            "lot": lot.to_dict()
        }), 201

    except Exception as e:

        db.session.rollback()

        print("CREATE LOT ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Failed to create lot",
            "error": str(e)
        }), 500


# =========================================================
# UPDATE LOT
# =========================================================

@routes.route(
    "/api/farmers/<int:farmer_id>/lots/<int:lot_id>",
    methods=["PUT"]
)
def update_lot(farmer_id, lot_id):

    lot = Lot.query.filter_by(
        id=lot_id,
        farmer_id=farmer_id
    ).first()

    if not lot:
        return jsonify({
            "success": False,
            "message": "Lot not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    try:

        if "crop" in data:
            lot.crop = data["crop"]

        if "variety" in data:
            lot.variety = data["variety"]

        if "quantity" in data:
            lot.quantity = float(data["quantity"])

        if "unit" in data:
            lot.unit = data["unit"]

        if "quality_grade" in data:
            lot.quality_grade = data["quality_grade"]

        if "expected_price" in data:
            lot.expected_price = (
                float(data["expected_price"])
                if data["expected_price"] not in [None, ""]
                else None
            )

        if "minimum_price" in data:
            lot.minimum_price = (
                float(data["minimum_price"])
                if data["minimum_price"] not in [None, ""]
                else None
            )

        if "available_from" in data:
            lot.available_from = (
                datetime.strptime(
                    data["available_from"],
                    "%Y-%m-%d"
                ).date()
                if data["available_from"]
                else None
            )

        if "expected_sale_date" in data:
            lot.expected_sale_date = (
                datetime.strptime(
                    data["expected_sale_date"],
                    "%Y-%m-%d"
                ).date()
                if data["expected_sale_date"]
                else None
            )

        if "pickup_location" in data:
            lot.pickup_location = data["pickup_location"]

        if "state" in data:
            lot.state = data["state"]

        if "district" in data:
            lot.district = data["district"]

        if "village" in data:
            lot.village = data["village"]

        if "description" in data:
            lot.description = data["description"]

        if "packaging_type" in data:
            lot.packaging_type = data["packaging_type"]

        if "status" in data:
            lot.status = data["status"]

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Lot updated successfully",
            "lot": lot.to_dict()
        }), 200

    except Exception as e:

        db.session.rollback()

        print("UPDATE LOT ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Failed to update lot",
            "error": str(e)
        }), 500


# =========================================================
# DELETE LOT
# =========================================================

@routes.route(
    "/api/farmers/<int:farmer_id>/lots/<int:lot_id>",
    methods=["DELETE"]
)
def delete_lot(farmer_id, lot_id):

    lot = Lot.query.filter_by(
        id=lot_id,
        farmer_id=farmer_id
    ).first()

    if not lot:
        return jsonify({
            "success": False,
            "message": "Lot not found"
        }), 404

    try:

        db.session.delete(lot)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Lot deleted successfully"
        }), 200

    except Exception as e:

        db.session.rollback()

        print("DELETE LOT ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Failed to delete lot",
            "error": str(e)
        }), 500

@routes.route("/api/buyers", methods=["POST"])
def create_buyer():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    # ==========================================
    # GET DATA
    # ==========================================

    name = data.get("name")
    mobile = data.get("mobile")
    email = data.get("email")
    password = data.get("password")
    buyer_type = data.get("buyer_type")

    state = data.get("state")
    district = data.get("district")
    village = data.get("village")
    address = data.get("address")

    # ==========================================
    # VALIDATION
    # ==========================================

    if not name:
        return jsonify({
            "success": False,
            "message": "Buyer name is required"
        }), 400

    if not mobile:
        return jsonify({
            "success": False,
            "message": "Mobile number is required"
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "message": "Password is required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 6 characters"
        }), 400

    if not buyer_type:
        return jsonify({
            "success": False,
            "message": "Buyer type is required"
        }), 400

    if not state:
        return jsonify({
            "success": False,
            "message": "State is required"
        }), 400

    if not district:
        return jsonify({
            "success": False,
            "message": "District is required"
        }), 400

    if not village:
        return jsonify({
            "success": False,
            "message": "Village / City is required"
        }), 400

    # ==========================================
    # MOBILE VALIDATION
    # ==========================================

    if not mobile.isdigit() or len(mobile) != 10:
        return jsonify({
            "success": False,
            "message": "Enter a valid 10-digit mobile number"
        }), 400

    # ==========================================
    # CHECK EXISTING MOBILE
    # ==========================================

    existing_mobile = Buyer.query.filter_by(
        mobile=mobile
    ).first()

    if existing_mobile:

        return jsonify({
            "success": False,
            "message": "Mobile number already registered"
        }), 409

    # ==========================================
    # CHECK EXISTING EMAIL
    # ==========================================

    if email:

        existing_email = Buyer.query.filter_by(
            email=email
        ).first()

        if existing_email:

            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

    # ==========================================
    # CREATE BUYER
    # ==========================================

    try:

        hashed_password = generate_password_hash(
            password
        )

        buyer = Buyer(

            name=name,

            mobile=mobile,

            email=email if email else None,

            password_hash=hashed_password,

            buyer_type=buyer_type,

            state=state,

            district=district,

            village=village,

            address=address if address else None,

            status="Active"
        )

        db.session.add(buyer)

        db.session.commit()

        return jsonify({

            "success": True,

            "message": "Buyer registered successfully",

            "buyer_id": buyer.id

        }), 201

    except Exception as e:

        db.session.rollback()

        print("BUYER SIGNUP ERROR:", e)

        return jsonify({

            "success": False,

            "message": "Failed to register buyer",

            "error": str(e)

        }), 500

@routes.route('/api/buyer/login', methods=['POST'])
def buyer_login():
    data = request.get_json()

    mobile = data.get('mobile')
    password = data.get('password')

    if not mobile or not password:
        return jsonify({
            "success": False,
            "message": "Mobile number and password are required"
        }), 400

    buyer = Buyer.query.filter_by(mobile=mobile).first()

    if not buyer:
        return jsonify({
            "success": False,
            "message": "Invalid mobile number or password"
        }), 401

    if not check_password_hash(buyer.password_hash, password):
        return jsonify({
            "success": False,
            "message": "Invalid mobile number or password"
        }), 401

    if buyer.status != "Active":
        return jsonify({
            "success": False,
            "message": "Buyer account is inactive"
        }), 403

    return jsonify({
        "success": True,
        "message": "Login successful",
        "buyer": buyer.to_dict()
    }), 200

@routes.route(
    "/api/buyers/<int:buyer_id>",
    methods=["GET"]
)
def get_buyer(buyer_id):

    buyer = Buyer.query.get(buyer_id)

    if not buyer:

        return jsonify({
            "success": False,
            "message": "Buyer not found"
        }), 404

    return jsonify({
        "success": True,
        "buyer": buyer.to_dict()
    }), 200


    
@routes.route('/api/buyers/<int:buyer_id>/demands', methods=['GET'])
def get_buyer_demands(buyer_id):

    demands = Demand.query.filter_by(
        buyer_id=buyer_id
    ).order_by(
        Demand.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "demands": [
            demand.to_dict()
            for demand in demands
        ]
    }), 200

@routes.route('/api/lots', methods=['GET'])
def get_available_lots():

    try:

        lots = Lot.query.filter_by(
            status="Available"
        ).order_by(
            Lot.created_at.desc()
        ).all()

        result = []

        for lot in lots:

            result.append({
                "id": lot.id,
                "farmer_id": lot.farmer_id,

                "farmer_name": (
                    lot.farmer.name
                    if lot.farmer
                    else "Farmer"
                ),

                "crop": lot.crop,
                "variety": lot.variety,

                "quantity": lot.quantity,
                "unit": lot.unit,

                "quality_grade": lot.quality_grade,

                "expected_price": lot.expected_price,
                "minimum_price": lot.minimum_price,

                "available_from": (
                    lot.available_from.isoformat()
                    if lot.available_from
                    else None
                ),

                "expected_sale_date": (
                    lot.expected_sale_date.isoformat()
                    if lot.expected_sale_date
                    else None
                ),

                "pickup_location": lot.pickup_location,

                "state": lot.state,
                "district": lot.district,
                "village": lot.village,

                "description": lot.description,
                "packaging_type": lot.packaging_type,

                "status": lot.status,

                "created_at": (
                    lot.created_at.isoformat()
                    if lot.created_at
                    else None
                )
            })


        return jsonify({
            "success": True,
            "lots": result
        }), 200


    except Exception as e:

        print(
            "ERROR FETCHING LOTS:",
            e
        )

        return jsonify({
            "success": False,
            "message": "Failed to fetch lots",
            "error": str(e)
        }), 500

@routes.route('/api/buyers/<int:buyer_id>/matches', methods=['GET'])
def get_buyer_matches(buyer_id):
    try:
        buyer = Buyer.query.get(buyer_id)

        if not buyer:
            return jsonify({
                "success": False,
                "message": "Buyer not found"
            }), 404

        # Get buyer's active demands
        demands = Demand.query.filter_by(
            buyer_id=buyer_id,
            status="Active"
        ).all()

        matched_lots = []

        for demand in demands:

            lots = Lot.query.filter(
                Lot.status == "Available",
                Lot.crop.ilike(demand.crop)
            ).all()

            for lot in lots:

                # Optional variety matching
                if demand.variety:
                    if lot.variety and lot.variety.lower() != demand.variety.lower():
                        continue

                # Quality matching
                if demand.quality_grade:
                    if (
                        lot.quality_grade
                        and lot.quality_grade.lower() != demand.quality_grade.lower()
                    ):
                        continue

                # Minimum quantity
                if lot.quantity < demand.quantity:
                    continue

                # Price matching
                if demand.maximum_price is not None:
                    if (
                        lot.expected_price is not None
                        and lot.expected_price > demand.maximum_price
                    ):
                        continue

                matched_lots.append({
                    "lot_id": lot.id,
                    "demand_id": demand.id,

                    "farmer_id": lot.farmer_id,
                    "farmer_name": lot.farmer.name if lot.farmer else "Farmer",

                    "crop": lot.crop,
                    "variety": lot.variety,

                    "quantity": lot.quantity,
                    "unit": lot.unit,

                    "quality_grade": lot.quality_grade,

                    "expected_price": lot.expected_price,
                    "minimum_price": lot.minimum_price,

                    "available_from": (
                        lot.available_from.isoformat()
                        if lot.available_from else None
                    ),

                    "expected_sale_date": (
                        lot.expected_sale_date.isoformat()
                        if lot.expected_sale_date else None
                    ),

                    "pickup_location": lot.pickup_location,
                    "state": lot.state,
                    "district": lot.district,
                    "village": lot.village,

                    "description": lot.description,
                    "packaging_type": lot.packaging_type,

                    "status": lot.status,

                    "created_at": (
                        lot.created_at.isoformat()
                        if lot.created_at else None
                    )
                })

        return jsonify({
            "success": True,
            "matches": matched_lots
        }), 200

    except Exception as e:
        print("ERROR FETCHING MATCHED LOTS:", e)

        return jsonify({
            "success": False,
            "message": "Failed to fetch matched lots",
            "error": str(e)
        }), 500


@routes.route('/api/buyers/<int:buyer_id>/demands', methods=['POST'])
def create_buyer_demand(buyer_id):
    try:
        buyer = Buyer.query.get(buyer_id)

        if not buyer:
            return jsonify({
                "success": False,
                "message": "Buyer not found"
            }), 404

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400

        # Required fields
        required_fields = [
            "crop",
            "quantity",
            "unit",
            "quality_grade",
            "required_by",
            "state"
        ]

        for field in required_fields:
            if data.get(field) in [None, ""]:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        # ---------------------------------
        # CREATE DEMAND
        # ---------------------------------

        demand = Demand(
            buyer_id=buyer_id,

            crop=data["crop"],
            variety=data.get("variety"),

            quantity=float(data["quantity"]),
            unit=data["unit"],

            quality_grade=data["quality_grade"],

            minimum_price=(
                float(data["minimum_price"])
                if data.get("minimum_price") not in [None, ""]
                else None
            ),

            maximum_price=(
                float(data["maximum_price"])
                if data.get("maximum_price") not in [None, ""]
                else None
            ),

            required_by=datetime.strptime(
                data["required_by"],
                "%Y-%m-%d"
            ).date(),

            state=data["state"],
            district=data.get("district"),

            pickup_location=data.get("pickup_location"),

            packaging_requirement=data.get(
                "packaging_requirement"
            ),

            additional_requirements=data.get(
                "additional_requirements"
            ),

            status="Active"
        )

        db.session.add(demand)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Demand posted successfully",
            "demand": demand.to_dict()
        }), 201

    except ValueError as e:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Invalid date or numeric value",
            "error": str(e)
        }), 400

    except Exception as e:
        db.session.rollback()

        print("ERROR CREATING DEMAND:", e)

        return jsonify({
            "success": False,
            "message": "Failed to create demand",
            "error": str(e)
        }), 500