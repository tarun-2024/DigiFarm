import math
from typing import Dict
import pandas as pd


class SmartFarmerBuyerMatcher:
    def __init__(
        self,
        w_price: float = 0.35,
        w_dist: float = 0.25,
        w_trust: float = 0.20,
        w_qty: float = 0.20,
        max_distance_km: float = 300.0,
        transport_cost_per_tonne_km: float = 3.5
    ):

        self.w_p = w_price
        self.w_d = w_dist
        self.w_t = w_trust
        self.w_q = w_qty
        self.max_d = max_distance_km
        self.transport_cost_per_tonne_km = transport_cost_per_tonne_km


    @staticmethod
    def haversine_distance(lat1, lon1, lat2, lon2):

        R = 6371.0

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.asin(math.sqrt(a))

        return R * c


    def compute_match(
        self,
        lot: Dict,
        buyers_df: pd.DataFrame
    ) -> pd.DataFrame:

        results = []

            # Loop through every buyer
        for _, buyer in buyers_df.iterrows():

                # -------------------------
                # Distance
                # -------------------------
                dist_km = self.haversine_distance(
                    lot["lat"],
                    lot["lon"],
                    buyer["lat"],
                    buyer["lon"]
                )

                # -------------------------
                # Distance Score
                # -------------------------
                s_dist = max(
                    0.0,
                    100.0 * (1.0 - (dist_km / self.max_d))
                )

                # -------------------------
                # Price Score
                # -------------------------
                expected_p = lot["expected_price"]
                offered_p = buyer["offered_price"]

                s_price = (
                    min(100.0, (offered_p / expected_p) * 100.0)
                    if expected_p > 0
                    else 0.0
                )

                # -------------------------
                # Quantity Score
                # -------------------------
                q_lot = lot["quantity_tonnes"]
                q_req = buyer["req_quantity"]

                s_qty = (
                    (min(q_lot, q_req) / max(q_lot, q_req)) * 100.0
                    if max(q_lot, q_req) > 0
                    else 0.0
                )

                # -------------------------
                # Trust Score
                # -------------------------
                s_trust = float(buyer["trust_score"])

                # -------------------------
                # Match Score
                # -------------------------
                total_score = (
                    self.w_p * s_price
                    + self.w_d * s_dist
                    + self.w_t * s_trust
                    + self.w_q * s_qty
                )

                # -------------------------
                # Frontend data
                # -------------------------
                results.append({
                    "id": buyer["buyer_id"],
                    "name": buyer["buyer_type"],
                    "location": buyer["location"],
                    "crop": buyer["req_crop"],
                    "demand": buyer["req_quantity"],
                    "grade": buyer["req_grade"],
                    "offeredPrice": buyer["offered_price"],
                    "distance": round(dist_km, 1),
                    "trustScore": round(s_trust, 1),
                    "match": round(total_score, 2),
                    "verified": True
                })

        return pd.DataFrame(results)
# ==========================================
# Demonstration & Test Run
# ==========================================
if __name__ == "__main__":
    # Sample Mock Data
    lot = {
            "lot_id": "WB-POT-001",
            "farmer_name": "Ramesh Roy",
            "location": "Hooghly, WB",
            "lat": 22.8963,
            "lon": 88.2461,
            "crop": "Potato",
            "quantity_tonnes": 12.5,
            "grade": "B",
            "expected_price": 1500.0
        }

    buyer_demands = pd.DataFrame([
        {
            "buyer_id": "BUY-IND-01",
            "buyer_type": "FMCG Processor",
            "location": "Kolkata, WB",
            "lat": 22.5726,
            "lon": 88.3639,
            "req_crop": "Potato",
            "req_quantity": 15.0,
            "req_grade": "A",
            "offered_price": 1650.0,
            "trust_score": 94.0
        },
        {
            "buyer_id": "BUY-WHO-02",
            "buyer_type": "Wholesaler",
            "location": "Burdwan, WB",
            "lat": 23.2324,
            "lon": 87.8615,
            "req_crop": "Potato",
            "req_quantity": 10.0,
            "req_grade": "A",
            "offered_price": 1520.0,
            "trust_score": 88.0
        },
        {
            "buyer_id": "BUY-RET-03",
            "buyer_type": "Retail Chain",
            "location": "Siliguri, WB",
            "lat": 26.7271,
            "lon": 88.3953,
            "req_crop": "Potato",
            "req_quantity": 12.5,
            "req_grade": "B",
            "offered_price": 1750.0,
            "trust_score": 75.0
        }
    ])

    matcher = SmartFarmerBuyerMatcher()

    recommendations = matcher.compute_match(
        lot,
        buyer_demands
    )

    print("--- MATCHING RECOMMENDATIONS FOR LOT WB-POT-001 ---")
    print(
    recommendations[
        [
            "name",
            "location",
            "crop",
            "demand",
            "grade",
            "offeredPrice",
            "distance",
            "match",
            "trustScore",
            "verified"
        ]
    ].to_string(index=False)
)