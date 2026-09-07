'use client'

import React from 'react'
import {
  MapPin,
  Shield,
  CheckCircle,
  Calendar,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function BuyerCard({ buyer }) {

  // ==========================
  // BUYER DATA
  // ==========================

  const {
    id,
    name,
    buyer_type,
    state,
    district,
    village,
    status,
    demands = []
  } = buyer


  // ==========================
  // LOCATION
  // ==========================

  const location = [
    village,
    district,
    state
  ]
    .filter(Boolean)
    .join(', ')


  // ==========================
  // ACTIVE DEMANDS
  // ==========================

  const activeDemands = Array.isArray(demands)
    ? demands.filter(
        (demand) => demand.status === 'Active'
      )
    : []


  // ==========================
  // VERIFIED
  // ==========================

  const isVerified = status === 'Active'


  return (

    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-[#2d7d46] transition-all duration-200 shadow-sm">


      {/* ==========================
           BUYER HEADER
      ========================== */}

      <div className="flex items-start justify-between mb-4">

        <div className="min-w-0">

          <h3 className="font-bold text-lg text-[#2d2d2d] truncate">
            {name || 'Unknown Buyer'}
          </h3>

          {buyer_type && (
            <p className="text-sm text-gray-500 mt-1">
              {buyer_type}
            </p>
          )}

          <div className="flex items-start gap-2 mt-2">

            <MapPin
              size={15}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />

            <span className="text-sm text-gray-500">
              {location || 'Location not available'}
            </span>

          </div>

        </div>


        {/* ==========================
             VERIFIED
        ========================== */}

        {isVerified && (

          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">

            <CheckCircle size={14} />

            Verified

          </div>

        )}

      </div>


      {/* ==========================
           DEMANDS
      ========================== */}

      <div className="border-t border-gray-100 pt-4">

        <div className="flex items-center gap-2 mb-3">

          <Package
            size={17}
            className="text-[#2d7d46]"
          />

          <h4 className="font-semibold text-[#2d2d2d]">
            Current Requirements
          </h4>

        </div>


        {activeDemands.length > 0 ? (

          <div className="space-y-3">

            {activeDemands.map((demand) => (

              <div
                key={demand.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >

                {/* Crop + Quantity */}

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="font-semibold text-[#2d2d2d]">
                      {demand.crop || 'Crop not specified'}
                    </p>

                    {demand.variety && (

                      <p className="text-xs text-gray-500 mt-0.5">
                        Variety: {demand.variety}
                      </p>

                    )}

                  </div>


                  <div className="text-right">

                    <p className="font-semibold text-[#2d7d46]">
                      {demand.quantity || 0}
                    </p>

                    <p className="text-xs text-gray-500">
                      {demand.unit || ''}
                    </p>

                  </div>

                </div>


                {/* Demand Details */}

                <div className="grid grid-cols-2 gap-3 mt-3">


                  {/* Quality */}

                  <div>

                    <p className="text-xs text-gray-500">
                      Required Grade
                    </p>

                    <p className="text-sm font-medium text-gray-700">
                      {demand.quality_grade || 'Not specified'}
                    </p>

                  </div>


                  {/* Maximum Price */}

                  <div>

                    <p className="text-xs text-gray-500">
                      Maximum Price
                    </p>

                    <p className="text-sm font-medium text-gray-700">

                      {demand.maximum_price
                        ? `₹${Number(
                            demand.maximum_price
                          ).toLocaleString('en-IN')}`
                        : 'Not specified'}

                    </p>

                  </div>


                  {/* Minimum Price */}

                  {demand.minimum_price && (

                    <div>

                      <p className="text-xs text-gray-500">
                        Minimum Price
                      </p>

                      <p className="text-sm font-medium text-gray-700">

                        ₹{Number(
                          demand.minimum_price
                        ).toLocaleString('en-IN')}

                      </p>

                    </div>

                  )}


                  {/* Required By */}

                  {demand.required_by && (

                    <div>

                      <p className="text-xs text-gray-500">
                        Required By
                      </p>

                      <div className="flex items-center gap-1">

                        <Calendar
                          size={13}
                          className="text-gray-400"
                        />

                        <p className="text-sm font-medium text-gray-700">

                          {new Date(
                            demand.required_by
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }
                          )}

                        </p>

                      </div>

                    </div>

                  )}

                </div>


                {/* Pickup Location */}

                {demand.pickup_location && (

                  <div className="mt-3 pt-3 border-t border-gray-200">

                    <p className="text-xs text-gray-500">
                      Pickup Location
                    </p>

                    <p className="text-sm text-gray-700 mt-0.5">
                      {demand.pickup_location}
                    </p>

                  </div>

                )}


                {/* Packaging */}

                {demand.packaging_requirement && (

                  <div className="mt-2">

                    <p className="text-xs text-gray-500">
                      Packaging
                    </p>

                    <p className="text-sm text-gray-700 mt-0.5">
                      {demand.packaging_requirement}
                    </p>

                  </div>

                )}

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-gray-50 rounded-lg p-4 text-center">

            <p className="text-sm text-gray-500">
              No active demands
            </p>

          </div>

        )}

      </div>


      {/* ==========================
           TRUST / STATUS
      ========================== */}

      <div className="flex items-center gap-2 mt-4 mb-4">

        <Shield
          size={16}
          className="text-[#2d7d46]"
        />

        <span className="text-sm font-medium text-gray-700">
          {isVerified
            ? 'Verified Buyer'
            : 'Buyer'}
        </span>

      </div>


      {/* ==========================
           BUTTONS
      ========================== */}

      <div className="flex gap-3">

        <Link
          href={`/farmer/buyers/${id}`}
          className="flex-1 text-center border-2 border-[#1a4d3e] text-[#1a4d3e] rounded-lg py-2.5 text-sm font-medium hover:bg-[#e8f5e9] transition-colors"
        >
          View Buyer
        </Link>


        <button
          type="button"
          className="flex-1 bg-[#1a4d3e] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#153d32] transition-colors"
        >
          Make Deal
        </button>

      </div>

    </div>

  )
}