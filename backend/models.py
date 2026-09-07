import pandas as pd
from datetime import datetime

from database import db




# =========================================
# BUYER
# =========================================

class Buyer(db.Model):
    __tablename__ = "buyers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    mobile = db.Column(
        db.String(15),
        unique=True,
        nullable=False
    )

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    buyer_type = db.Column(
        db.String(100),
        nullable=False
    )

    state = db.Column(
        db.String(100),
        nullable=False
    )

    district = db.Column(
        db.String(100),
        nullable=False
    )

    village = db.Column(
        db.String(100),
        nullable=False
    )

    address = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Active"
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "mobile": self.mobile,
            "email": self.email,
            "buyer_type": self.buyer_type,
            "state": self.state,
            "district": self.district,
            "village": self.village,
            "address": self.address,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }


# =========================================
# FARMER
# =========================================

class Farmer(db.Model):

    __tablename__ = "farmers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # -------------------------------------
    # BASIC INFORMATION
    # -------------------------------------

    name = db.Column(
        db.String(100),
        nullable=False
    )

    mobile = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    # Password should be stored as a HASH
    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    state = db.Column(
        db.String(100),
        nullable=False
    )

    district = db.Column(
        db.String(100),
        nullable=False
    )

    village = db.Column(
        db.String(150),
        nullable=False
    )

    language = db.Column(
        db.String(50),
        nullable=False
    )

    # -------------------------------------
    # FARM DETAILS
    # -------------------------------------

    farm_size = db.Column(
        db.Float,
        nullable=False
    )

    irrigation = db.Column(
        db.String(50),
        nullable=False
    )

    fpo_member = db.Column(
        db.Boolean,
        default=False
    )

    fpo_name = db.Column(
        db.String(150)
    )

    # -------------------------------------
    # SELLING PREFERENCES
    # -------------------------------------

    payment_need = db.Column(
        db.String(50),
        nullable=False
    )

    storage_available = db.Column(
        db.Boolean,
        default=False
    )

    storage_duration = db.Column(
        db.String(50)
    )

    minimum_price = db.Column(
        db.Float,
        nullable=False
    )

    # -------------------------------------
    # TIMESTAMP
    # -------------------------------------

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # -------------------------------------
    # CROPS
    # -------------------------------------

    crops = db.relationship(
        "Crop",
        backref="farmer",
        cascade="all, delete-orphan"
    )
    lots = db.relationship(
        "Lot",
        backref="farmer",
        lazy=True,
        cascade="all, delete-orphan"
    )


# =========================================
# CROP
# =========================================

class Crop(db.Model):

    __tablename__ = "crops"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    farmer_id = db.Column(
        db.Integer,
        db.ForeignKey("farmers.id"),
        nullable=False
    )

    crop = db.Column(
        db.String(100),
        nullable=False
    )

    variety = db.Column(
        db.String(100)
    )

    quantity = db.Column(
        db.Float,
        nullable=False
    )

    harvest_date = db.Column(
        db.Date,
        nullable=False
    )

    expected_selling_date = db.Column(
        db.Date,
        nullable=False
    )
class Lot(db.Model):
    __tablename__ = "lots"

    id = db.Column(db.Integer, primary_key=True)

    # =========================
    # FARMER
    # =========================

    farmer_id = db.Column(
        db.Integer,
        db.ForeignKey("farmers.id"),
        nullable=False
    )

    # =========================
    # CROP INFORMATION
    # =========================

    crop = db.Column(db.String(100), nullable=False)

    variety = db.Column(db.String(100))

    quantity = db.Column(db.Float, nullable=False)

    unit = db.Column(db.String(20), nullable=False, default="quintal")

    quality_grade = db.Column(
        db.String(50),
        nullable=False
    )

    # =========================
    # PRICE
    # =========================

    expected_price = db.Column(db.Float)

    minimum_price = db.Column(db.Float)

    # =========================
    # DATES
    # =========================

    available_from = db.Column(db.Date)

    expected_sale_date = db.Column(db.Date)

    # =========================
    # LOCATION
    # =========================

    pickup_location = db.Column(db.String(255))

    state = db.Column(db.String(100))

    district = db.Column(db.String(100))

    village = db.Column(db.String(100))

    # =========================
    # OTHER INFORMATION
    # =========================

    description = db.Column(db.Text)

    packaging_type = db.Column(db.String(100))

    # =========================
    # STATUS
    # =========================

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Available"
    )

    # =========================
    # TIMESTAMPS
    # =========================

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,

            "crop": self.crop,
            "variety": self.variety,
            "quantity": self.quantity,
            "unit": self.unit,
            "quality_grade": self.quality_grade,

            "expected_price": self.expected_price,
            "minimum_price": self.minimum_price,

            "available_from": (
                self.available_from.isoformat()
                if self.available_from else None
            ),

            "expected_sale_date": (
                self.expected_sale_date.isoformat()
                if self.expected_sale_date else None
            ),

            "pickup_location": self.pickup_location,

            "state": self.state,
            "district": self.district,
            "village": self.village,

            "description": self.description,
            "packaging_type": self.packaging_type,

            "status": self.status,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),

            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at else None
            )
        }
lots = db.relationship(
    "Lot",
    backref="farmer",
    lazy=True,
    cascade="all, delete-orphan"
)

class Demand(db.Model):
    __tablename__ = "demands"

    id = db.Column(db.Integer, primary_key=True)

    buyer_id = db.Column(
        db.Integer,
        db.ForeignKey("buyers.id"),
        nullable=False
    )

    crop = db.Column(db.String(100), nullable=False)
    variety = db.Column(db.String(100), nullable=True)

    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)

    quality_grade = db.Column(
        db.String(50),
        nullable=False
    )

    minimum_price = db.Column(
        db.Float,
        nullable=True
    )

    maximum_price = db.Column(
        db.Float,
        nullable=True
    )

    required_by = db.Column(
        db.Date,
        nullable=True
    )

    state = db.Column(
        db.String(100),
        nullable=True
    )

    district = db.Column(
        db.String(100),
        nullable=True
    )

    pickup_location = db.Column(
        db.String(255),
        nullable=True
    )

    packaging_requirement = db.Column(
        db.String(255),
        nullable=True
    )

    additional_requirements = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Active"
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def to_dict(self):

        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "crop": self.crop,
            "variety": self.variety,
            "quantity": self.quantity,
            "unit": self.unit,
            "quality_grade": self.quality_grade,
            "minimum_price": self.minimum_price,
            "maximum_price": self.maximum_price,
            "required_by": (
                self.required_by.isoformat()
                if self.required_by else None
            ),
            "state": self.state,
            "district": self.district,
            "pickup_location": self.pickup_location,
            "packaging_requirement": self.packaging_requirement,
            "additional_requirements": self.additional_requirements,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }
demands = db.relationship(
    "Demand",
    backref="buyer",
    lazy=True,
    cascade="all, delete-orphan"
)
    