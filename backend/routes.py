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
def register_farmer():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received"
            }), 400

        # =========================================================
        # BASIC FARMER INFORMATION
        # =========================================================

        name = data.get("name")
        mobile = data.get("mobile")
        password = data.get("password")

        state = data.get("state")
        district = data.get("district")
        village = data.get("village")
        language = data.get("language")

        # =========================================================
        # FARM DETAILS
        # =========================================================

        farm_size = data.get("farmSize")
        irrigation = data.get("irrigation")

        fpo_member = data.get("fpoMember", False)
        fpo_name = data.get("fpoName")

        # =========================================================
        # SELLING PREFERENCES
        # =========================================================

        payment_need = data.get("paymentNeed")

        storage_available = data.get(
            "storageAvailable",
            False
        )

        storage_duration = data.get(
            "storageDuration"
        )

        minimum_price = data.get(
            "minimumPrice"
        )

        # =========================================================
        # CROPS
        # =========================================================

        crops = data.get("crops", [])

        # =========================================================
        # VALIDATION
        # =========================================================

        if not name:
            return jsonify({
                "success": False,
                "message": "Farmer name is required"
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

        if farm_size is None:
            return jsonify({
                "success": False,
                "message": "Farm size is required"
            }), 400

        if not irrigation:
            return jsonify({
                "success": False,
                "message": "Irrigation information is required"
            }), 400

        if not payment_need:
            return jsonify({
                "success": False,
                "message": "Payment preference is required"
            }), 400

        if minimum_price is None:
            return jsonify({
                "success": False,
                "message": "Minimum price is required"
            }), 400

        if not crops:
            return jsonify({
                "success": False,
                "message": "At least one crop is required"
            }), 400

        # =========================================================
        # CHECK EXISTING FARMER
        # =========================================================

        existing_farmer = Farmer.query.filter_by(
            mobile=mobile
        ).first()

        if existing_farmer:

            return jsonify({
                "success": False,
                "message": "Farmer with this mobile number already exists"
            }), 409

        # =========================================================
        # CONVERT FARMER VALUES
        # =========================================================

        try:
            farm_size = float(farm_size)
            minimum_price = float(minimum_price)

        except (TypeError, ValueError):

            return jsonify({
                "success": False,
                "message": "Farm size and minimum price must be numbers"
            }), 400

        # =========================================================
        # CONVERT STORAGE VALUE
        # =========================================================

        # Frontend may send:
        # "Yes" / "No"
        #
        # Database expects Boolean

        if isinstance(storage_available, str):

            storage_available = (
                storage_available.lower() == "yes"
            )

        else:

            storage_available = bool(
                storage_available
            )

        # =========================================================
        # CONVERT FPO VALUE
        # =========================================================

        if isinstance(fpo_member, str):

            fpo_member = (
                fpo_member.lower() == "yes"
                or fpo_member.lower() == "true"
            )

        else:

            fpo_member = bool(fpo_member)

        # =========================================================
        # CREATE FARMER
        # =========================================================

        farmer = Farmer(

            name=name,

            mobile=mobile,

            password_hash=generate_password_hash(
                password
            ),

            state=state,

            district=district,

            village=village,

            language=language,

            farm_size=farm_size,

            irrigation=irrigation,

            fpo_member=fpo_member,

            fpo_name=fpo_name,

            payment_need=payment_need,

            storage_available=storage_available,

            storage_duration=storage_duration,

            minimum_price=minimum_price
        )

        db.session.add(farmer)

        # =========================================================
        # GET FARMER ID
        # =========================================================

        db.session.flush()

        # =========================================================
        # CREATE CROPS + LOTS
        # =========================================================

        created_lots = []

        for index, crop_data in enumerate(crops):

            # -----------------------------------------------------
            # GET CROP DATA
            # -----------------------------------------------------

            crop_name = crop_data.get("crop")

            variety = crop_data.get(
                "variety"
            )

            quantity = crop_data.get(
                "quantity"
            )

            harvest_date = crop_data.get(
                "harvestDate"
            )

            expected_selling_date = crop_data.get(
                "expectedSellingDate"
            )

            # -----------------------------------------------------
            # VALIDATE CROP
            # -----------------------------------------------------

            if not crop_name:

                raise ValueError(
                    f"Crop is missing for crop #{index + 1}"
                )

            if quantity is None or quantity == "":

                raise ValueError(
                    f"Quantity is missing for crop #{index + 1}"
                )

            try:

                quantity = float(quantity)

            except (TypeError, ValueError):

                raise ValueError(
                    f"Invalid quantity for crop #{index + 1}"
                )

            if quantity <= 0:

                raise ValueError(
                    f"Quantity must be greater than 0 "
                    f"for crop #{index + 1}"
                )

            # -----------------------------------------------------
            # CONVERT HARVEST DATE
            # -----------------------------------------------------

            harvest = None

            if harvest_date:

                try:

                    harvest = datetime.strptime(
                        harvest_date,
                        "%Y-%m-%d"
                    ).date()

                except ValueError:

                    raise ValueError(
                        f"Invalid harvest date for "
                        f"crop #{index + 1}"
                    )

            # -----------------------------------------------------
            # CONVERT EXPECTED SELLING DATE
            # -----------------------------------------------------

            selling = None

            if expected_selling_date:

                try:

                    selling = datetime.strptime(
                        expected_selling_date,
                        "%Y-%m-%d"
                    ).date()

                except ValueError:

                    raise ValueError(
                        f"Invalid expected selling date "
                        f"for crop #{index + 1}"
                    )

            # =====================================================
            # SAVE TO crops TABLE
            # =====================================================

            crop = Crop(

                farmer_id=farmer.id,

                crop=crop_name,

                variety=variety,

                quantity=quantity,

                harvest_date=harvest,

                expected_selling_date=selling
            )

            db.session.add(crop)

            # =====================================================
            # SAVE TO lots TABLE
            # =====================================================

            lot = Lot(

                # Farmer
                farmer_id=farmer.id,

                # Crop information
                crop=crop_name,

                variety=variety,

                quantity=quantity,

                # ProduceStep quantity is in quintals
                unit="quintal",

                # ProduceStep does not collect grade
                quality_grade="Not Graded",

                # Price
                expected_price=minimum_price,

                minimum_price=minimum_price,

                # Dates
                available_from=harvest,

                expected_sale_date=selling,

                # Location
                pickup_location=village,

                state=state,

                district=district,

                village=village,

                # Other information
                description="Lot created during farmer registration",

                packaging_type=None,

                # Status
                status="Available"
            )

            db.session.add(lot)

            # Keep track of created lots
            created_lots.append(lot)

        # =========================================================
        # COMMIT
        # =========================================================

        db.session.commit()

        # =========================================================
        # RESPONSE
        # =========================================================

        return jsonify({

            "success": True,

            "message": "Farmer registered successfully",
            "farmer_id": farmer.id,

            "farmer": {

                "id": farmer.id,

                "name": farmer.name,

                "mobile": farmer.mobile
            },

            "lots_created": len(created_lots)

        }), 201

    # =============================================================
    # INVALID DATA
    # =============================================================

    except ValueError as e:

        db.session.rollback()

        print(
            "FARMER REGISTRATION VALIDATION ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 400

    # =============================================================
    # DATABASE / OTHER ERROR
    # =============================================================

    except Exception as e:

        db.session.rollback()

        print(
            "FARMER REGISTRATION ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": "Failed to register farmer"

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

@farmer_bp.route('/farmers/<int:farmer_id>', methods=['GET'])
def get_farmer(farmer_id):
    try:

        # =============================================
        # GET FARMER
        # =============================================

        farmer = Farmer.query.get(farmer_id)

        if not farmer:
            return jsonify({
                'success': False,
                'message': 'Farmer not found'
            }), 404


        # =============================================
        # GET FARMER LOTS
        # =============================================

        lots = Lot.query.filter_by(
            farmer_id=farmer_id
        ).order_by(
            Lot.created_at.desc()
        ).all()


        # =============================================
        # FARMING SUMMARY
        # =============================================

        total_lots = len(lots)

        active_lots = sum(
            1
            for lot in lots
            if str(lot.status or '').lower() == 'available'
        )

        sold_lots = sum(
            1
            for lot in lots
            if str(lot.status or '').lower()
            in ['sold', 'completed']
        )

        total_quantity = sum(
            float(lot.quantity or 0)
            for lot in lots
        )


        # =============================================
        # CROPS
        # =============================================

        crops = Crop.query.filter_by(
            farmer_id=farmer_id
        ).all()

        crop_list = []

        for crop in crops:

            crop_name = (
                getattr(crop, 'name', None)
                or getattr(crop, 'crop', None)
                or getattr(crop, 'crop_name', None)
            )

            if crop_name:
                crop_list.append(crop_name)


        # =============================================
        # RECENT LOTS
        # =============================================

        recent_lots = []

        for lot in lots[:5]:

            recent_lots.append({
                'id': lot.id,
                'crop': lot.crop,
                'variety': lot.variety,
                'quantity': lot.quantity,
                'unit': lot.unit,
                'quality_grade': lot.quality_grade,
                'expected_price': lot.expected_price,
                'status': lot.status,
                'created_at': (
                    lot.created_at.isoformat()
                    if lot.created_at
                    else None
                )
            })


        # =============================================
        # FARMER RESPONSE
        # =============================================

        farmer_data = {
            'id': farmer.id,
            'name': farmer.name,
            'mobile': farmer.mobile,
            'language': farmer.language,
            'state': farmer.state,
            'district': farmer.district,
            'village': farmer.village,
            'status': getattr(
                farmer,
                'status',
                'Active'
            ),

            # Farming summary
            'total_lots': total_lots,
            'active_lots': active_lots,
            'sold_lots': sold_lots,
            'total_quantity': total_quantity,

            # Crops
            'crops': crop_list,

            # Recent lots
            'recent_lots': recent_lots,

            # Account dates
            'created_at': (
                farmer.created_at.isoformat()
                if getattr(farmer, 'created_at', None)
                else None
            ),

            'updated_at': (
                farmer.updated_at.isoformat()
                if getattr(farmer, 'updated_at', None)
                else None
            )
        }


        return jsonify({
            'success': True,
            'farmer': farmer_data
        }), 200


    except Exception as e:
        db.session.rollback()

        print("======================================")
        print("GET FARMER PROFILE ERROR:")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("======================================")

        return jsonify({
            'success': False,
            'message': 'Failed to fetch farmer profile',
            'details': str(e)
        }), 500
# =========================================================
# GET ALL LOTS OF A FARMER
# =========================================================

@farmer_bp.route("/farmers/<int:farmer_id>/lots", methods=["GET"])
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

@farmer_bp.route(
    "/farmers/<int:farmer_id>/lots/<int:lot_id>",
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

@farmer_bp.route(
    "/farmers/<int:farmer_id>/lots",
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

    unit = unit or "quintal"
    quality_grade = quality_grade or "Not Graded"

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

@farmer_bp.route(
    "/farmers/<int:farmer_id>/lots/<int:lot_id>",
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

@farmer_bp.route(
    "/farmers/<int:farmer_id>/lots/<int:lot_id>",
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
@routes.route("/api/buyers", methods=["GET"])
def get_all_buyers():
    try:
        buyers = Buyer.query.order_by(
            Buyer.created_at.desc()
        ).all()

        result = []

        for buyer in buyers:

            # Only show active demands
            active_demands = Demand.query.filter_by(
                buyer_id=buyer.id,
                status="Active"
            ).order_by(
                Demand.created_at.desc()
            ).all()

            result.append({
                "id": buyer.id,
                "name": buyer.name,
                "mobile": buyer.mobile,
                "email": buyer.email,
                "buyer_type": buyer.buyer_type,

                "state": buyer.state,
                "district": buyer.district,
                "village": buyer.village,
                "address": buyer.address,

                "status": buyer.status,

                # Buyer demands
                "demands": [
                    {
                        "id": demand.id,
                        "crop": demand.crop,
                        "variety": demand.variety,
                        "quantity": demand.quantity,
                        "unit": demand.unit,
                        "quality_grade": demand.quality_grade,
                        "minimum_price": demand.minimum_price,
                        "maximum_price": demand.maximum_price,
                        "required_by": (
                            demand.required_by.isoformat()
                            if demand.required_by
                            else None
                        ),
                        "state": demand.state,
                        "district": demand.district,
                        "pickup_location": demand.pickup_location,
                        "packaging_requirement": demand.packaging_requirement,
                        "additional_requirements": demand.additional_requirements,
                        "status": demand.status
                    }
                    for demand in active_demands
                ]
            })

        return jsonify({
            "success": True,
            "buyers": result
        }), 200

    except Exception as e:

        print("ERROR FETCHING BUYERS:", str(e))

        return jsonify({
            "success": False,
            "error": "Failed to fetch buyers",
            "details": str(e)
        }), 500

# backend/routes.py or wherever your routes are

@farmer_bp.route('/farmers/<int:farmer_id>', methods=['PUT'])
def update_farmer(farmer_id):
    try:

        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        farmer = Farmer.query.get(farmer_id)

        if not farmer:
            return jsonify({
                'success': False,
                'message': 'Farmer not found'
            }), 404

        # =============================================
        # UPDATE ALLOWED FIELDS
        # =============================================

        if 'name' in data:
            farmer.name = data['name']

        if 'language' in data:
            farmer.language = data['language']

        if 'state' in data:
            farmer.state = data['state']

        if 'district' in data:
            farmer.district = data['district']

        if 'village' in data:
            farmer.village = data['village']

        if 'address' in data:
            farmer.address = data['address']

        # ------------------------------------------------
        # Mobile intentionally not updated here.
        # It is unique and should not be changed casually.
        # ------------------------------------------------

        db.session.commit()

        # =============================================
        # RETURN UPDATED FARMER
        # =============================================

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'farmer': {
                'id': farmer.id,
                'name': farmer.name,
                'mobile': farmer.mobile,
                'language': farmer.language,
                'state': farmer.state,
                'district': farmer.district,
                'village': farmer.village,
                'address': farmer.address
            }
        }), 200

    except Exception as e:

        db.session.rollback()

        print('UPDATE FARMER ERROR:', str(e))

        return jsonify({
            'success': False,
            'message': 'Failed to update farmer profile'
        }), 500
# backend/routes.py

@routes.route('/api/buyers/<int:buyer_id>', methods=['PUT'])
def update_buyer(buyer_id):

    try:

        # =============================================
        # GET REQUEST DATA
        # =============================================

        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400


        # =============================================
        # FIND BUYER
        # =============================================

        buyer = Buyer.query.get(buyer_id)

        if not buyer:
            return jsonify({
                'success': False,
                'message': 'Buyer not found'
            }), 404


        # =============================================
        # UPDATE EDITABLE FIELDS
        # =============================================

        if 'name' in data:
            buyer.name = data['name']

        if 'email' in data:
            buyer.email = data['email']

        if 'buyer_type' in data:
            buyer.buyer_type = data['buyer_type']

        if 'state' in data:
            buyer.state = data['state']

        if 'district' in data:
            buyer.district = data['district']

        if 'village' in data:
            buyer.village = data['village']

        if 'address' in data:
            buyer.address = data['address']


        # =============================================
        # SAVE TO DATABASE
        # =============================================

        db.session.commit()


        # =============================================
        # RESPONSE
        # =============================================

        return jsonify({
            'success': True,
            'message': 'Buyer profile updated successfully',

            'buyer': buyer.to_dict()
        }), 200


    except Exception as e:

        db.session.rollback()

        print('======================================')
        print('UPDATE BUYER ERROR:')
        print(type(e).__name__)
        print(str(e))
        print('======================================')

        return jsonify({
            'success': False,
            'message': 'Failed to update buyer profile',
            'details': str(e)
        }), 500